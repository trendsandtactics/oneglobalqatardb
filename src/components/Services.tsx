import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plane,
  Ship,
  Truck,
  Package,
  Boxes,
  Warehouse,
  FileCheck,
  DollarSign,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getSiteContent, defaultContent } from "@/pages/api";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "air-freight": <Plane size={16} />,
  "ocean-freight": <Ship size={16} />,
  "road-freight": <Truck size={16} />,
  "customs-clearance": <Package size={16} />,
  "warehousing": <Warehouse size={16} />,
  "project-logistics": <Boxes size={16} />,
};

const FEATURE_ICONS: LucideIcon[] = [Package, Boxes, FileCheck, DollarSign];

/* ======================================================
   KEY FEATURES
====================================================== */
const KeyFeatures = () => {
  const { data: siteContent } = useQuery({ queryKey: ["siteContent"], queryFn: getSiteContent });

  const keyFeatures = siteContent?.services?.keyFeatures || defaultContent.services.keyFeatures;
  const features = keyFeatures.features?.length ? keyFeatures.features : defaultContent.services.keyFeatures.features;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
            {keyFeatures.heading}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
            return (
              <div
                key={index}
                className="relative text-center group pb-16 transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="mx-auto w-24 h-24 bg-background rounded-full flex items-center justify-center border-2 border-muted-foreground/20 shadow-md
                                group-hover:border-primary/50 group-hover:shadow-lg transition-all duration-300">
                  <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>

                <div className="pt-6">
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-[220px] mx-auto">
                    {feature.description}
                  </p>
                </div>

                <div
                  className="
                    absolute bottom-0 left-1/2 -translate-x-1/2
                    text-7xl font-bold
                    text-muted-foreground/20
                    select-none
                    transition-all duration-300
                    group-hover:text-primary/30
                    group-hover:scale-110
                  "
                >
                  {`0${index + 1}`}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

/* ======================================================
   SERVICE CARD — UNCHANGED
====================================================== */
const OneGlobalCard = ({ image, title, points, icon, link }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden"
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </AspectRatio>

      <div className="p-5">
        <div className="flex items-center gap-2 font-semibold text-primary mb-2">
          {icon}
          <h3>{title}</h3>
        </div>

        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-5">
          {points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>

        <Button
          onClick={() => navigate(link)}
          className="relative overflow-hidden px-6 py-2 rounded-full border border-accent text-accent bg-transparent
                     transition-all duration-300 ease-out hover:text-white"
        >
          <span className="absolute inset-0 bg-accent translate-x-[-100%] transition-transform duration-300 ease-out hover:translate-x-0" />
          <span className="relative z-10 flex items-center gap-2 font-medium">
            Learn More
            <ArrowRight className="w-4 h-4 transition-transform duration-300 hover:translate-x-2" />
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

/* ======================================================
   SERVICES GRID
====================================================== */
const ServicesScroll = () => {
  const { data: siteContent } = useQuery({ queryKey: ["siteContent"], queryFn: getSiteContent });

  const services = siteContent?.serviceList?.items?.length
    ? siteContent.serviceList.items
    : defaultContent.serviceList.items;
  const intro = siteContent?.services?.servicesIntro || defaultContent.services.servicesIntro;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-widest text-accent">
            {intro.tag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">
            {intro.heading}
          </h2>
          <p className="text-sm mt-3 max-w-xl mx-auto text-muted-foreground">
            {intro.subheading}
          </p>
          <div className="w-20 h-1 bg-accent mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <OneGlobalCard
              key={index}
              image={service.image}
              title={service.title}
              points={service.points}
              link={service.link}
              icon={SERVICE_ICONS[service.slug] ?? <Package size={16} />}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

/* ======================================================
   FINAL EXPORT — ORDER UPDATED
====================================================== */
const Services = () => {
  const location = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  return (
    <>
      <ServicesScroll />
      <KeyFeatures />
    </>
  );
};

export default Services;
