import React from 'react';
import { Laptop, Bell, FileBarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const PROPOSITION_ICONS = [Laptop, Bell, FileBarChart2];

const ValuePropositions = () => {
  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const valueProps = siteContent?.home?.valuePropositions || defaultContent.home.valuePropositions;
  const items = valueProps.items?.length ? valueProps.items : defaultContent.home.valuePropositions.items;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            {valueProps.heading}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((prop, index) => {
            const Icon = PROPOSITION_ICONS[index % PROPOSITION_ICONS.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-primary text-base sm:text-lg leading-snug">
                  {prop.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ValuePropositions;
