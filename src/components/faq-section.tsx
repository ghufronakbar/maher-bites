import type { FAQ } from '@prisma/client';
import { Container } from '@/components/container';

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="bg-white py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="faq-heading" className="text-2xl font-semibold text-zinc-900">
            Pertanyaan Populer
          </h2>
          <p className="mt-3 text-sm text-zinc-600">
            Masih ragu? Kami rangkum jawaban atas pertanyaan yang sering muncul.
          </p>
        </div>
        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-3xl border border-amber-100 bg-amber-50/50 p-6 shadow-sm"
            >
              <summary className="cursor-pointer list-none text-left text-lg font-semibold text-zinc-900">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
