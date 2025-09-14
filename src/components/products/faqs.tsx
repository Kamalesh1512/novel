import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqs } from "@/lib/constants/types";

interface faqsProps {
  faqs: faqs[];
}

const FAQs = ({ faqs }: faqsProps) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="text-center text-gray-500">
          No FAQs available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-inset"
            >
              <span className="font-semibold text-green-800 pr-4 leading-relaxed">
                {faq.question}
              </span>
              <div className="flex-shrink-0 ml-2">
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-green-600 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-green-600 transition-transform duration-200" />
                )}
              </div>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-6 py-4 bg-white border-t border-green-50">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
