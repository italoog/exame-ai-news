'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, List, ListOrdered, Quote,
  Heading2, Heading3, Link2, ImageIcon, Undo, Redo, Code,
} from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Escreva seu artigo aqui...' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-zinc max-w-none min-h-[400px] focus:outline-none px-4 py-3',
      },
    },
  })

  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    isActive = false,
    title,
    children,
  }: {
    onClick: () => void
    isActive?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-zinc-100 transition-colors ${
        isActive ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-600'
      }`}
    >
      {children}
    </button>
  )

  function addLink() {
    const url = window.prompt('URL do link:')
    if (url) editor!.chain().focus().setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt('URL da imagem:')
    if (url) editor!.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-zinc-200 bg-zinc-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Código inline"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Título H2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Título H3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Inserir link">
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Inserir imagem">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-300 mx-1 ml-auto" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
