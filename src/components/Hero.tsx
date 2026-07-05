import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Users, Locate, Ship, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

// Icons stay code-side; buttons are matched to icons by position.
const NAV_BUTTON_ICONS: LucideIcon[] = [User, Users, Locate, Ship];

// --- Navigation Buttons ---
const HeroNavButtons = ({ items }: { items: { label: string; url: string }[] }) => {
  return <div className="absolute bottom-12 left-0 right-0 z-20 hidden lg:block">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="flex items-center bg-[#0a192f]/60 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {items.map((button, index) => {
              const Icon = NAV_BUTTON_ICONS[index % NAV_BUTTON_ICONS.length];
              return <a key={index} href={button.url} target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-4 px-10 py-5 transition-all duration-300 hover:bg-white/5 ${index !== items.length - 1 ? 'border-r border-white/10' : ''}`}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-accent transition-all">
                  <Icon className="w-5 h-5 text-white group-hover:text-accent-foreground" />
                </div>
                <span className="text-white font-semibold text-sm whitespace-nowrap">
                  {button.label}
                </span>
              </a>;
            })}
          </div>
        </div>
      </div>
    </div>;
};

// --- Main Hero Component ---
const Hero = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const hero = siteContent?.home?.hero || defaultContent.home.hero;
  const messages = hero.messages?.length ? hero.messages : defaultContent.home.hero.messages;
  const navButtons = siteContent?.home?.heroNavButtons?.items?.length
    ? siteContent.home.heroNavButtons.items
    : defaultContent.home.heroNavButtons.items;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return <section id="home" className="relative h-[650px] md:h-[850px] overflow-hidden flex flex-col">

      {/* Background Video */}
      <video className="absolute inset-0 w-full h-full object-cover" src={hero.videoSrc} autoPlay loop muted playsInline />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex-grow flex items-center">
        <div className="max-w-3xl pt-4">

          {/* Navy Tag */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="inline-block bg-[#0A1E3F] shadow-md mb-4 rounded-3xl px-[20px] py-[5px]">
            <p className="text-white font-bold tracking-[0.2em] uppercase text-xs">
              {hero.tagText}
            </p>
          </motion.div>

          {/* Rotating Headline */}
          <div className="min-h-[120px] md:min-h-[160px] flex items-center mb-8">
            <AnimatePresence mode="wait">
              <motion.h1 key={index} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.6
            }} className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.3]">
                {messages[index % messages.length]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* CTA */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="flex flex-wrap gap-5">
            <Button size="lg" className="bg-accent text-accent-foreground font-bold px-10 h-14 rounded-full hover:scale-105 transition-transform" onClick={() => navigate(hero.ctaLink)}>
              {hero.ctaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

        </div>
      </div>

      <HeroNavButtons items={navButtons} />
    </section>;
};
export default Hero;
