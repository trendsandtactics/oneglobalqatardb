import { Users, UserCheck, FileText, Route, Globe, Cloud, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const FEATURE_ICONS: LucideIcon[] = [Users, UserCheck, FileText, Route, Globe, Cloud];

const GlobalNetwork = () => {
  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const network = siteContent?.home?.globalNetwork || defaultContent.home.globalNetwork;
  const features = network.features?.length ? network.features : defaultContent.home.globalNetwork.features;

  return (
    <section className="relative bg-[#0b2a4a] py-20 overflow-hidden">
      {/* subtle light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_65%)]" />

      <div className="relative container mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {network.heading}
          </h2>

          <div className="mx-auto h-0.5 w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <p className="mt-5 text-base md:text-lg text-blue-100 leading-relaxed">
            {network.paragraph}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl bg-white/95 px-6 py-7 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-base font-semibold text-[#0b2a4a] leading-tight">
                    {feature.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalNetwork;
