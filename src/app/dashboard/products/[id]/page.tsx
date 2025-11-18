import { getAllCategories } from "@/data/categories";
import { getAllProducts } from "@/data/products";
import DashboardProductDetailClientPage from "./page-client";

export default async function DashboardProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);
  const product = products.find((item) => item.id === id);

  return (
    <DashboardProductDetailClientPage
      product={product}
      categories={categories}
      isNew={id === "new"}
    />
  );
}
