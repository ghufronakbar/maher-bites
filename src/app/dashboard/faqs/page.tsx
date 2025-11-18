import { getFAQs } from '@/data/faqs';
import DashboardFAQsClientPage from './page-client';

export default async function DashboardFAQsPage() {
  const faqs = await getFAQs();
  return <DashboardFAQsClientPage faqs={faqs} />;
}
