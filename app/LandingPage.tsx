"use client";

import { useEffect, useRef, useState } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Utensils, Clock, CheckCircle, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for 3D Hero to avoid SSR issues
const Hero3D = dynamic(() => import("./components/landing/Hero3D"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  // Page load animation ref
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(".hero-text-element", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });

      // Scroll Animations for sections
      gsap.utils.toArray<HTMLElement>(".fade-up-section").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20">
      <Header />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="z-10 relative order-2 md:order-1">
              <div className="hero-text-element inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-8 border border-accent/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live on your campus
              </div>
              
              <h1 className="hero-text-element text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05] mb-8">
                Order Smarter. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Eat Faster.</span>
              </h1>
              
              <p className="hero-text-element text-xl text-muted-foreground md:max-w-md mb-10 leading-relaxed">
                Skip the lines. All your campus canteens in one app. Pre-order meals, track status, and pickup when ready.
              </p>
              
              <div className="hero-text-element flex flex-col sm:flex-row gap-4">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2 group text-lg">
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                   <Link href="/canteens" className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2 group text-lg">
                      Go to Canteens
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </SignedIn>
                <Link href="#how-it-works" className="h-14 px-8 rounded-2xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all flex items-center justify-center hover:-translate-y-1 text-lg">
                  See how it works
                </Link>
              </div>

              <div className="hero-text-element mt-16 flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-8 w-fit pr-12">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
                       <div className={`w-full h-full bg-slate-${i * 100 + 200}`} />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                    2k+
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Trusted by 2,000+ students</p>
                  <div className="flex text-yellow-500 text-xs mt-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Hero */}
            <div className="relative h-[450px] md:h-[600px] w-full flex items-center justify-center order-1 md:order-2 fade-in-section opacity-0 animation-delay-500 animate-[fade-up_1s_ease-out_0.5s_forwards]">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/30 to-transparent rounded-full filter blur-[100px] opacity-60 transform scale-75" />
              <Hero3D />
            </div>
            
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-32 bg-muted/30 fade-up-section relative overflow-hidden">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
             
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">Process</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Effortless ordering</h2>
              <p className="text-muted-foreground text-xl">No more waiting in 15-minute queues during break time.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <FeatureCard 
                icon={<Utensils className="w-8 h-8 text-primary" />}
                title="1. Choose your meal"
                description="Browse menus from all campus canteens with real-time availability."
                delay={0}
              />
              <FeatureCard 
                icon={<Clock className="w-8 h-8 text-primary" />}
                title="2. Schedule pickup"
                description="Order ahead and choose exactly when you want to pick up your food."
                delay={0.1}
              />
              <FeatureCard 
                icon={<CheckCircle className="w-8 h-8 text-primary" />}
                title="3. Skip the line"
                description="Get notified when ready, walk in, and grab your order from the pickup counter."
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* FEATURED CANTEENS (Mock) */}
        <section className="py-32 fade-up-section">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 block">Discover</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Top Rated Spots</h2>
                <p className="text-muted-foreground text-xl">Student favorites this week.</p>
              </div>
              <Link href="/canteens" className="hidden md:flex items-center text-primary font-medium hover:underline group text-lg">
                View all canteens <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group bg-card rounded-3xl p-4 border border-border shadow-soft hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                  <div className="h-56 bg-secondary/50 rounded-2xl mb-5 relative overflow-hidden">
                    {/* Placeholder for real food image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                        <Utensils className="w-16 h-16" />
                    </div>
                    
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground">
                        OPEN
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm text-foreground">
                      <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> 4.8
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-bold text-xl mb-2 text-foreground">Main Cafeteria</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Utensils className="w-3 h-3" /> Indian • Chinese</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10-15 min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="md:hidden mt-12 text-center">
              <Link href="/canteens" className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                View all canteens
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */ }
        <section className="py-32 bg-foreground text-background fade-up-section rounded-t-[3rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
             <Utensils className="w-96 h-96 text-background" />
           </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="flex justify-center mb-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-8 h-8 text-primary fill-primary mx-1" />
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight tracking-tight">
              &quot;This app saved my lunch break. I order during class and my food is ready when I walk in.&quot;
            </h2>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-primary" />
              <div className="text-center">
                <p className="font-bold text-xl">Priya Patel</p>
                <p className="text-slate-400">Computer Science, Year 3</p>
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
      "fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent",
      scrolled ? "bg-background/80 backdrop-blur-xl border-border py-4 shadow-sm" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Utensils className="w-6 h-6" />
          </div>
          CampusEats
        </Link>
        
        <div className="flex items-center gap-8">
           <nav className="hidden md:flex items-center gap-8 mr-4">
              <Link href="/canteens" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Canteens</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
           </nav>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                  <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Log in
                  </button>
              </SignInButton>
              <SignUpButton mode="modal">
                  <button className="h-10 px-5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-sm shadow-lg shadow-foreground/20 hover:shadow-foreground/40 hover:-translate-y-0.5 transform duration-200">
                  Sign up
                  </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <div className="bg-card p-10 rounded-[2rem] border border-border shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group" style={{ transitionDelay: `${delay}s` }}>
      <div className="w-16 h-16 rounded-2xl bg-accent mb-8 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
                <Link href="/" className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                    <Utensils className="w-4 h-4" />
                  </div>
                  CampusEats
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Making campus dining better for everyone. Order ahead, skip the line.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-foreground mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-primary">Features</Link></li>
                    <li><Link href="#" className="hover:text-primary">Canteens</Link></li>
                    <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-primary">About</Link></li>
                    <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                    <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                </ul>
            </div>
             <div>
                <h4 className="font-bold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
                    <li><Link href="#" className="hover:text-primary">Terms</Link></li>
                </ul>
            </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2026 Campus Canteen Marketplace. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social icons */}
          </div>
        </div>
      </div>
    </footer>
  );
}
