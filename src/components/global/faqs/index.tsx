// components/FAQ.tsx
import { JSX, useState } from "react";


interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl shadow-sm"
        >
          <h3
            className="faq-label cursor-pointer p-4 flex justify-between items-center text-gray-800 font-semibold text-lg"
            onClick={() => toggleItem(index)}
          >
            {item.question}
            <span className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-45" : "rotate-0"} inline-block w-5 h-5 border-b-2 border-r-2 border-gray-500`} />
          </h3>
          <div
            className={`faq-cont px-4 pb-4 text-gray-600 transition-all duration-300 overflow-hidden ${
              openIndex === index ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
