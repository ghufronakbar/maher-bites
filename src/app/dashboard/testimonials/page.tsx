import { getTestimonials } from "@/data/testimonials";
import DashboardTestimonialsClientPage from "./page-client";

export default async function DashboardTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <DashboardTestimonialsClientPage testimonials={testimonials} />;
}
