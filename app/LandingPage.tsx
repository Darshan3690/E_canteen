"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Utensils, Clock, CheckCircle, Star, Quote } from "lucide-react";

// --- Utility Functions ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- Mock Components for Unsupported External Libraries ---
// These replace @clerk/nextjs and Next.js specific components to ensure compilation
const SignedIn = ({ children }) => null; // Showing SignedOut state for landing page preview
const SignedOut = ({ children }) => <>{children}</>;
const SignInButton = ({ children }) => <div className="cursor-pointer">{children}</div>;
const SignUpButton = ({ children }) => <div className="cursor-pointer">{children}</div>;
const UserButton = () => (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center font-bold shadow-md">
    U
  </div>
);
const Link = ({ href, children, className, style }) => (
  <a href={href} className={className} style={style}>
    {children}
  </a>
);

// --- Custom Hook to Replace GSAP ScrollTrigger ---
function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-up-active");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, ...options });

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [elements, options]);

  const addElement = (el) => {
    if (el && !elements.includes(el)) {
      setElements((prev) => [...prev, el]);
    }
  };

  return addElement;
}

// --- Inline Mock for 3D Hero ---
function HeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-[spin_10s_linear_infinite]" />
      <div className="absolute w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-[spin_15s_linear_infinite_reverse] top-10 right-10" />
      
      <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 dark:border-white/5 p-12 rounded-full shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] z-10 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-700 group">
        <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping opacity-20" />
        <Utensils className="w-32 h-32 text-orange-500 drop-shadow-2xl group-hover:rotate-12 transition-transform duration-500" />
      </div>
    </div>
  );
}


