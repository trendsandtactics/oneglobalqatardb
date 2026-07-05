import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

interface CountryData {
  country: string;
  company: string;
  website: string;
  priority: number;
  flag?: string;
}

const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const countries: CountryData[] = siteContent?.countrySelector?.items?.length
    ? siteContent.countrySelector.items
    : defaultContent.countrySelector.items;

  const sortedCountries = [...countries].sort((a, b) => {
    if (a.country === "AUSTRALIA") return -1;
    if (b.country === "AUSTRALIA") return 1;
    return a.priority - b.priority;
  });

  const handleCountrySelect = (country: CountryData) => {
    setTimeout(() => {
      window.open(country.website, '_blank', 'noopener,noreferrer');
    }, 100); // ensure dropdown closes before redirect
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
  <Button
    variant="outline"
    className="bg-[#003366] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[bg-white]"
  >
    <Globe className="w-5 h-5 text-white" />
    <span className="flex items-center gap-1">
      Switch Country <ChevronDown className="h-3 w-3 ml-1 text-white" />
    </span>
  </Button>
</DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          className="w-[280px] border border-amber-100 bg-white p-2 rounded-lg shadow-lg max-h-[90vh]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <ScrollArea className="h-[calc(100vh-120px)] w-full pr-2 overflow-y-auto scrollbar-gold">
            <div className="grid grid-cols-1 gap-1 p-1">
              {sortedCountries.map((country) => (
                <DropdownMenuItem
                  key={country.country}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleCountrySelect(country);
                  }}
                  className="cursor-pointer hover:bg-amber-50 p-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center w-full">
                    <div className="flex-shrink-0">
                      {country.flag ? (
                        <img
                          src={country.flag}
                          alt={`${country.country} flag`}
                          className="w-6 h-6 rounded-sm shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                          <Globe className="w-6 h-6 text-[#F6B100]" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-sm">{country.country}</div>
                      <div className="text-xs text-gray-500">{country.company}</div>
                    </div>
                  </motion.div>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CountrySelector;
