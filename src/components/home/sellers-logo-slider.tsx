// "use client";
// import Image from "next/image";
// import { SectionHeading } from "../ui/section-heading";

// const logos = [
//   { src: "/Images/amazon.webp", alt: "Amazon" },
//   { src: "/Images/meesho.webp", alt: "Meesho" },
//   { src: "/Images/flipkart.webp", alt: "Flipkart" },
//   { src: "/Images/firstcry-logo.png", alt: "FirstCry" },
//   { src: "/Images/fk_minutes_logo.png", alt: "FK Minutes" },
//   { src: "/Images/JioMart_logo.png", alt: "Jio Mart" },
//   { src: "/Images/apollo-hospitals.svg", alt: "Apollo" },
// ];

// export default function LogoSlider() {
//   return (
//     <div className="page-width-slider py-10 bg-white">
//       {/* Heading */}
//       <div className="mb-6">
//         <SectionHeading
//           title="Available On"
//           fontStyle="font-sans"
//           align="center"
//           size="lg"
//         />
//       </div>

//       {/* Slider Wrapper */}
//       <div className="logo-slider relative overflow-hidden">
//         {/* Two Slides for seamless infinite scroll */}
//         {[0, 1].map((i) => (
//           <div
//             key={i}
//             className="logos-slide flex animate-slide"
//           >
//             {logos.map((logo, index) => (
//               <div
//                 key={`${i}-${index}`}
//                 className="flex-shrink-0 flex items-center justify-center px-4 sm:px-6 md:px-8"
//               >
//                 <Image
//                   src={logo.src}
//                   alt={logo.alt}
//                   width={160}
//                   height={80}
//                   className="object-contain h-12 sm:h-16 md:h-20 lg:h-28 w-auto"
//                 />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import { SectionHeading } from "../ui/section-heading";

const logos = [
  { src: "/Images/amazon.webp", alt: "Amazon" },
  { src: "/Images/meesho.webp", alt: "Meesho" },
  { src: "/Images/flipkart.webp", alt: "Flipkart" },
  { src: "/Images/firstcry-logo.png", alt: "FirstCry" },
  { src: "/Images/fk_minutes_logo.png", alt: "FK Minutes" },
  { src: "/Images/JioMart_logo.png", alt: "Jio Mart" },
  { src: "/Images/apollo-hospitals.svg", alt: "Apollo" },
];

export default function LogoSlider() {
  return (
    <div className="page-width-slider py-10 bg-white">
      {/* Heading */}
      <div className="mb-6">
        <SectionHeading
          title="Available On"
          fontStyle="font-sans"
          align="center"
          size="lg"
        />
      </div>

      {/* Slider Wrapper */}
      <div className="logo-slider relative overflow-hidden">
        <div className="flex animate-slide sm:animate-slide-sm lg:animate-slide-lg w-fit">
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 flex items-center justify-center px-4 sm:px-6 md:px-8 min-w-[100px] sm:min-w-[120px] lg:min-w-[140px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={80}
                className="object-contain h-12 sm:h-16 md:h-20 lg:h-28 w-auto"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((logo, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 flex items-center justify-center px-4 sm:px-6 md:px-8 min-w-[100px] sm:min-w-[120px] lg:min-w-[140px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={80}
                className="object-contain h-12 sm:h-16 md:h-20 lg:h-28 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}