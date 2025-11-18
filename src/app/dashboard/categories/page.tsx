import { getAllCategories } from '@/data/categories';
import DashboardCategoriesClientPage from './page-client';

export default async function DashboardCategoriesPage() {
  const categories = await getAllCategories();
  return <DashboardCategoriesClientPage categories={categories} />;
}
