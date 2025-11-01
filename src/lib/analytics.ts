type AnalyticsEvent = {
  event: string;
  payload?: Record<string, unknown>;
};

const queue: AnalyticsEvent[] = [];

export function trackPageView(pathname: string) {
  const payload = { pathname, timestamp: Date.now() };
  queue.push({ event: 'page_view', payload });
  // Placeholder: replace with actual analytics integration later.
  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics] page_view', payload);
  }
}

export function trackWAEvent(payload: Record<string, unknown>) {
  queue.push({ event: 'wa_click', payload });
  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics] wa_click', payload);
  }
}

export function getAnalyticsQueue() {
  return [...queue];
}
