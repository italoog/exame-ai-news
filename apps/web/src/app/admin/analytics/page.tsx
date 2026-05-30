import type { Metadata } from 'next'
import AnalyticsClient from './analytics-client'

export const metadata: Metadata = {
  title: 'Analytics | Admin',
}

export default function AdminAnalyticsPage() {
  return <AnalyticsClient />
}
