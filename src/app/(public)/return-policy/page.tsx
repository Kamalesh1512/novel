'use client'
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function ReturnRefundPolicy() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId: any) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Return & Refund Policy | Alma Boss</title>
        <meta name="description" content="Return & Refund Policy for Alma Boss - Your satisfaction is our priority" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="font-sans leading-relaxed text-gray-800 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-5 mb-10">
          {/* Header */}
          <div className="text-center mb-8 pb-5 border-b-2 border-blue-500">
            <h1 className="text-blue-500 text-4xl font-bold mb-3">Return & Refund Policy</h1>
            <p className="text-gray-600 text-xl font-medium mb-4">Your satisfaction is our priority</p>
            <div className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-6 py-3 rounded-full text-base font-semibold inline-block">
              📦 Hassle-Free Returns
            </div>
          </div>

          {/* Last Updated */}
          <div className="bg-gray-200 p-4 rounded-md mb-6 text-center font-medium">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN')}
          </div>

          {/* Intro Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-6 text-center">
            <p className="text-lg leading-relaxed m-0">
              At Alma, your satisfaction is our priority. We strive to ensure that all our products reach you in the best condition. However, if there is an issue, we're here to help.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 p-5 rounded-lg mb-6">
            <h3 className="text-blue-500 text-lg font-semibold mb-4">Quick Navigation</h3>
            <ul className="list-none space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('eligibility')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  📦 Eligibility for Return
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('timeline')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  🕒 Return Request Window
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('proof')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  📸 Mandatory Proof Required
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('process')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  🔁 Return Process
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('refund')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  💸 Refund Terms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('non-returnable')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  🚫 Non-Returnable Items
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('cancellations')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  🧾 Cancellations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-blue-500 bg-transparent border-none cursor-pointer transition-colors duration-300 text-base p-2 rounded w-full text-left hover:text-blue-700 hover:bg-gray-200"
                >
                  📍 Return Address & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Eligibility Section */}
          <div className="mb-8" id="eligibility">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              📦 Eligibility for Return
            </h2>
            <p className="mb-4 text-left leading-relaxed">
              You may request a return or replacement only under the following conditions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-500 transition-transform duration-300 hover:-translate-y-1">
                <h4 className="text-red-500 mb-2 text-lg font-semibold">🔴 Damaged Product</h4>
                <p className="m-0 leading-relaxed">Product is physically damaged during transit.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-500 transition-transform duration-300 hover:-translate-y-1">
                <h4 className="text-red-500 mb-2 text-lg font-semibold">❌ Wrong Product</h4>
                <p className="m-0 leading-relaxed">Product received is different from what was ordered.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-500 transition-transform duration-300 hover:-translate-y-1">
                <h4 className="text-red-500 mb-2 text-lg font-semibold">⏰ Expired Product</h4>
                <p className="m-0 leading-relaxed">Product is expired or near expiry at the time of delivery.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-red-500 transition-transform duration-300 hover:-translate-y-1">
                <h4 className="text-red-500 mb-2 text-lg font-semibold">📋 Missing Items</h4>
                <p className="m-0 leading-relaxed">Part of your order is missing.</p>
              </div>
            </div>
            <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-md">
              <strong>Important:</strong> Products once opened or used are not eligible for return due to hygiene and safety reasons.
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-8" id="timeline">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              🕒 Return Request Window
            </h2>
            <div className="bg-gray-50 p-5 rounded-lg mb-4">
              <div className="mb-4">
                <h4 className="text-blue-500 text-3xl font-bold mb-2">48 Hours</h4>
                <p className="m-0 leading-relaxed">
                  You must raise a return request within <strong>48 hours</strong> of receiving the product.
                </p>
              </div>
              <div className="bg-red-100 border border-red-300 p-4 rounded-md">
                <strong>⚠️ Important:</strong> Requests beyond 48 hours will not be accepted.
              </div>
            </div>
          </div>

          {/* Proof Section */}
          <div className="mb-8" id="proof">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              📸 Mandatory Proof Required
            </h2>
            <p className="mb-4 text-left leading-relaxed">
              To process your return claim, please share the following:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500 text-center">
                <h4 className="text-blue-700 mb-2 text-lg font-semibold">📷 Clear Images</h4>
                <p className="m-0 leading-relaxed">Clear images of the outer packaging and product</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500 text-center">
                <h4 className="text-blue-700 mb-2 text-lg font-semibold">🎥 Unboxing Video</h4>
                <p className="m-0 leading-relaxed">Unboxing video showing the issue (must begin before the seal is opened)</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500 text-center">
                <h4 className="text-blue-700 mb-2 text-lg font-semibold">🧾 Invoice Reference</h4>
                <p className="m-0 leading-relaxed">Invoice or order ID reference</p>
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="mb-8" id="process">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              🔁 Return Process
            </h2>
            <div className="space-y-5">
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-5 flex-shrink-0">1</div>
                <div>
                  <h4 className="text-blue-500 font-semibold mb-2">Contact Us</h4>
                  <p className="m-0 leading-relaxed">
                    Email <a href="mailto:returns@almaboss.in" className="text-blue-500 hover:underline">returns@almaboss.in</a> or WhatsApp/Call at <a href="tel:+919845398453" className="text-blue-500 hover:underline">+91 98453 98453</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-5 flex-shrink-0">2</div>
                <div>
                  <h4 className="text-blue-500 font-semibold mb-2">Submit Proof</h4>
                  <p className="m-0 leading-relaxed">Send images/video as required</p>
                </div>
              </div>
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-5 flex-shrink-0">3</div>
                <div>
                  <h4 className="text-blue-500 font-semibold mb-2">Approval</h4>
                  <p className="m-0 leading-relaxed">Our team will verify and approve/disapprove the request within 48 hours</p>
                </div>
              </div>
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-5 flex-shrink-0">4</div>
                <div>
                  <h4 className="text-blue-500 font-semibold mb-2">Pickup</h4>
                  <p className="m-0 leading-relaxed">If approved, we will schedule a reverse pickup</p>
                </div>
              </div>
              <div className="flex items-start bg-gray-50 p-5 rounded-lg">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-5 flex-shrink-0">5</div>
                <div>
                  <h4 className="text-blue-500 font-semibold mb-2">Replacement or Refund</h4>
                  <p className="mb-3 leading-relaxed">Once received and verified, we'll process either:</p>
                  <ul className="ml-5 space-y-1">
                    <li>A replacement shipment</li>
                    <li>A refund to the original payment method (within 7 working days)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Terms Section */}
          <div className="mb-8" id="refund">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              💸 Refund Terms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-100 border border-green-300 p-5 rounded-lg">
                <h4 className="text-green-800 font-semibold mb-3">✅ Refunds are processed only in case of:</h4>
                <ul className="ml-5 space-y-1">
                  <li>Stock unavailability</li>
                  <li>Damaged/wrong/expired product with valid proof</li>
                </ul>
              </div>
              <div className="bg-red-100 border border-red-300 p-5 rounded-lg">
                <h4 className="text-red-800 font-semibold mb-3">❌ Refunds are not issued for:</h4>
                <ul className="ml-5 space-y-1">
                  <li>Buyer's remorse (change of mind)</li>
                  <li>Delays caused by courier partners</li>
                  <li>Products returned without authorization or unboxing video</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items Section */}
          <div className="mb-8" id="non-returnable">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              🚫 Non-Returnable Items
            </h2>
            <p className="mb-4 text-left leading-relaxed">
              Due to safety and hygiene reasons, the following are non-returnable:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-100 p-5 rounded-lg border-l-4 border-red-500 text-center">
                <h4 className="text-red-800 font-semibold mb-2">🧴 Opened Products</h4>
                <p className="m-0 leading-relaxed">Opened or used skincare/cosmetic products</p>
              </div>
              <div className="bg-red-100 p-5 rounded-lg border-l-4 border-red-500 text-center">
                <h4 className="text-red-800 font-semibold mb-2">🏷️ Sale Items</h4>
                <p className="m-0 leading-relaxed">Items purchased under sale or promotional offers</p>
              </div>
              <div className="bg-red-100 p-5 rounded-lg border-l-4 border-red-500 text-center">
                <h4 className="text-red-800 font-semibold mb-2">🎁 Free Items</h4>
                <p className="m-0 leading-relaxed">Free samples or gifts</p>
              </div>
            </div>
          </div>

          {/* Cancellations Section */}
          <div className="mb-8" id="cancellations">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              🧾 Cancellations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-100 border border-green-300 p-5 rounded-lg">
                <h4 className="text-green-800 font-semibold mb-3">✅ Orders can be cancelled only before dispatch</h4>
                <p className="m-0 leading-relaxed">Contact us immediately if you need to cancel your order</p>
              </div>
              <div className="bg-red-100 border border-red-300 p-5 rounded-lg">
                <h4 className="text-red-800 font-semibold mb-3">❌ Once shipped, cancellations are not allowed</h4>
                <p className="m-0 leading-relaxed">After dispatch, you can only return as per our return policy</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-8" id="contact">
            <h2 className="text-blue-500 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-300">
              📍 Return Address & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-blue-500 font-semibold mb-3">Return Address</h3>
                <div className="bg-white p-4 rounded border-l-4 border-red-500">
                  <p className="m-0 mb-2 leading-relaxed"><strong>Alma</strong></p>
                  <p className="m-0 mb-2 leading-relaxed">65A, KIADB Hootagalli Industrial Area</p>
                  <p className="m-0 leading-relaxed">Mysuru – 570018, Karnataka, India</p>
                </div>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-blue-500 font-semibold mb-3">Contact Information</h3>
                <div className="bg-white p-4 rounded border-l-4 border-green-500">
                  <p className="m-0 mb-2 leading-relaxed">
                    <strong>📧 Email:</strong> <a href="mailto:returns@almaboss.in" className="text-green-600 hover:underline">returns@almaboss.in</a>
                  </p>
                  <p className="m-0 leading-relaxed">
                    <strong>📞 Phone:</strong> <a href="tel:+919845398453" className="text-green-600 hover:underline">+91 98453 98453</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button 
          className={`fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full border-none cursor-pointer transition-all duration-300 z-50 text-lg hover:bg-blue-600 ${
            showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>
    </>
  );
}