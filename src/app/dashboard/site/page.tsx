import { getSEOConfig, getSite } from "@/data/site";
import DashboardSiteClientPage from "./page-client";

export default async function DashboardSitePage() {
  const [site, seo] = await Promise.all([getSite(), getSEOConfig()]);
  return <DashboardSiteClientPage site={site} seo={seo} />;
}
