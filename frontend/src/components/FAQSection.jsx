import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    "question": "How does the AI Travel Agent book my trip?",
    "answer": "Our AI travel agent chats with you in real time at the bottom-right corner. It answers package questions, collects your preferred travel start date and guest count, validates package availability in our catalog, and automatically links the reservation to your signed-in Clerk account."
  },
  {
    "question": "What is the policy for modifying or changing a booking?",
    "answer": "You can modify your booking details (such as travel dates or guest count) directly through the AI chat widget or your dashboard, provided the request is made at least 24 hours prior to your scheduled trip start date."
  },
  {
    "question": "How far in advance can I book a trip?",
    "answer": "You can book trips for any future date up to 6 months from today. Bookings for past dates or beyond the 6-month window cannot be processed."
  },
  {
    "question": "What is the cancellation and refund policy?",
    "answer": "You can cancel up to 7 days before your trip start date for a full 100% refund with no hidden charges. Cancellations requested within 24 hours of departure are non-refundable."
  },
  {
    "question": "Are international flight tickets included in packages?",
    "answer": "Our packages cover luxury accommodations, ground transportation, local transfers, and guided tours. Flights can be customized during your AI booking consultation."
  },
  {
    "question": "Can I customize an existing package or hotel preference?",
    "answer": "Yes! Simply tell our AI agent your preferred room type, hotel rating, or specific activities during your chat to tailor your package."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-sky-600 font-semibold text-sm uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" /> Need Assistance?
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden transition"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-800 hover:text-sky-600 transition cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-sky-600' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}