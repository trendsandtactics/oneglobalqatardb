import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const About = () => {
  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const about = siteContent?.home?.about || defaultContent.home.about;
  const companyAbout = siteContent?.siteSettings?.companyAbout || defaultContent.siteSettings.companyAbout;

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE – LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src={about.image}
                alt="One Global Logistics Office Environment"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* CONTENT – RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            {/* BIG TITLE */}
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              {about.heading}
            </h2>

            {/* COMPACT BODY TEXT */}
            <p className="font-body text-sm md:text-base text-black leading-relaxed max-w-xl">
              {companyAbout}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
