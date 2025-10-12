// "use client";
// import { useRef, useEffect, useState } from "react";
// import { motion, useInView } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2, Send } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useForm, Controller } from "react-hook-form";
// import { EnquiryFormData, enquirySchema } from "@/lib/schema/b2bEnquirySchema";
// import Image from "next/image";

// export default function B2BEnquiryPage() {
//   const formRef = useRef<HTMLDivElement>(null);
//   const formInView = useInView(formRef, { once: true, amount: 0.2 });

//   // Particles animation state
//   const [particles, setParticles] = useState<
//     Array<{
//       id: number;
//       x: number;
//       y: number;
//       size: number;
//       speedX: number;
//       speedY: number;
//       opacity: number;
//     }>
//   >([]);

//   // Create particles
//   useEffect(() => {
//     const createParticles = () => {
//       const newParticles = [];
//       for (let i = 0; i < 50; i++) {
//         newParticles.push({
//           id: i,
//           x: Math.random() * window.innerWidth,
//           y: Math.random() * window.innerHeight,
//           size: Math.random() * 4 + 1,
//           speedX: (Math.random() - 0.5) * 0.5,
//           speedY: (Math.random() - 0.5) * 0.5,
//           opacity: Math.random() * 0.5 + 0.1,
//         });
//       }
//       setParticles(newParticles);
//     };

//     createParticles();
//     window.addEventListener("resize", createParticles);

//     const animateParticles = () => {
//       setParticles((prev) =>
//         prev.map((particle) => {
//           // Calculate new positions
//           let newX = particle.x + particle.speedX;
//           let newY = particle.y + particle.speedY;

//           // Handle screen wrapping
//           if (newX > window.innerWidth) newX = 0;
//           if (newX < 0) newX = window.innerWidth;
//           if (newY > window.innerHeight) newY = 0;
//           if (newY < 0) newY = window.innerHeight;

//           return {
//             ...particle,
//             x: newX,
//             y: newY,
//           };
//         })
//       );
//     };

//     const interval = setInterval(animateParticles, 50);

