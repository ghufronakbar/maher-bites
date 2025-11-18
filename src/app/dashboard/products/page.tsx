import { getAllCategories } from "@/data/categories";
import { getAllProducts } from "@/data/products";
import DashboardProductsPage from "./page-client";

export default async function DashboardProductsServerPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);
  const searchParams = await props.searchParams;
  const filter = Array.isArray(searchParams?.filter)
    ? searchParams?.filter?.[0]
    : searchParams?.filter ?? undefined;

  return (
    <DashboardProductsPage
      products={products}
      categories={categories}
      filter={filter}
    />
  );
}
