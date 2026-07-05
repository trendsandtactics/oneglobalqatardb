import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Globe, Plane, Ship, Truck, Package, FileText, Phone,
  Home, Info, MapPin, ChevronRight, RotateCcw, LayoutDashboard,
  Warehouse, Boxes, Settings, List, Layout, AlignJustify,
} from "lucide-react";
import { defaultContent, resetToDefaults } from "@/pages/api";
import { toast } from "sonner";

const groups = [
  {
    label: "Home Page",
    pages: [
      { key: "home", label: "Home (All Sections)", icon: Home, color: "bg-blue-50 text-blue-700 border-blue-200" },
    ],
  },
  {
    label: "Main Pages",
    pages: [
      { key: "about", label: "About Us", icon: Info, color: "bg-purple-50 text-purple-700 border-purple-200" },
      { key: "services", label: "Services Overview", icon: Package, color: "bg-green-50 text-green-700 border-green-200" },
      { key: "contactPage", label: "Contact", icon: Phone, color: "bg-orange-50 text-orange-700 border-orange-200" },
      { key: "globalPresence", label: "Global Presence", icon: MapPin, color: "bg-teal-50 text-teal-700 border-teal-200" },
    ],
  },
  {
    label: "Service Detail Pages",
    pages: [
      { key: "airFreight", label: "Air Freight", icon: Plane, color: "bg-sky-50 text-sky-700 border-sky-200" },
      { key: "oceanFreight", label: "Ocean Freight", icon: Ship, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
      { key: "roadFreight", label: "Road Freight", icon: Truck, color: "bg-red-50 text-red-700 border-red-200" },
      { key: "customsClearance", label: "Customs Clearance", icon: FileText, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      { key: "warehousing", label: "Warehousing", icon: Warehouse, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { key: "projectLogistics", label: "Project Logistics", icon: Boxes, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    ],
  },
  {
    label: "Shared Content (used across multiple pages)",
    pages: [
      { key: "siteSettings", label: "Contact & Company Info", icon: Settings, color: "bg-pink-50 text-pink-700 border-pink-200" },
      { key: "serviceList", label: "Service List (Cards)", icon: List, color: "bg-violet-50 text-violet-700 border-violet-200" },
      { key: "countrySelector", label: "Country Switcher", icon: Globe, color: "bg-amber-50 text-amber-700 border-amber-200" },
    ],
  },
  {
    label: "Site Layout",
    pages: [
      { key: "header", label: "Header", icon: Layout, color: "bg-gray-50 text-gray-700 border-gray-200" },
      { key: "footer", label: "Footer", icon: AlignJustify, color: "bg-gray-50 text-gray-700 border-gray-200" },
    ],
  },
];

const totalPages = groups.reduce((sum, g) => sum + g.pages.length, 0);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Reset ALL content to default values? This cannot be undone.")) {
      resetToDefaults();
      toast.success("Content reset to defaults. Reload the page to see changes.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-6 w-6 text-brand-navy" />
            <h1 className="text-2xl font-bold text-brand-navy">Admin Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500">All content is stored in the MySQL database, one row per page.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="text-red-600 border-red-200 hover:bg-red-50">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-0 bg-brand-navy text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{totalPages}</div>
            <div className="text-sm opacity-80 mt-1">Editable Sections</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{Object.keys(defaultContent).length}</div>
            <div className="text-sm opacity-80 mt-1">Content Keys</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">MySQL</div>
            <div className="text-sm opacity-80 mt-1">Storage backend</div>
          </CardContent>
        </Card>
      </div>

      {/* Page groups */}
      {groups.map((group) => (
        <div key={group.label} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{group.label}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.pages.map(({ key, label, icon: Icon, color }) => (
              <Card
                key={key}
                className={`border cursor-pointer hover:shadow-md transition-shadow ${color}`}
                onClick={() => navigate(`/admin/manage/${key}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/60">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs opacity-60 mt-0.5">Click to edit</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> Changes are saved to the <code className="bg-blue-100 px-1 rounded text-xs">site_content</code> table in MySQL and take effect immediately on the live site.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
