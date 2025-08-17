'use client'
import React, { useState, useEffect } from 'react';

const PrivacyPolicyPage = () => {
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

  const scrollToSection = (sectionId:any) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 leading-relaxed">
      <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-5 mb-10">
        {/* Header */}
        <div className="text-center mb-10 pb-5 border-b-2 border-blue-500">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 text-lg font-medium">Alma - Your Privacy is Our Priority</p>
          <div className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-3 rounded-full text-sm font-semibold mt-2">
            As per Indian IT Act, 2000 & DPDP Act, 2023
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-gray-100 p-4 rounded-md mb-8 text-center font-medium">
          <strong>Last Updated:</strong> July 13, 2025
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-50 p-5 rounded-md mb-8">
          <h3 className="text-blue-500 text-lg font-semibold mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            <li><button onClick={() => scrollToSection('collection')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">1. Collection of Personal Information</button></li>
            <li><button onClick={() => scrollToSection('purpose')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">2. Purpose of Collection</button></li>
            <li><button onClick={() => scrollToSection('consent')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">3. Consent</button></li>
            <li><button onClick={() => scrollToSection('cookies')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">4. Cookies</button></li>
            <li><button onClick={() => scrollToSection('data-sharing')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">5. Data Sharing & Disclosure</button></li>
            <li><button onClick={() => scrollToSection('data-security')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">6. Data Security</button></li>
            <li><button onClick={() => scrollToSection('user-rights')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">7. User Rights under DPDP Act</button></li>
            <li><button onClick={() => scrollToSection('children-privacy')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">8. Children's Privacy</button></li>
            <li><button onClick={() => scrollToSection('retention')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">9. Retention</button></li>
            <li><button onClick={() => scrollToSection('policy-changes')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">10. Changes to this Policy</button></li>
            <li><button onClick={() => scrollToSection('grievance')} className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">11. Grievance Officer</button></li>
          </ul>
        </div>

        {/* Legal Notice */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-8">
          <strong>Legal Compliance:</strong> This Privacy Policy is formulated in accordance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023.
        </div>

        {/* Section 1: Collection of Personal Information */}
        <div className="mb-9" id="collection">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">1. Collection of Personal Information</h2>
          <p className="mb-4 text-justify">We may collect the following types of personal information from you:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li><strong>Identity Information:</strong> Name, email address, mobile number</li>
            <li><strong>Address Information:</strong> Billing address, shipping address</li>
            <li><strong>Payment Information:</strong> Payment method details (processed securely via third-party gateway)</li>
            <li><strong>Technical Information:</strong> Browsing behavior, cookies, device information</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md my-5">
            <strong>Note:</strong> We do not store your payment card details on our servers. All payment processing is handled by secure third-party payment gateways.
          </div>
        </div>

        {/* Section 2: Purpose of Collection */}
        <div className="mb-9" id="purpose">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">2. Purpose of Collection</h2>
          <p className="mb-4 text-justify">We collect personal data for the following legitimate purposes:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li><strong>Order Processing:</strong> To process and fulfill your orders</li>
            <li><strong>Product Delivery:</strong> To deliver products to your specified address</li>
            <li><strong>Communication:</strong> To send order updates, promotions (opt-out available)</li>
            <li><strong>Service Improvement:</strong> To improve our website and services</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable legal obligations</li>
          </ul>
        </div>

        {/* Section 3: Consent */}
        <div className="mb-9" id="consent">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">3. Consent</h2>
          <p className="mb-4 text-justify">By using our Website (<strong>www.almaboss.in</strong>), you consent to the collection, use, and storage of your data as per this policy. Your consent is:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li><strong>Voluntary:</strong> You provide information willingly</li>
            <li><strong>Informed:</strong> You understand how your data will be used</li>
            <li><strong>Withdrawable:</strong> You may withdraw consent anytime by emailing <strong>ask@almaboss.in</strong></li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md my-5">
            <strong>Withdrawal of Consent:</strong> You can withdraw your consent at any time. However, this may affect our ability to provide certain services to you.
          </div>
        </div>

        {/* Section 4: Cookies */}
        <div className="mb-9" id="cookies">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">4. Cookies</h2>
          <p className="mb-4 text-justify">We use cookies and similar technologies to:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li>Enhance user experience and website functionality</li>
            <li>Store user preferences and settings</li>
            <li>Analyze website traffic and user behavior</li>
            <li>Provide personalized content and advertisements</li>
          </ul>
          <p className="mb-4 text-justify">You can modify cookie settings in your browser. However, disabling cookies may limit certain website functionalities.</p>
        </div>

        {/* Section 5: Data Sharing & Disclosure */}
        <div className="mb-9" id="data-sharing">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">5. Data Sharing & Disclosure</h2>
          <p className="mb-4 text-justify">We respect your privacy and <strong>do not sell your personal data</strong>. We may share your information with:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li><strong>Shipping/Logistics Providers:</strong> For product delivery purposes</li>
            <li><strong>Payment Gateways:</strong> For secure payment processing</li>
            <li><strong>Government Authorities:</strong> When required by law or legal process</li>
            <li><strong>Service Providers:</strong> Who assist in our business operations under strict confidentiality</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md my-5">
            <strong>Legal Disclosure:</strong> We may disclose your information if required by law, court order, or government authorities as per Indian legal requirements.
          </div>
        </div>

        {/* Section 6: Data Security */}
        <div className="mb-9" id="data-security">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">6. Data Security</h2>
          <p className="mb-4 text-justify">We adopt industry-standard security measures to protect your information, including:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li>SSL encryption for data transmission</li>
            <li>Secure servers and firewalls</li>
            <li>Access controls and authentication</li>
            <li>Regular security audits and updates</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md my-5">
            <strong>Security Disclaimer:</strong> While we implement robust security measures, no digital platform is 100% secure. We continuously work to enhance our security practices.
          </div>
        </div>

        {/* Section 7: User Rights under DPDP Act */}
        <div className="mb-9" id="user-rights">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">7. User Rights under DPDP Act</h2>
          <p className="mb-4 text-justify">As a data principal under the Digital Personal Data Protection Act, 2023, you have the following rights:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-2">Right to Access</h4>
              <p className="text-sm">Request information about your personal data we hold</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-2">Right to Correction</h4>
              <p className="text-sm">Correct or update inaccurate personal data</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-2">Right to Erasure</h4>
              <p className="text-sm">Request deletion of your personal data</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-2">Right to Withdraw Consent</h4>
              <p className="text-sm">Withdraw previously given consent</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-2">Right to Grievance Redressal</h4>
              <p className="text-sm">Lodge complaints with our Grievance Officer</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
              <h4 className="text-blue-500 font-semibold mb-2">Right to Appeal</h4>
              <p className="text-sm">Appeal to the Data Protection Board of India</p>
            </div>
          </div>

          <p className="text-justify">To exercise these rights, contact us at: <strong>ask@almaboss.in</strong></p>
        </div>

        {/* Section 8: Children's Privacy */}
        <div className="mb-9" id="children-privacy">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">8. Children's Privacy</h2>
          <p className="mb-4 text-justify">We do not knowingly collect personal data from children under 18 years of age. If we discover that a child has provided us with personal information, we will:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li>Delete such data immediately</li>
            <li>Notify the parent/guardian if possible</li>
            <li>Take steps to prevent future collection</li>
          </ul>
          <p className="mb-4 text-justify">Parents or guardians who believe their child has provided us with personal information should contact us immediately.</p>
        </div>

        {/* Section 9: Retention */}
        <div className="mb-9" id="retention">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">9. Retention</h2>
          <p className="mb-4 text-justify">Your personal data is retained only as long as required for:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li>Fulfilling business purposes outlined in this policy</li>
            <li>Complying with legal and regulatory obligations</li>
            <li>Resolving disputes and enforcing agreements</li>
          </ul>
          <p className="mb-4 text-justify">After the retention period expires, your data is securely erased or anonymized.</p>
        </div>

        {/* Section 10: Changes to this Policy */}
        <div className="mb-9" id="policy-changes">
          <h2 className="text-blue-500 text-xl font-semibold mb-4 pb-1 border-b border-gray-200">10. Changes to this Policy</h2>
          <p className="mb-4 text-justify">We may revise this Privacy Policy from time to time due to:</p>
          <ul className="ml-5 mb-4 space-y-2">
            <li>Changes in applicable laws and regulations</li>
            <li>Operational requirements</li>
            <li>Enhancement of our services</li>
          </ul>
          <p className="mb-4 text-justify">Any updates will be posted on this page with a revised "Last Updated" date. We encourage you to review this policy periodically.</p>
        </div>

        {/* Section 11: Grievance Officer */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-5 rounded-lg mt-8" id="grievance">
          <h3 className="text-white text-lg font-semibold mb-4">11. Grievance Officer</h3>
          <p className="mb-2">As per Rule 5(9) of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, you may contact our Grievance Officer for any concerns:</p>
          <p className="mb-2"><strong>Name:</strong> Grievance Officer, Alma</p>
          <p className="mb-2"><strong>📧 Email:</strong> ask@almaboss.in</p>
          <p className="mb-2"><strong>📞 Phone:</strong> +91 98453 98453</p>
          <p className="mb-2"><strong>📍 Address:</strong> 65A, KIADB Hootagalli Industrial Area, Mysuru – 570018, Karnataka, India</p>
          <p className="mb-2"><strong>Response Time:</strong> We will acknowledge your grievance within 24 hours and resolve it within 15 working days.</p>
        </div>

        {/* Contact Information */}
        <div className="bg-green-50 border border-green-200 p-5 rounded-md mt-8">
          <h3 className="text-green-800 font-semibold mb-2">Contact Information</h3>
          <p className="mb-2">For any questions about this Privacy Policy or our data practices, please contact us:</p>
          <p className="mb-2"><strong>Email:</strong> ask@almaboss.in</p>
          <p className="mb-2"><strong>Website:</strong> almaboss.in</p>
          <p className="mb-2"><strong>Phone:</strong> +91 98453 98453</p>
          <p>We are committed to protecting your privacy and resolving any concerns promptly.</p>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        className={`fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all duration-300 z-50 ${showBackToTop ? 'opacity-100' : 'opacity-0'}`}
        onClick={scrollToTop}
        style={{ display: showBackToTop ? 'block' : 'none' }}
      >
        ↑
      </button>
    </div>
  );
};

export default PrivacyPolicyPage;