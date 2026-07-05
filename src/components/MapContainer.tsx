
import React, { useRef, useState } from 'react';
import { RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const MapContainer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });
  const MAP_URL = siteContent?.globalPresence?.mapEmbedUrl || defaultContent.globalPresence.mapEmbedUrl;

  const handleReload = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
      setIsLoaded(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className={`bg-card rounded-2xl shadow-lg overflow-hidden relative w-full transition-all duration-300 ease-in-out ${isFullScreen ? 'max-w-full' : 'max-w-6xl'}`}>
        {/* Map Header */}
        <div className="flex justify-between items-center p-3 border-b border-border bg-gradient-to-r from-accent/5 to-card">
          <h3 className="font-medium text-primary flex items-center">
            <span className="hidden sm:inline">Interactive Global Presence Map</span>
            <span className="sm:hidden">Global Map</span>
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReload} className="text-primary border-border hover:bg-accent/10">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullScreen} className="text-primary border-border hover:bg-accent/10">
              {isFullScreen ? <>
                  <Minimize2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Compact</span>
                </> : <>
                  <Maximize2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Expand</span>
                </>}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className={`relative transition-all duration-300 ${isFullScreen ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          {/* Mask the top black Google bar */}
          <div className="absolute top-0 left-0 w-full h-[50px] bg-card z-10 pointer-events-none" />
          
          <iframe 
            ref={iframeRef} 
            src={MAP_URL} 
            title="Interactive Map" 
            className="w-full h-full border-0" 
            loading="eager" 
            style={{
              marginTop: '-125px',
              backgroundColor: 'transparent',
              filter: 'contrast(1.05) saturate(1.1)'
            }} 
            onLoad={() => setIsLoaded(true)}
          ></iframe>
          
          {/* Loading Spinner */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-card bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
                <p className="mt-3 text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Footer */}
        <div className="py-2 px-4 border-t border-border bg-gradient-to-r from-card to-accent/5 text-xs text-muted-foreground text-center">
          <p>© 2025 OGL Global Presence Map | Data updated quarterly</p>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
