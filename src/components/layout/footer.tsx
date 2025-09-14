"use client";
import React, { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, X } from "lucide-react";
import Matter from "matter-js";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const footerLinks = {
    company: [
      { name: "Get in Touch", href: "/contact" },
      { name: "About us", href: "/about" },
      { name: "Contact us", href: "/contact" },
      { name: "Blogs", href: "/blogs" },
    ],
    policies: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Pricing", href: "/pricing" },
      { name: "Return Policy", href: "/return-policy" },
      { name: "Terms and Conditions", href: "/terms-conditions" },
      { name: "Shipping Policy", href: "/shipping-policy" },
    ],
  };

  const productImages = [
    { src: "/Images/products/72_s_lid-removebg-preview.png", alt: "Product 1" },
    { src: "/Images/products/Goat_Milk_Wipes.png", alt: "Product 2" },
    { src: "/Images/products/Refreshing-Wipes_cologne.png", alt: "Product 3" },
    { src: "/Images/products/72_s_lid-removebg-preview.png", alt: "Product 4" },
    { src: "/Images/products/Goat_Milk_Wipes.png", alt: "Product 5" },
    { src: "/Images/products/Refreshing-Wipes_cologne.png", alt: "Product 6" },
    { src: "/Images/products/Goat_Milk_Wipes.png", alt: "Product 7" },
    { src: "/Images/products/Refreshing-Wipes_cologne.png", alt: "Product 8" },
  ];

  // Intersection observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current || !footerRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engine.gravity.x = 0;
    engine.gravity.y = 1.5; // Reduced gravity for better interaction

    const width = window.innerWidth;
    const height = footerRef.current.offsetHeight;

    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: "transparent",
        wireframes: false,
        showMousePosition: false, // Hide mouse position indicator
      },
    });

    // Create boundaries
    const ground = Bodies.rectangle(width / 2, height - 10, width, 20, {
      isStatic: true,
      render: { visible: false }
    });
    const leftWall = Bodies.rectangle(-10, height / 2, 20, height, {
      isStatic: true,
      render: { visible: false }
    });
    const rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, {
      isStatic: true,
      render: { visible: false }
    });
    World.add(engine.world, [ground, leftWall, rightWall]);

    const isMobile = width < 768;
    const radius = isMobile ? 30 : 45;
    const scale = isMobile ? 0.4 : 0.6;

    let balls: Matter.Body[] = [];
    const bottomRowCount = 6;
    const bottomSpacing = width / (bottomRowCount + 1);

    // Create bottom row balls
    productImages.slice(0, 6).forEach((p, i) => {
      const ball = Bodies.circle(
        bottomSpacing * (i + 1),
        Math.random() * 150 + 100,
        radius,
        {
          restitution: 0.7, // Bouncing factor
          frictionAir: 0.01, // Air resistance (lower = less resistance)
          friction: 0.3, // Surface friction
          density: 0.001, // Lighter objects for better interaction
          inertia: Infinity, // Prevent rotation
          angle: 0,
          render: {
            sprite: { 
              texture: p.src, 
              xScale: scale, 
              yScale: scale 
            },
          },
        }
      );
      balls.push(ball);
    });

    // Create top row balls if there are more than 6 products
    const topRowCount = productImages.length - bottomRowCount;
    if (topRowCount > 0) {
      const topSpacing = width / (topRowCount + 1);
      productImages.slice(6).forEach((p, i) => {
        const ball = Bodies.circle(
          topSpacing * (i + 1),
          -Math.random() * 300 - 100, // Start higher up
          radius,
          {
            restitution: 0.7,
            frictionAir: 0.01,
            friction: 0.3,
            density: 0.001,
            inertia: Infinity,
            angle: 0,
            render: {
              sprite: { 
                texture: p.src, 
                xScale: scale, 
                yScale: scale 
              },
            },
          }
        );
        balls.push(ball);
      });
    }

    World.add(engine.world, balls);

    // Create mouse control with better settings
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.8, // Higher stiffness for more responsive interaction
        render: {
          visible: false, // Hide constraint line
        },
        damping: 0.1, // Add damping for smoother interaction
        length: 0, // Use default length
      },
    });

    // Improve mouse sensitivity
    mouse.pixelRatio = window.devicePixelRatio || 1;

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Start the simulation
    Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Cleanup function
    return () => {
      Render.stop(render);
      Matter.Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas && render.canvas.parentNode) {
        render.canvas.remove();
      }
      render.textures = {};
    };
  }, [isVisible]);

  return (
    <div className="bg-gray-100">
      <footer
        ref={footerRef}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden min-h-screen"
        style={{ paddingBottom: "100px" }}
      >
        {/* Physics Canvas - now with pointer events enabled */}
        <div
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10"
          style={{ pointerEvents: 'auto' }} // Enable pointer events for interaction
        />

        {/* Reduced opacity overlay to maintain text readability but allow interaction */}
        <div className="absolute inset-0 bg-black/10 z-15 pointer-events-none"></div>

        {/* Footer content - higher z-index to stay above canvas */}
        <div
          className={`container mx-auto px-6 py-12 relative z-20 transition-all duration-700 pointer-events-none ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pt-16">
            {/* Brand Section */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 pointer-events-auto">
              <a href="/home" className="flex items-center space-x-2 mb-4">
                <img
                  src="/Images/logo_novel.png"
                  alt="Novel Tissues Logo"
                  className="h-16 w-auto"
                  onError={(e: any) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='50' viewBox='0 0 120 50'%3E%3Crect width='120' height='50' fill='%23ffffff' rx='5'/%3E%3Ctext x='60' y='30' font-size='16' font-weight='bold' text-anchor='middle' fill='%23000000'%3ENovel%3C/text%3E%3C/svg%3E";
                  }}
                />
              </a>
              <p className="text-gray-300 text-sm leading-relaxed">
                Premium quality tissues and wipes for your everyday needs.
                Trusted by families worldwide.
              </p>
            </div>

            {/* Company Links */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 pointer-events-auto">
              <h3 className="font-semibold text-white mb-4 text-lg border-b border-green-600 pb-2 inline-block">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-green-400 transition-all duration-200 hover:underline hover:translate-x-1 block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies Links */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 pointer-events-auto">
              <h3 className="font-semibold text-white mb-4 text-lg border-b border-green-600 pb-2 inline-block">
                Our Policies
              </h3>
              <ul className="space-y-3">
                {footerLinks.policies.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-green-400 transition-all duration-200 hover:underline hover:translate-x-1 block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 pointer-events-auto">
              <h3 className="font-semibold text-white mb-4 text-lg border-b border-green-600 pb-2 inline-block">
                Stay Connected
              </h3>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                Get exclusive offers and updates on our latest products
                delivered to your inbox.
              </p>
              <div className="space-y-3 mb-6">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200"
                />
                <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
                  SUBSCRIBE NOW
                </button>
              </div>

              {/* Social Media */}
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-12 h-12 bg-gray-800/70 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-gray-700 hover:border-blue-500"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-12 h-12 bg-gray-800/70 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-gray-700 hover:border-purple-500"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-12 h-12 bg-gray-800/70 hover:bg-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-gray-700 hover:border-blue-500"
                >
                  <X size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t pt-8 mt-12 bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-xl pointer-events-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-400 text-center md:text-left relative z-40">
                COPYRIGHT © 2025 Novel Tissues. ALL RIGHTS RESERVED.
              </p>
              <p className="text-sm text-gray-400 flex items-center justify-center md:justify-end gap-1 relative z-40">
                Made with <span className="text-red-400 animate-pulse">❤️</span>{" "}
                for better hygiene
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;