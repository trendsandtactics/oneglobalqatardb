import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Target, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const AboutPage = () => {
  const location = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const hero = siteContent?.about?.hero || defaultContent.about.hero;
  const about = siteContent?.about?.about || defaultContent.about.about;
  const features = about.features?.length ? about.features : defaultContent.about.about.features;
  const companyAbout = siteContent?.siteSettings?.companyAbout || defaultContent.siteSettings.companyAbout;
  const visionMission = siteContent?.home?.visionMission || defaultContent.home.visionMission;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={hero.image}
            alt="About One Global Logistics"
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
                  {hero.heading}
                </h1>
                <p className="text-white/90 text-lg md:text-xl">
                  {hero.subheading}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT CONTENT */}
        <section className="py-16 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* IMAGE */}
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={about.image}
                    alt="One Global Logistics Operations"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
              </motion.div>

              {/* TEXT */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {about.heading}
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {companyAbout}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* VISION & MISSION */}
        <section className="py-16 bg-[#FFFFFF]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">

              {/* Vision */}
              <div className="bg-[#0B1C3D] rounded-2xl p-8 shadow-lg border border-white/10">
                <Eye className="w-10 h-10 text-white mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Our Vision
                </h3>
                <p className="text-white/90">
                  {visionMission.vision}
                </p>
              </div>

              {/* Mission */}
              <div className="bg-[#0B1C3D] rounded-2xl p-8 shadow-lg border border-white/10">
                <Target className="w-10 h-10 text-white mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Our Mission
                </h3>
                <p className="text-white/90">
                  {visionMission.mission}
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
