"use client";
import { useState, useEffect } from "react";

export default function TermsConditions() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (sectionId:any) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 leading-relaxed">
      <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-5 mb-10">
        {/* Header */}
        <div className="text-center mb-10 pb-5 border-b-2 border-blue-500">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600 text-lg font-medium">Alma Boss - Cosmetic, Personal Care & Lifestyle Products</p>
          <div className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-3 rounded-full text-sm font-semibold mt-2">
            Effective & Legally Compliant
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-gray-100 p-4 rounded-md mb-8 text-center font-medium">
          <strong>Last Updated:</strong> {new Date().toLocaleDateString("en-IN")}
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-50 p-5 rounded-md mb-8">
          <h3 className="text-blue-500 text-lg font-semibold mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            <li><button onClick={() => scrollToSection("acceptance")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">1. Acceptance of Terms</button></li>
            <li><button onClick={() => scrollToSection("eligibility")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">2. Eligibility</button></li>
            <li><button onClick={() => scrollToSection("products")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">3. Products & Services</button></li>
            <li><button onClick={() => scrollToSection("orders")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">4. Orders & Payments</button></li>
            <li><button onClick={() => scrollToSection("shipping")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">5. Shipping & Delivery</button></li>
            <li><button onClick={() => scrollToSection("returns")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">6. Returns & Refunds</button></li>
            <li><button onClick={() => scrollToSection("intellectual")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">7. Intellectual Property</button></li>
            <li><button onClick={() => scrollToSection("conduct")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">8. User Conduct</button></li>
            <li><button onClick={() => scrollToSection("liability")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">9. Limitation of Liability</button></li>
            <li><button onClick={() => scrollToSection("governing")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">10. Governing Law and Jurisdiction</button></li>
            <li><button onClick={() => scrollToSection("contact")} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">11. Contact Us</button></li>
          </ul>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <div className="mb-9" id="acceptance">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">1. Acceptance of Terms</h2>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md my-5">
            <p className="text-justify">
              By using our website www.almaboss.in, you agree to be bound by
              these Terms and Conditions, our Privacy Policy, and any other
              policies posted on our website. If you do not agree, please do
              not use our services.
            </p>
          </div>
        </div>

        {/* Section 2: Eligibility */}
        <div className="mb-9" id="eligibility">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">2. Eligibility</h2>
          <p className="mb-4 text-justify">
            You must be at least 18 years of age or accessing the website
            under the supervision of a legal guardian to use the platform.
          </p>
        </div>

        {/* Section 3: Products & Services */}
        <div className="mb-9" id="products">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">3. Products & Services</h2>
          <p className="mb-4 text-justify">
            We sell cosmetic, personal care, and lifestyle products. All
            product descriptions and pricing are subject to change without
            notice. We reserve the right to discontinue or modify products
            without liability.
          </p>
        </div>

        {/* Section 4: Orders & Payments */}
        <div className="mb-9" id="orders">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">4. Orders & Payments</h2>
          <p className="mb-4 text-justify">
            Orders are confirmed only after successful payment. We accept
            multiple payment methods:
          </p>
          <ul className="ml-5 mb-4 space-y-2">
            <li>UPI (Unified Payments Interface)</li>
            <li>Net Banking</li>
            <li>Debit/Credit Cards</li>
            <li>Digital Wallets</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md my-5">
            <strong>Important:</strong> Alma reserves the right to refuse or
            cancel any order due to pricing errors, product unavailability, or
            suspected fraud.
          </div>
        </div>

        {/* Section 5: Shipping & Delivery */}
        <div className="mb-9" id="shipping">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">5. Shipping & Delivery</h2>
          <p className="mb-4 text-justify">
            Delivery timelines vary based on your location. Shipping charges
            and estimated delivery times are shown during checkout.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md my-5">
            <strong>Note:</strong> Alma is not liable for delays caused by
            courier partners, natural disasters, or governmental restrictions.
          </div>
        </div>

        {/* Section 6: Returns & Refunds */}
        <div className="mb-9" id="returns">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">6. Returns & Refunds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-green-500">
              <h4 className="text-green-500 font-semibold mb-2">Return Eligibility</h4>
              <p className="text-sm">
                Returns are accepted only for damaged, defective, or incorrect
                products.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-green-500">
              <h4 className="text-green-500 font-semibold mb-2">Return Timeline</h4>
              <p className="text-sm">
                You must raise a return request within 7 days of delivery.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-green-500">
              <h4 className="text-green-500 font-semibold mb-2">Refund Processing</h4>
              <p className="text-sm">
                Refunds (if applicable) will be processed within 7–10 working
                days post approval.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7: Intellectual Property */}
        <div className="mb-9" id="intellectual">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">7. Intellectual Property</h2>
          <p className="mb-4 text-justify">
            All content on this site including logos, graphics, text, images,
            and software is the property of Alma and is protected under
            applicable Indian laws. Unauthorized use is prohibited.
          </p>
        </div>

        {/* Section 8: User Conduct */}
        <div className="mb-9" id="conduct">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">8. User Conduct</h2>
          <p className="mb-4 text-justify">Users agree not to:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-red-500">
              <h4 className="text-red-500 font-semibold mb-2">False Information</h4>
              <p className="text-sm">Use false information or impersonate another person</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-red-500">
              <h4 className="text-red-500 font-semibold mb-2">Harmful Content</h4>
              <p className="text-sm">Post harmful, offensive, or abusive content</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-red-500">
              <h4 className="text-red-500 font-semibold mb-2">System Interference</h4>
              <p className="text-sm">
                Interfere with the site's functioning or attempt any hacking
                or phishing
              </p>
            </div>
          </div>
        </div>

        {/* Section 9: Limitation of Liability */}
        <div className="mb-9" id="liability">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">9. Limitation of Liability</h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md my-5">
            <strong>Important Legal Notice:</strong> Alma shall not be liable
            for any indirect, incidental, special, or consequential damages
            arising out of the use of our services.
          </div>
        </div>

        {/* Section 10: Governing Law and Jurisdiction */}
        <div className="mb-9" id="governing">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">10. Governing Law and Jurisdiction</h2>
          <p className="mb-4 text-justify">
            These terms shall be governed by the laws of India. Any disputes
            shall be subject to the exclusive jurisdiction of courts in
            Mysuru, Karnataka.
          </p>
        </div>

        {/* Section 11: Contact Us */}
        <div className="mb-9" id="contact">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">11. Contact Us</h2>
          <div className="bg-green-50 border border-green-200 p-5 rounded-md mt-8">
            <h3 className="text-green-800 font-semibold mb-2">Need Help? Contact Us</h3>
            <p className="mb-2">For any questions regarding these Terms, please contact:</p>
            <p className="mb-2">
              <strong>Email:</strong>{" "}
              <a href="mailto:ask@almaboss.in" className="text-green-800 hover:underline">ask@almaboss.in</a>
            </p>
            <p className="mb-2">
              <strong>Phone:</strong>{" "}
              <a href="tel:+919845398453" className="text-green-800 hover:underline">+91 98453 98453</a>
            </p>
            <p className="mb-2">
              <strong>Registered Address:</strong> 65A, KIADB Hootagalli
              Industrial Area, Mysuru – 570018, Karnataka, India
            </p>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="max-w-4xl mx-auto mb-8 px-5">
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div className="bg-white p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-1 text-sm">Website</h4>
              <p className="font-medium">almaboss.in</p>
            </div>
            <div className="bg-white p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-1 text-sm">Email</h4>
              <p className="font-medium">ask@almaboss.in</p>
            </div>
            <div className="bg-white p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-1 text-sm">Phone</h4>
              <p className="font-medium">+91 98453 98453</p>
            </div>
            <div className="bg-white p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-1 text-sm">Company</h4>
              <p className="font-medium">Alma</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        className={`fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all duration-300 z-50 ${showBackToTop ? 'opacity-100' : 'opacity-0'}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        style={{ display: showBackToTop ? 'block' : 'none' }}
      >
        ↑
      </button>
    </div>
  );
}