//     return () => {
//       window.removeEventListener("resize", createParticles);
//       clearInterval(interval);
//     };
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     control,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<EnquiryFormData>({
//     resolver: zodResolver(enquirySchema),
//     defaultValues: {
//       fullName: "",
//       company: "",
//       email: "",
//       countryCode: "+91",
//       phone: "",
//       businessType: undefined,
//       location: "",
//       message: "",
//     },
//   });

//   const onSubmit = async (data: EnquiryFormData) => {
//     const whatsappMessage = `
// 📌 New B2B Enquiry:

// 👤 Full Name: ${data.fullName}
// 🏢 Company: ${data.company}
// 📧 Email: ${data.email}
// 📞 Phone: ${data.countryCode} ${data.phone}
// 🏷️ Business Type: ${data.businessType}
// 📍 Location: ${data.location}
// 💬 Message: ${data.message}
//     `;

//     // Replace with your WhatsApp number
//     const phoneNumber = "919876543210";
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
//       whatsappMessage
//     )}`;

//     window.open(whatsappUrl, "_blank");

//     // Reset form after successful submission
//     setTimeout(() => {
//       reset();
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <motion.section
//         className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-r from-green-200 to-green-500 text-white overflow-hidden"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//       >
//         {/* Animated Background Particles */}
//         <div className="absolute inset-0 overflow-hidden">
//           {particles.map((particle) => (
//             <motion.div
//               key={particle.id}
//               className="absolute rounded-full bg-white"
//               style={{
//                 left: particle.x,
//                 top: particle.y,
//                 width: particle.size,
//                 height: particle.size,
//                 opacity: particle.opacity,
//               }}
//               animate={{
//                 x: [0, particle.speedX * 100],
//                 y: [0, particle.speedY * 100],
//               }}
//               transition={{
//                 duration: Math.random() * 20 + 10,
//                 repeat: Infinity,
//                 ease: "linear",
//               }}
//             />
//           ))}
//         </div>

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-transparent to-emerald-400/20" />

//         {/* Hero Content */}
//         {/* <div className="relative z-10 text-center max-w-4xl mx-auto">
//           <motion.h1
//             className="text-4xl md:text-6xl lg:text-7xl font-bold font-Pacifico mb-6 leading-tight"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             B2B Enquiry
//           </motion.h1>

//           <motion.p
//             className="text-lg md:text-xl lg:text-2xl mb-8 text-emerald-50 max-w-3xl mx-auto leading-relaxed"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//           >
//             Fill out this form to connect with our team for wholesale,
//             distribution, or partnership opportunities. Your enquiry helps us
//             understand your business needs and tailor solutions specifically for
//             your company.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//           >
//             <Button
//               variant="outline"
//               size="lg"
//               className="bg-white text-green-600 hover:bg-emerald-50 border-white hover:border-emerald-200 text-lg px-8 py-6 h-auto rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
//               onClick={() => {
//                 formRef.current?.scrollIntoView({ behavior: "smooth" });
//               }}
//             >
//               Check Availability
//             </Button>
//           </motion.div>
//         </div> */}
//         <motion.section
//           className="relative h-screen flex items-center justify-center overflow-hidden"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1.2, ease: "easeOut" }}
//         >
//           {/* Background Banner */}
//           <div className="absolute inset-0 w-full h-full -z-10">
//             <Image
//               src={banners[0].imageUrl}
//               alt={banners[0].altText}
//               fill
//               priority
//               className="object-cover object-center"
//             />
//             <div className="absolute inset-0 bg-black/50" />{" "}
//             {/* Overlay for contrast */}
//           </div>

//           {/* Foreground Content */}
//           <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
//             <motion.h1
//               className="text-4xl md:text-6xl lg:text-7xl font-bold font-Pacifico mb-6 leading-tight text-white"
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               style={{ textShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
//             >
//               B2B Enquiry
//             </motion.h1>

//             <motion.p
//               className="text-lg md:text-xl lg:text-2xl mb-8 text-emerald-50 max-w-3xl mx-auto leading-relaxed"
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//             >
//               Fill out this form to connect with our team for wholesale,
//               distribution, or partnership opportunities. Your enquiry helps us
//               understand your business needs and tailor solutions specifically
//               for your company.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//             >
//               <Button
//                 variant="premiumOutline"
//                 size="lg"
//                 className="rounded-3xl w-full sm:w-auto text-lg px-8 py-6 h-auto font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
//                 onClick={() => {
//                   formRef.current?.scrollIntoView({ behavior: "smooth" });
//                 }}
//               >
//                 Check Availability
//               </Button>
//             </motion.div>
//           </div>
//         </motion.section>
//       </motion.section>

//       {/* Form Section */}
//       <motion.section
//         ref={formRef}
//         className="max-w-3xl mx-auto py-16 px-4"
//         initial={{ opacity: 0, y: 50 }}
//         animate={formInView ? { opacity: 1, y: 0 } : {}}
//         transition={{ duration: 1 }}
//       >
//         <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
//           Send us a Message
//         </h2>
//         <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div>
//             <Label htmlFor="fullName">Full Name</Label>
//             <Input
//               id="fullName"
//               {...register("fullName")}
//               className="mt-2 w-full"
//               placeholder="Enter your full name"
//             />
//             {errors.fullName && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.fullName.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="company">Company Name</Label>
//             <Input
//               id="company"
//               {...register("company")}
//               className="mt-2 w-full"
//               placeholder="Enter your company name"
//             />
//             {errors.company && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.company.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="email">Email Address</Label>
//             <Input
//               id="email"
//               type="email"
//               {...register("email")}
//               className="mt-2 w-full"
//               placeholder="Enter your email address"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="phone">Phone Number</Label>
//             <div className="flex mt-2 space-x-2">
//               {/* Country Code Dropdown */}
//               <Controller
//                 name="countryCode"
//                 control={control}
//                 render={({ field }) => (
//                   <Select value={field.value} onValueChange={field.onChange}>
//                     <SelectTrigger className="w-24">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="+91">🇮🇳 +91</SelectItem>
//                       <SelectItem value="+1">🇺🇸 +1</SelectItem>
//                       <SelectItem value="+44">🇬🇧 +44</SelectItem>
//                       <SelectItem value="+971">🇦🇪 +971</SelectItem>
//                       <SelectItem value="+65">🇸🇬 +65</SelectItem>
//                       <SelectItem value="+61">🇦🇺 +61</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//               />

//               {/* Phone Number Input */}
//               <div className="flex-1">
//                 <Input
//                   id="phone"
//                   {...register("phone")}
//                   className="w-full"
//                   placeholder="9876543210"
//                   maxLength={10}
//                   onInput={(e) => {
//                     // Only allow numbers
//                     const target = e.target as HTMLInputElement;
//                     target.value = target.value.replace(/[^0-9]/g, "");
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Error Messages and Suggestions */}
//             {errors.phone && (
//               <div className="mt-1">
//                 <p className="text-red-500 text-sm">{errors.phone.message}</p>
//                 <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
//                   <p className="text-blue-700 text-sm font-medium">
//                     💡 Common mistakes:
//                   </p>
//                   <ul className="text-blue-600 text-sm mt-1 space-y-1">
//                     <li>
//                       • Remove country code from number (use dropdown instead)
//                     </li>
//                     <li>• Don't include spaces or special characters</li>
//                     <li>• Indian numbers start with 6, 7, 8, or 9</li>
//                     <li>• Example: 9876543210 (exactly 10 digits)</li>
//                   </ul>
//                 </div>
//               </div>
//             )}

//             {errors.countryCode && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.countryCode.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="businessType">Business Type</Label>
//             <Controller
//               name="businessType"
//               control={control}
//               render={({ field }) => (
//                 <Select value={field.value} onValueChange={field.onChange}>
//                   <SelectTrigger className="w-full mt-2">
//                     <SelectValue placeholder="Select Business Type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Retailer">Retailer</SelectItem>
//                     <SelectItem value="Distributor">Distributor</SelectItem>
//                     <SelectItem value="Wholesaler">Wholesaler</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//             {errors.businessType && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.businessType.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="location">Location (City, State, Country)</Label>
//             <Input
//               id="location"
//               {...register("location")}
//               className="mt-2 w-full"
//               placeholder="Enter your location"
//             />
//             {errors.location && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.location.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="message">Message</Label>
//             <Textarea
//               id="message"
//               {...register("message")}
//               rows={4}
//               className="mt-2 w-full"
//               placeholder="Tell us about your business requirements..."
//             />
//             {errors.message && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.message.message}
//               </p>
//             )}
//           </div>

//           <Button
//             type="submit"
//             size="lg"
//             variant={"premium"}
//             className="w-full rounded-2xl"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                 Sending...
//               </>
//             ) : (
//               <>
//                 <Send className="w-5 h-5 mr-2" />
//                 Send Message
//               </>
//             )}
//           </Button>
//         </form>
//       </motion.section>
//     </div>
//   );
// }

"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Loader2, Send } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EnquiryFormData, enquirySchema } from "@/lib/schema/b2bEnquirySchema";

// Banner type
interface BannerProps {
  id: number;
  title: string;
  imageUrl: string;
  altText: string;
  priority: number;
}

export default function B2BEnquiryPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true, amount: 0.2 });

  // 🔹 Banner state
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);

  // 🔹 Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners/active");
        const data = await res.json();

        // Filter banners for this page
        const filteredBanners = (data.banners || []).filter(
          (banner: BannerProps) =>
            banner.priority === 5 && banner.title === "b2b page"
        );

        setBanners(filteredBanners);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        setBanners([]);
      } finally {
        setIsLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  // 🧩 Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      countryCode: "+91",
      phone: "",
      businessType: undefined,
      location: "",
      message: "",
    },
  });

  // 🟢 Handle submit
  const onSubmit = async (data: EnquiryFormData) => {
    const whatsappMessage = `
📌 New B2B Enquiry:

👤 Full Name: ${data.fullName}
🏢 Company: ${data.company}
📧 Email: ${data.email}
📞 Phone: ${data.countryCode} ${data.phone}
🏷️ Business Type: ${data.businessType}
📍 Location: ${data.location}
💬 Message: ${data.message}
    `;

    const phoneNumber = "919876543210";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank");

    setTimeout(() => reset(), 1000);
  };

  return (
    <div className="bg-transparent">
      {/* 🔹 Hero Section */}
      <motion.section className="relative h-screen flex items-center justify-center -mt-[64px] md:-mt-[80px] lg:-mt-[70px] xl:-mt-[74px] 2xl:-mt-[110px]">
        {/* Background Layer */}
        <div className="relative w-full h-full overflow-hidden">
          {isLoadingBanners ? (
            <div className="relative w-full h-full overflow-hidden">
              Loading...
            </div>
          ) : banners.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={banners[0].imageUrl}
                alt={banners[0].altText || "B2B Enquiry Banner"}
                fill
                priority
                className="object-contain"
              />
            </div>
          ) : (
            // 🔹 Fallback background (if banner not present)
            <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-500 flex flex-col items-center justify-center text-white">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans mb-6 leading-tight drop-shadow-lg">
                B2B Enquiry
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-center mb-8 max-w-3xl mx-auto leading-relaxed text-emerald-50 px-4">
                Fill out this form to connect with our team for wholesale,
                distribution, or partnership opportunities. Your enquiry helps
                us understand your business needs and tailor solutions
                specifically for your company.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-3xl w-full sm:w-auto text-lg px-8 py-6 h-auto font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => {
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Check Availability
              </Button>
            </div>
          )}
        </div>
      </motion.section>

      {/* 🔹 Form Section */}
      <motion.section
        ref={formRef}
        className="max-w-3xl mx-auto py-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={formInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
          Send us a Message
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register("fullName")}
              className="mt-2 w-full"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              {...register("company")}
              className="mt-2 w-full"
              placeholder="Enter your company name"
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="mt-2 w-full"
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone + Country Code */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex mt-2 space-x-2">
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                      <SelectItem value="+65">🇸🇬 +65</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <Input
                id="phone"
                {...register("phone")}
                className="flex-1"
                placeholder="9876543210"
                maxLength={10}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, "");
                }}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Controller
              name="businessType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select Business Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retailer">Retailer</SelectItem>
                    <SelectItem value="Distributor">Distributor</SelectItem>
                    <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.businessType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.businessType.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              className="mt-2 w-full"
              placeholder="City, State, Country"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message")}
              rows={4}
              className="mt-2 w-full"
              placeholder="Tell us about your business requirements..."
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            variant="premium"
            className="w-full rounded-2xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </motion.section>
    </div>
  );
}
