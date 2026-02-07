"use client";

import { useEffect, useRef, useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import gsap from "gsap";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <ProjectOverview />
      <Features />
      <HowItWorks />
      <Benefits />
      <CTABanner />
      <Footer />
    </div>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================
function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Marwadi University
              </span>
              <span className="text-blue-800 font-semibold text-xs sm:text-sm">
                E-Canteen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <nav className="flex flex-col gap-2 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2 px-4">
              <SignInButton mode="modal">
                <button className="w-full py-2.5 text-sm font-medium text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full py-2.5 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ============================================
// HERO COMPONENT
// ============================================
function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion && containerRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      
      tl.fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(".hero-buttons", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")
        .fromTo(".hero-illustration", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, "-=0.4");
    }
  }, []);

  return (
    <section id="home" ref={containerRef} className="py-16 sm:py-20 lg:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Smart Canteen Management for{" "}
              <span className="text-blue-800">Marwadi University</span>
            </h1>
            <p className="hero-subtitle text-lg text-slate-600 mb-8 max-w-lg">
              Skip the queues, order online, and pick up your food with a simple token system. 
              The modern way to manage campus dining.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <SignUpButton mode="modal">
                <button className="px-6 py-3 text-base font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 shadow-sm hover:shadow-md transition-all">
                  Get Started
                </button>
              </SignUpButton>
              <a
                href="#features"
                className="px-6 py-3 text-base font-medium text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                View Features
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hero-illustration relative">
            <div className="bg-linear-to-br from-blue-50 to-slate-100 rounded-2xl p-8 sm:p-12">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Phone */}
                <rect x="140" y="40" width="120" height="200" rx="12" fill="#1e40af" />
                <rect x="148" y="56" width="104" height="168" rx="4" fill="#f8fafc" />
                <circle cx="200" cy="228" r="8" fill="#334155" />
                
                {/* Screen Content */}
                <rect x="158" y="66" width="84" height="12" rx="2" fill="#e2e8f0" />
                <rect x="158" y="86" width="84" height="40" rx="4" fill="#dbeafe" />
                <rect x="158" y="134" width="60" height="8" rx="2" fill="#cbd5e1" />
                <rect x="158" y="150" width="84" height="8" rx="2" fill="#cbd5e1" />
                <rect x="158" y="166" width="70" height="8" rx="2" fill="#cbd5e1" />
                <rect x="158" y="186" width="84" height="28" rx="4" fill="#1e40af" />
                
                {/* Food Tray */}
                <ellipse cx="320" cy="180" rx="60" ry="20" fill="#94a3b8" />
                <ellipse cx="320" cy="175" rx="55" ry="18" fill="#cbd5e1" />
                <circle cx="300" cy="160" r="20" fill="#fef3c7" />
                <circle cx="340" cy="160" r="15" fill="#fee2e2" />
                <rect x="290" y="140" width="60" height="8" rx="2" fill="#a5b4fc" />
                
                {/* Checkmark Badge */}
                <circle cx="80" cy="100" r="35" fill="#dcfce7" />
                <circle cx="80" cy="100" r="25" fill="#22c55e" />
                <path d="M68 100l8 8 16-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Token */}
                <rect x="60" y="180" width="70" height="45" rx="6" fill="#fef3c7" />
                <text x="95" y="205" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">A102</text>
                <text x="95" y="218" textAnchor="middle" fill="#a16207" fontSize="8">TOKEN</text>
                
                {/* Decorative dots */}
                <circle cx="50" cy="60" r="4" fill="#dbeafe" />
                <circle cx="350" cy="80" r="6" fill="#dbeafe" />
                <circle cx="370" cy="240" r="5" fill="#e0e7ff" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROJECT OVERVIEW COMPONENT
// ============================================
function ProjectOverview() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              ".overview-card",
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power2.out" }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Online Ordering",
      description: "Browse the menu and place orders from your phone",
    },
    {
      icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
      title: "Token-Based Pickup",
      description: "Get a unique token and skip the waiting line",
    },
    {
      icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
      title: "Real-Time Tracking",
      description: "Track your order status from preparation to ready",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Revolutionizing Campus Dining
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our E-Canteen system brings digital convenience to Marwadi University's food services,
            making ordering and pickup seamless for students and staff.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="overview-card bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES COMPONENT
// ============================================
function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              ".feature-item",
              { x: -20, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const studentFeatures = [
    "Browse complete menu with prices",
    "Place orders anytime from anywhere",
    "Secure payment integration",
    "Real-time order status updates",
    "View order history and receipts",
  ];

  const managerFeatures = [
    "Manage menu items and prices",
    "Real-time order notifications",
    "Update item availability instantly",
    "Track daily sales and revenue",
    "View customer feedback",
  ];

  return (
    <section id="features" ref={sectionRef} className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Features for Everyone
          </h2>
          <p className="text-slate-600">
            Tailored experiences for both students and canteen managers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Student Features */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-blue-800 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                For Students
              </h3>
            </div>
            <ul className="p-6 space-y-4">
              {studentFeatures.map((feature, index) => (
                <li key={index} className="feature-item flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-800 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Manager Features */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-800 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                For Canteen Managers
              </h3>
            </div>
            <ul className="p-6 space-y-4">
              {managerFeatures.map((feature, index) => (
                <li key={index} className="feature-item flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-slate-700 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS COMPONENT
// ============================================
function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              ".step-item",
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, stagger: 0.15, ease: "power2.out" }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { icon: "🔐", title: "Log In", description: "Sign in with your university account" },
    { icon: "🍽️", title: "Browse Menu", description: "Explore today's available items" },
    { icon: "🛒", title: "Place Order", description: "Add items to cart and confirm" },
    { icon: "🎟️", title: "Get Token", description: "Receive your unique pickup token" },
    { icon: "✅", title: "Pick Up", description: "Collect your order when ready" },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600">
            Order your food in 5 simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-slate-200" style={{ marginLeft: "10%", marginRight: "10%" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="step-item relative text-center">
                {/* Step Number Circle */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 bg-blue-800 rounded-full flex items-center justify-center text-2xl shadow-md">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENEFITS COMPONENT
// ============================================
function Benefits() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              ".benefit-card",
              { scale: 0.95, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Save Time",
      description: "No more waiting in long queues during peak hours",
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Contactless",
      description: "Safe and hygienic ordering process",
    },
    {
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      title: "Order History",
      description: "Track all your past orders and expenses",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Instant Updates",
      description: "Real-time notifications when your order is ready",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Why Choose E-Canteen?
          </h2>
          <p className="text-slate-600">
            Benefits that make campus dining better
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex gap-4"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA BANNER COMPONENT
// ============================================
function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              ".cta-content",
              { scale: 0.95, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="cta-content text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Experience a Smarter Canteen at Marwadi University
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students already enjoying faster, easier food ordering on campus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="px-8 py-3 text-base font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 shadow-sm hover:shadow-md transition-all">
                Student Login
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="px-8 py-3 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Manager Login
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER COMPONENT
// ============================================
function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="font-bold text-slate-900">Marwadi University</span>
            </div>
            <p className="text-sm text-slate-600">
              E-Canteen is Marwadi University's official online canteen management system, 
              designed to enhance the campus dining experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-sm text-slate-600 hover:text-blue-800 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm text-slate-600 hover:text-blue-800 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-slate-600 hover:text-blue-800 transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Rajkot, Gujarat, India
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                canteen@marwadiuniversity.ac.in
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Marwadi University E-Canteen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
