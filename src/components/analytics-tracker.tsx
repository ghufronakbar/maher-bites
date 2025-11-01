'use client';

import { usePageView } from '@/hooks/use-page-view';

export function AnalyticsTracker() {
  usePageView();
  return null;
}
