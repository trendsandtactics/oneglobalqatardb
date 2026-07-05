import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, ExternalLink, Phone, Mail, Home, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedCityIndexes, setSelectedCityIndexes] = useState<{ [countryName: string]: number }>({});
  const isMobile = useIsMobile();

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const countries = siteContent?.globalPresence?.locations?.length
    ? siteContent.globalPresence.locations
    : defaultContent.globalPresence.locations;

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  );

  useEffect(() => {
    iframeRef.current = document.querySelector('iframe');
  }, []);

  useEffect(() => {
    if (sortedCountries.length > 0 && sortedCountries[0].cities.length > 0) {
      const firstCountry = sortedCountries[0];
      const firstCity = firstCountry.cities[0];
      setSelectedLocation(firstCity);
      setExpandedCountry(firstCountry.name);

      const initialIndexes: { [countryName: string]: number } = {};
      sortedCountries.forEach(country => {
        initialIndexes[country.name] = 0;
      });
      setSelectedCityIndexes(initialIndexes);

      navigateToLocation(firstCity.lat, firstCity.lng, firstCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedCountries.length]);

  const navigateToLocation = (lat: number, lng: number, city: any = null) => {
    const iframe = document.querySelector('iframe[title="Interactive Map"]') as HTMLIFrameElement;
    if (iframe) {
      try {
        const zoomLevel = 10;
        const baseUrl = "https://maps.google.com/maps";
        const newSrc = `${baseUrl}?q=${lat},${lng}&z=${zoomLevel}&hl=en&output=embed`;
        iframe.src = newSrc;
        if (city) {
          setSelectedLocation(city);
        }
      } catch (e) {
        console.error("Navigation failed:", e);
      }
    }
  };

  const handleCitySelection = (country: any, cityIndex: number) => {
    setSelectedCityIndexes(prev => ({
      ...prev,
      [country.name]: cityIndex
    }));

    const selectedCity = country.cities[cityIndex];
    navigateToLocation(selectedCity.lat, selectedCity.lng, selectedCity);
  };

  const isSelectedCity = (countryName: string, cityIndex: number) => {
    return selectedCityIndexes[countryName] === cityIndex;
  };

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={`my-3 w-full ${isMobile ? 'max-w-[95%]' : 'max-w-[520px]'} mx-auto px-2 md:px-0`}>
        {/* Header - Navy to Royal Blue Gradient */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white rounded-t-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <h2 className="font-bold text-lg">Global Locations</h2>
          </div>
        </div>

        <ScrollArea className={`h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-white rounded-b-xl shadow-md`}>
          <div className="p-4">
            <div className="mt-4 space-y-3">
              <Accordion type="single" collapsible value={expandedCountry || ""} className="w-full space-y-3">
                {sortedCountries.map(country => {
                  return (
                    <AccordionItem
                      key={country.name}
                      value={country.name}
                      className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
                    >
                      <AccordionTrigger
                        onClick={() => {
                          setExpandedCountry(expandedCountry === country.name ? null : country.name);
                          navigateToLocation(country.lat, country.lng);
                        }}
                        className="rounded-t-md hover:bg-blue-50/50 transition-colors px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://flagcdn.com/${country.code}.svg`}
                            alt={`${country.name} flag`}
                            className="w-6 h-4 rounded-sm object-cover shadow-sm border border-gray-100"
                          />
                          <span className="font-medium text-slate-700">{country.name}</span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="bg-slate-50/30 px-3 py-2">
                        <div className="space-y-2">
                          <div className="space-y-2">
                            {country.cities.map((city: any, index: number) => (
                              <div key={index} className="w-full">
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start text-sm p-2 h-auto rounded-md border transition-all shadow-sm",
                                    isSelectedCity(country.name, index)
                                      ? "bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-300"
                                      : "bg-white hover:bg-blue-50/50 border-slate-100 hover:border-blue-200"
                                  )}
                                  onClick={() => {
                                    handleCitySelection(country, index);
                                    if (isMobile) {
                                      setTimeout(() => setSelectedLocation({ ...city }), 50);
                                    }
                                  }}
                                >
                                  <MapPin className={cn("w-4 h-4 mr-2 flex-shrink-0", isSelectedCity(country.name, index) ? "text-blue-600" : "text-slate-400")} />
                                  <span className="font-medium truncate">{city.name}</span>
                                  <ChevronRight className="w-4 h-4 ml-auto text-blue-300" />
                                </Button>

                                {isSelectedCity(country.name, index) && city.address && (
                                  <div className="mt-2 p-3 bg-white rounded-lg border border-blue-100 shadow-sm text-sm animate-in fade-in slide-in-from-top-1 duration-300 w-full">
                                    <h4 className="font-semibold text-blue-900 mb-2 pb-1 border-b border-blue-50 flex items-center">
                                      <span className="text-blue-700">{city.name} Office</span>
                                    </h4>

                                    <div className="flex items-start mb-2 group p-1 rounded-md w-full">
                                      <Home className="w-4 h-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                                      <p className="text-slate-600 text-sm leading-relaxed break-words w-full overflow-hidden">{city.address}</p>
                                    </div>

                                    {city.contacts && city.contacts.length > 0 && (
                                      <div className="flex items-start mb-2 group p-1 rounded-md w-full">
                                        <Phone className="w-4 h-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                                        <div className="space-y-1 w-full overflow-hidden">
                                          {city.contacts.map((contact: string, idx: number) => (
                                            <p key={idx} className="text-slate-600 text-sm break-words font-medium">{contact}</p>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {city.email && (
                                      <div className="flex items-start group p-1 rounded-md w-full">
                                        <Mail className="w-4 h-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                                        <a
                                          href={`mailto:${city.email}`}
                                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center text-sm break-all w-full overflow-hidden"
                                        >
                                          {city.email}
                                          <ExternalLink className="ml-1 h-3 w-3 inline" />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;
