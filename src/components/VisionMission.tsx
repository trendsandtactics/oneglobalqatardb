import containerShip from '@/assets/container-ship.jpg';
import { Eye, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const VisionMission = () => {
  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const visionMission = siteContent?.home?.visionMission || defaultContent.home.visionMission;

  return (
    <section id="vision" className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${containerShip})` }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">

          {/* Vision Card */}
          <div className="bg-[#0B1C3D] p-10 rounded-2xl border border-white/10 shadow-2xl animate-slide-in-left hover:scale-[1.03] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#0B1C3D] rounded-xl flex items-center justify-center border border-white/20">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">
                OUR VISION
              </h3>
            </div>
            <p className="font-body text-white/90 leading-relaxed text-lg">
              {visionMission.vision}
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-[#0B1C3D] p-10 rounded-2xl border border-white/10 shadow-2xl animate-slide-in-right hover:scale-[1.03] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#0B1C3D] rounded-xl flex items-center justify-center border border-white/20">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">
                OUR MISSION
              </h3>
            </div>
            <p className="font-body text-white/90 leading-relaxed text-lg">
              {visionMission.mission}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisionMission;
