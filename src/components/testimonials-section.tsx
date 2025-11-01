import type { Testimonial } from '@/data/schema';
import { Container } from '@/components/container';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-gradient-to-br from-white via-amber-50 to-amber-100 py-16"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="testimonials-heading" className="text-2xl font-semibold text-zinc-900">
            Cerita Pelanggan
          </h2>
          <p className="mt-3 text-sm text-zinc-600">
            Mereka sudah mencoba Maher Bites untuk momen spesial maupun ngemil harian.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={`${testimonial.name}-${testimonial.message}`}
              className="flex h-full flex-col rounded-3xl border border-amber-100 bg-white p-6 text-left shadow-sm"
            >
              <div className="text-amber-500">
                {'★'.repeat(Math.round(testimonial.rating))}
                <span className="sr-only">{testimonial.rating} dari 5 bintang</span>
              </div>
              <p className="mt-3 text-sm text-zinc-700">“{testimonial.message}”</p>
              <footer className="mt-auto pt-4 text-sm font-semibold text-zinc-900">
                {testimonial.name}
                {testimonial.handle ? (
                  <span className="ml-2 text-xs font-medium text-zinc-500">{testimonial.handle}</span>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
