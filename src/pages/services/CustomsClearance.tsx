import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceSidebar from '@/components/ServiceSidebar';
import LabeledText from '@/components/common/LabeledText';
import { FileCheck, Shield, MessageCircle, Globe, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const FEATURE_ICONS: LucideIcon[] = [FileCheck, Shield, MessageCircle, Globe];

const CustomsClearance = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const page = siteContent?.customsClearance || defaultContent.customsClearance;
  const features = page.features?.length ? page.features : defaultContent.customsClearance.features;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={page.hero.image}
            alt="Customs Clearance Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {page.hero.title}
                </h1>
                <p className="text-white/90 text-lg md:text-xl">
                  {page.hero.subtitle}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTENT + SIDEBAR */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8">

              {/* SIDEBAR - LEFT */}
              <ServiceSidebar />

              {/* MAIN CONTENT - RIGHT */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                  {page.mainHeading}
                </h2>

                <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                  {page.body.intro.map((paragraph, idx) => (
                    <p key={idx}>
                      <LabeledText text={paragraph} />
                    </p>
                  ))}

                  {/* TWO SEPARATE BOXES FOR IMPORT & EXPORT */}
                  <div className="grid md:grid-cols-2 gap-6 mt-10">
                    {page.body.sections.map((section, sIdx) => (
                      <div key={sIdx} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                        <h3 className="text-xl font-bold text-primary mb-3">{section.heading}</h3>
                        {section.paragraphs.map((paragraph, pIdx) => (
                          <p key={pIdx} className="text-sm mb-6 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                        <ul className="space-y-3 list-none pl-0">
                          {section.list.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl p-5 shadow-md border border-border"
                  >
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-bold text-primary mb-2 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomsClearance;