// --- Main Application Component ---
export default function App() {
  const mainRef = useRef(null);
  const fadeUpRef = useIntersectionObserver();

  return (
    <div ref={mainRef} className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-x-hidden selection:bg-orange-500/20 selection:text-orange-600 font-sans">
      
      {/* Required Custom CSS for Animations without external libs */}
      <style dangerouslySetInnerHTML={{__html: `
        .fade-up-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-up-active {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-stagger {
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <Header />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto min-h-[95vh] flex flex-col justify-center overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Content */}
            <div className="z-10 relative order-2 md:order-1">
              <div className="hero-stagger inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-semibold mb-8 border border-orange-500/20 backdrop-blur-md shadow-sm" style={{ animationDelay: '0.1s' }}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                Live on your campus
              </div>
              
              <h1 className="hero-stagger text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-zinc-900 dark:text-white leading-[1.1] mb-8" style={{ animationDelay: '0.2s' }}>
                Order Smarter. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 inline-block pb-2">Eat Faster.</span>
              </h1>
              
              <p className="hero-stagger text-lg md:text-xl text-zinc-600 dark:text-zinc-400 md:max-w-lg mb-10 leading-relaxed font-medium" style={{ animationDelay: '0.3s' }}>
                Skip the lines. All your campus canteens in one app. Pre-order meals, track status, and pickup when ready.
              </p>
              
              <div className="hero-stagger flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.4s' }}>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold hover:opacity-90 transition-all shadow-[0_8px_30px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_40px_rgb(249,115,22,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 group text-lg border-none w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                   <Link href="#canteens" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold hover:opacity-90 transition-all shadow-[0_8px_30px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_40px_rgb(249,115,22,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 group text-lg w-full sm:w-auto">
                      Go to Canteens
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                   </Link>
                </SignedIn>
                <Link href="#how-it-works" className="h-14 px-8 rounded-2xl bg-zinc-100 dark:bg-zinc-800 backdrop-blur-md text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center hover:-translate-y-1 text-lg shadow-sm w-full sm:w-auto">
                  See how it works
                </Link>
              </div>

              <div className="hero-stagger mt-16 flex items-center gap-5 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-8 w-fit" style={{ animationDelay: '0.5s' }}>
                <div className="flex -space-x-3">
                  {["bg-blue-100 border-blue-200 text-blue-600", "bg-green-100 border-green-200 text-green-600", "bg-yellow-100 border-yellow-200 text-yellow-600"].map((color, i) => (
                    <div key={i} className={`w-11 h-11 rounded-full border-2 border-white dark:border-zinc-950 ${color} flex items-center justify-center shadow-sm relative z-[${4-i}] hover:-translate-y-1 transition-transform duration-300 font-bold text-xs`}>
                       {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-11 h-11 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 shadow-sm relative z-0">
                    2k+
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex text-orange-400 text-sm">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Trusted by 2,000+ students</p>
                </div>
              </div>
            </div>

            {/* 3D Visual Replacement */}
            <div className="hero-stagger relative h-[450px] md:h-[650px] w-full flex items-center justify-center order-1 md:order-2" style={{ animationDelay: '0.4s' }}>
              <HeroVisual />
            </div>
            
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-32 bg-zinc-50 dark:bg-zinc-900/50 relative overflow-hidden">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
             
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div ref={fadeUpRef} className="text-center max-w-2xl mx-auto mb-20 fade-up-section">
              <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-4 flex items-center justify-center gap-2">
                <div className="w-8 h-[2px] bg-orange-500/50 rounded-full" />
                Process
                <div className="w-8 h-[2px] bg-orange-500/50 rounded-full" />
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">Effortless ordering</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-xl font-medium">No more waiting in 15-minute queues during break time.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              <div ref={fadeUpRef} className="fade-up-section" style={{ transitionDelay: '0ms' }}>
                <FeatureCard 
                  number="01"
                  icon={<Utensils className="w-7 h-7 text-orange-500" />}
                  title="Choose your meal"
                  description="Browse menus from all campus canteens with real-time availability."
                />
              </div>
              <div ref={fadeUpRef} className="fade-up-section" style={{ transitionDelay: '150ms' }}>
                <FeatureCard 
                  number="02"
                  icon={<Clock className="w-7 h-7 text-orange-500" />}
                  title="Schedule pickup"
                  description="Order ahead and choose exactly when you want to pick up your food."
                />
              </div>
              <div ref={fadeUpRef} className="fade-up-section" style={{ transitionDelay: '300ms' }}>
                <FeatureCard 
                  number="03"
                  icon={<CheckCircle className="w-7 h-7 text-orange-500" />}
                  title="Skip the line"
                  description="Get notified when ready, walk in, and grab your order from the pickup counter."
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CANTEENS (Mock) */}
        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div ref={fadeUpRef} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 fade-up-section">
              <div>
                <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-4 flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-orange-500/50 rounded-full" />
                  Discover
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">Top Rated Spots</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-xl font-medium">Student favorites this week on campus.</p>
              </div>
              <Link href="#canteens" className="hidden md:flex items-center justify-center h-12 px-6 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all group shadow-sm border border-zinc-200 dark:border-zinc-700">
                View all canteens 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {['Main Cafeteria', 'Engineering Block', 'Library Cafe'].map((name, i) => (
                <div key={i} ref={fadeUpRef} className="fade-up-section group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-3 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden flex flex-col" style={{ transitionDelay: `${i * 150}ms` }}>
                  
                  <div className="h-60 bg-zinc-100 dark:bg-zinc-800 rounded-3xl mb-5 relative overflow-hidden">
                    {/* Placeholder Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Utensils className="w-20 h-20 drop-shadow-sm" />
                    </div>
                    
                    {/* Tags */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-green-600 dark:text-green-400 shadow-sm tracking-wide">
                          OPEN NOW
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 z-20">
                      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm">
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" /> 
                        4.8
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pb-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-2xl mb-3 tracking-tight group-hover:text-orange-500 transition-colors">{name}</h3>
                      <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                        <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md"><Utensils className="w-3.5 h-3.5" /> Indian • Chinese</span>
                        <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md"><Clock className="w-3.5 h-3.5" /> 10-15 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="md:hidden mt-10 text-center">
              <Link href="#canteens" className="inline-flex w-full h-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-lg">
                View all canteens
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */ }
        <section className="py-32 px-6 relative">
          <div ref={fadeUpRef} className="fade-up-section max-w-6xl mx-auto bg-zinc-950 text-white rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
             {/* Decorative huge quote */}
             <Quote className="absolute -top-10 -left-10 w-64 h-64 text-zinc-800/50 rotate-12 pointer-events-none" />
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex justify-center mb-10 gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-6 h-6 text-orange-400 fill-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
                ))}
              </div>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-14 leading-[1.2] tracking-tight max-w-4xl">
                &quot;This app saved my lunch break. I order during class and my food is ready when I walk in. <span className="text-orange-400">Absolute lifesaver.</span>&quot;
              </h2>
              
              <div className="flex flex-col items-center justify-center gap-5">
                <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-zinc-900 shadow-[0_0_0_2px_rgba(249,115,22,1)] overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center text-2xl font-black text-white">PP</div>
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-xl mb-1">Priya Patel</p>
                  <p className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Computer Science, Year 3</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 border-b",
      scrolled 
        ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-zinc-200 dark:border-zinc-800 py-4 shadow-sm" 
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="#" className="text-2xl font-extrabold tracking-tight flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          CampusEats
        </Link>
        
        <div className="flex items-center gap-8">
           <nav className="hidden md:flex items-center gap-8 mr-2">
              <Link href="#canteens" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Canteens</Link>
              <Link href="#how-it-works" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">How it works</Link>
           </nav>
          
          <div className="hidden md:block h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                  <button className="text-sm font-semibold hover:text-orange-500 transition-colors px-2">
                    Log in
                  </button>
              </SignInButton>
              <SignUpButton mode="modal">
                  <button className="h-11 px-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:opacity-90 transition-all text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 duration-300">
                    Sign up
                  </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
                <div className="ring-2 ring-zinc-200 dark:ring-zinc-800 rounded-full hover:ring-orange-500/50 transition-all p-0.5">
                  <UserButton />
                </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ icon, title, description, number }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden z-10 h-full">
      {/* Huge Background Number */}
      <div className="absolute -bottom-6 -right-2 text-[8rem] font-black text-zinc-900/[0.03] dark:text-white/[0.02] -z-10 select-none group-hover:scale-110 group-hover:text-zinc-900/[0.05] dark:group-hover:text-white/[0.05] transition-all duration-500">
        {number}
      </div>

      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 mb-8 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner border border-orange-500/20">
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold mb-4 tracking-tight">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed text-lg">{description}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pt-20 pb-10 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-16">
            
            <div className="col-span-2 md:col-span-4 pr-0 md:pr-10">
                <Link href="#" className="text-2xl font-extrabold tracking-tight flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white">
                    <Utensils className="w-4 h-4" />
                  </div>
                  CampusEats
                </Link>
                <p className="text-zinc-600 dark:text-zinc-400 text-base font-medium leading-relaxed mb-6">
                    Making campus dining better for everyone. Order ahead, skip the line, and enjoy your break.
                </p>
                <div className="flex gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700" />
                  ))}
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 md:col-start-7">
                <h4 className="font-extrabold mb-6 text-lg">Product</h4>
                <ul className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <li><Link href="#" className="hover:text-orange-500 transition-colors">Features</Link></li>
                    <li><Link href="#canteens" className="hover:text-orange-500 transition-colors">Canteens</Link></li>
                    <li><Link href="#" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
                </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
                <h4 className="font-extrabold mb-6 text-lg">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <li><Link href="#" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                    <li><Link href="#" className="hover:text-orange-500 transition-colors">Blog</Link></li>
                    <li><Link href="#" className="hover:text-orange-500 transition-colors">Careers</Link></li>
                </ul>
            </div>

             <div className="col-span-2 md:col-span-2">
                <h4 className="font-extrabold mb-6 text-lg">Legal</h4>
                <ul className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <li><Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                </ul>
            </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">© 2026 CampusEats Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Made with <span className="text-rose-500 animate-pulse">❤</span> for students
          </div>
        </div>
      </div>
    </footer>
  );
}