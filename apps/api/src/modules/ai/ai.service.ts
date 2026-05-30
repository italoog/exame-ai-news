import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import OpenAI from 'openai';
import { Response } from 'express';
import { PrismaService } from '../../database/prisma.service';
import { QUEUE_AI_SUMMARY, QUEUE_TRENDING } from '../queue/queue.module';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;
  private openaiGroq: OpenAI | null = null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    @InjectQueue(QUEUE_AI_SUMMARY) private aiSummaryQueue: Queue,
    @InjectQueue(QUEUE_TRENDING) private trendingQueue: Queue,
  ) {
    const geminiKey = config.get<string>('GEMINI_API_KEY');
    const groqKey = config.get<string>('GROQ_API_KEY');
    const openaiKey = config.get<string>('OPENAI_API_KEY');

    if (geminiKey) {
      this.openai = new OpenAI({
        apiKey: geminiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      });
      this.logger.log('IA: usando Google Gemini (gemini-2.0-flash)');
    } else if (groqKey) {
      this.openai = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      this.logger.log('IA: usando Groq (llama-3.3-70b-versatile)');
    } else if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
      this.logger.log('IA: usando OpenAI (gpt-4o-mini)');
    } else {
      this.logger.warn(
        'Nenhuma chave de IA configurada (GEMINI_API_KEY / GROQ_API_KEY / OPENAI_API_KEY) — usando sumarização local',
      );
    }

    // Groq como fallback independente (ativado quando Gemini é o primário)
    if (geminiKey && groqKey) {
      this.openaiGroq = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      this.logger.log('IA: Groq configurado como fallback');
    }
  }

  async enqueueAiSummary(articleId: string, title: string, content: string): Promise<void> {
    await this.aiSummaryQueue.add(
      'generate-summary',
      { articleId, title, content },
      { delay: 1000 },
    );
    this.logger.log(`Job de resumo enfileirado para artigo ${articleId}`);
  }

  async enqueueTrendingCalculation(): Promise<void> {
    await this.trendingQueue.add(
      'calculate-trending',
      {},
      { jobId: 'trending-calc', removeOnComplete: true },
    );
  }

  async generateSummary(title: string, content: string): Promise<string> {
    const plainContent = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const truncated = plainContent.slice(0, 3000);

    if (this.openai) {
      try {
        const isGroq = this.openai.baseURL?.includes('groq');
        const isGemini = this.openai.baseURL?.includes('googleapis');
        const model = isGroq
          ? 'llama-3.3-70b-versatile'
          : isGemini
            ? 'gemini-2.0-flash'
            : 'gpt-4o-mini';
        const response = await this.openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content:
                'Você é um editor da revista EXAME. Gere um resumo executivo em português de 2-3 frases para o artigo fornecido, destacando os pontos mais importantes.',
            },
            {
              role: 'user',
              content: `Título: ${title}\n\nConteúdo: ${truncated}`,
            },
          ],
          max_tokens: 200,
          temperature: 0.5,
        });
        return response.choices[0]?.message?.content ?? this.localSummary(plainContent);
      } catch (err) {
        this.logger.error('Provedor primário falhou, tentando Groq como fallback', err);
        if (this.openaiGroq) {
          try {
            const groqResp = await this.openaiGroq.chat.completions.create({
              model: 'llama-3.3-70b-versatile',
              messages: [
                {
                  role: 'system',
                  content:
                    'Você é um editor da revista EXAME. Gere um resumo executivo em português de 2-3 frases para o artigo fornecido, destacando os pontos mais importantes.',
                },
                { role: 'user', content: `Título: ${title}\n\nConteúdo: ${truncated}` },
              ],
              max_tokens: 200,
              temperature: 0.5,
            });
            this.logger.log('Resumo gerado com sucesso via Groq (fallback)');
            return groqResp.choices[0]?.message?.content ?? this.localSummary(plainContent);
          } catch (groqErr) {
            this.logger.error('Groq também falhou, usando sumarização local', groqErr);
          }
        }
        return this.localSummary(plainContent);
      }
    }

    return this.localSummary(plainContent);
  }

  async streamChat(
    articleId: string,
    question: string,
    history: ChatMessage[],
    res: Response,
  ): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { title: true, content: true, summary: true, aiSummary: true },
    });

    if (!article) {
      res.write('Artigo não encontrado.');
      return;
    }

    const plainContent = article.content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    const systemPrompt = [
      'Você é um assistente jornalístico da revista EXAME.',
      'Responda perguntas sobre o artigo abaixo de forma concisa e em português.',
      'Baseie-se apenas nas informações do artigo.',
      'Se a resposta não estiver no artigo, diga que não encontrou essa informação no texto.',
      '',
      `ARTIGO: "${article.title}"`,
      article.aiSummary ? `RESUMO: ${article.aiSummary}` : '',
      `CONTEÚDO:\n${plainContent}`,
    ]
      .filter(Boolean)
      .join('\n');

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: question },
    ];

    // Usa Groq (fallback) como preferência para chat — mais confiável em produção
    const provider = this.openaiGroq ?? this.openai;
    if (!provider) {
      res.write('Serviço de IA não configurado.');
      return;
    }

    const isGroq = provider.baseURL?.includes('groq');
    const isGemini = provider.baseURL?.includes('googleapis');
    const model = isGroq
      ? 'llama-3.3-70b-versatile'
      : isGemini
        ? 'gemini-2.0-flash'
        : 'gpt-4o-mini';

    try {
      const stream = await provider.chat.completions.create({
        model,
        messages,
        stream: true,
        max_tokens: 500,
        temperature: 0.3,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) res.write(text);
      }
    } catch (err) {
      this.logger.error('Erro no streaming do chat IA', err);
      res.write('\n\nDesculpe, não consegui processar sua pergunta no momento.');
    }
  }

  async suggestTags(title: string, content: string): Promise<string[]> {
    const plainContent = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2000);

    const provider = this.openaiGroq ?? this.openai;
    if (!provider) return this.extractTagsLocally(plainContent);

    const isGroq = provider.baseURL?.includes('groq');
    const isGemini = provider.baseURL?.includes('googleapis');
    const model = isGroq
      ? 'llama-3.3-70b-versatile'
      : isGemini
        ? 'gemini-2.0-flash'
        : 'gpt-4o-mini';

    try {
      const response = await provider.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              'Você é um editor de uma revista de negócios. Dado um artigo, sugira entre 3 e 6 tags relevantes em português, no formato slug (minúsculas, sem acentos, separadas por hífen onde necessário). Retorne APENAS as tags separadas por vírgula, sem nenhuma explicação ou texto adicional.',
          },
          {
            role: 'user',
            content: `Título: ${title}\n\nConteúdo: ${plainContent}`,
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      });

      const raw = response.choices[0]?.message?.content ?? '';
      return raw
        .split(',')
        .map((t) =>
          t
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, ''),
        )
        .filter((t) => t.length > 1)
        .slice(0, 6);
    } catch (err) {
      this.logger.warn('Falha ao sugerir tags via IA, usando extração local', err);
      return this.extractTagsLocally(plainContent);
    }
  }

  private extractTagsLocally(text: string): string[] {
    const stopWords = new Set([
      'de',
      'da',
      'do',
      'em',
      'no',
      'na',
      'para',
      'com',
      'uma',
      'um',
      'os',
      'as',
      'que',
      'por',
      'mais',
      'como',
      'se',
      'ao',
      'dos',
      'das',
      'pelo',
      'pela',
      'sobre',
      'entre',
      'isso',
      'este',
      'esta',
      'esse',
    ]);
    const freq: Record<string, number> = {};
    for (const word of text.toLowerCase().split(/\s+/)) {
      const cleaned = word.replace(/[^a-záéíóúãõ]/g, '');
      if (cleaned.length > 4 && !stopWords.has(cleaned)) {
        freq[cleaned] = (freq[cleaned] ?? 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  private localSummary(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
    return sentences.slice(0, 3).join(' ').trim() || text.slice(0, 300);
  }
}
