import { useState } from "react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a tour package?",
      answer:
        "You can book a tour package by contacting us through our website, calling us at 8248596124, or sending us a WhatsApp message. Our travel experts will guide you through the booking process and help you choose the perfect package.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including bank transfers, credit/debit cards, and online payment gateways. Our team will provide you with detailed payment instructions during the booking process.",
    },
    {
      question: "Can I customize my tour package?",
      answer:
        "Yes! All our packages are 100% customizable. We can modify the itinerary, hotels, activities, and duration according to your preferences and budget. Just let us know your requirements and we'll create a personalized package for you.",
    },
    {
      question: "Do you provide visa assistance?",
      answer:
        "Yes, we provide complete visa assistance including document preparation, application submission, and tracking. Our team will guide you through the entire visa process to ensure a smooth experience.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Our cancellation policy varies depending on the package and travel dates. Generally, cancellations made 30+ days before departure receive a higher refund percentage. Please refer to our detailed Cancellation Policy page or contact us for specific information about your booking.",
    },
    {
      question: "Is travel insurance included in the packages?",
      answer:
        "Travel insurance is not automatically included in our packages but we highly recommend it. We can arrange comprehensive travel insurance for you as an add-on to your package.",
    },
    {
      question: "What languages do your tour guides speak?",
      answer:
        "Our tour guides are proficient in English and Hindi. For specific language requirements, please inform us during booking and we'll do our best to accommodate your needs.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 2-3 months in advance, especially for international destinations and peak travel seasons. However, we can also arrange last-minute bookings subject to availability.",
    },
    {
      question: "Do you offer group discounts?",
      answer:
        "Yes, we offer special discounts for group bookings of 4 or more travelers. Contact us with your group size and requirements for a customized quote.",
    },
    {
      question: "What happens if I need to make changes after booking?",
      answer:
        "We understand that plans can change. You can request modifications to your booking by contacting our support team. Changes are subject to availability and may incur additional charges depending on the nature and timing of the changes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to help you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg inline-block"
            >
              Contact Us
            </a>
            <a
              href="https://wa.me/918248596124"
              className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition shadow-lg inline-block"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
