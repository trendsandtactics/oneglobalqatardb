import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LogOut, Home, Info, Package, Phone,
  MapPin, Plane, Ship, FileText, Truck, Globe, Boxes, Warehouse,
  ChevronDown, ChevronUp, Layout, AlignJustify, Settings, List,
} from 'lucide-react';
import { useState } from 'react';
import { logout } from '@/pages/api';

const navGroups = [
  {
    label: "Main Pages",
    items: [
      { key: "home", label: "Home", icon: Home },
      { key: "about", label: "About Us", icon: Info },
      { key: "services", label: "Services", icon: Package },
      { key: "contactPage", label: "Contact", icon: Phone },
      { key: "globalPresence", label: "Global Presence", icon: MapPin },
    ],
  },
  {
    label: "Service Pages",
    items: [
      { key: "airFreight", label: "Air Freight", icon: Plane },
      { key: "oceanFreight", label: "Ocean Freight", icon: Ship },
      { key: "roadFreight", label: "Road Freight", icon: Truck },
      { key: "customsClearance", label: "Customs Clearance", icon: FileText },
      { key: "warehousing", label: "Warehousing", icon: Warehouse },
      { key: "projectLogistics", label: "Project Logistics", icon: Boxes },
    ],
  },
  {
    label: "Shared Content",
    items: [
      { key: "siteSettings", label: "Contact & Company Info", icon: Settings },
      { key: "serviceList", label: "Service List (Cards)", icon: List },
      { key: "countrySelector", label: "Country Switcher", icon: Globe },
    ],
  },
  {
    label: "Site Layout",
    items: [
      { key: "header", label: "Header", icon: Layout },
      { key: "footer", label: "Footer", icon: AlignJustify },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-brand-navy text-white'
        : 'text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <img src="/onegloballogo.png" alt="Logo" className="h-9 w-auto" />
        <div>
          <div className="text-sm font-bold text-brand-navy leading-tight">Admin Panel</div>
          <div className="text-xs text-gray-400">One Global Qatar</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Dashboard link */}
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard className="h-4 w-4 mr-3 flex-shrink-0" />
          Dashboard
        </NavLink>

        <div className="pt-2" />

        {/* Groups */}
        {navGroups.map((group) => {
          const isCollapsed = collapsed[group.label];
          return (
            <div key={group.label} className="mb-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
              >
                {group.label}
                {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {group.items.map(({ key, label, icon: Icon }) => (
                    <NavLink
                      key={key}
                      to={`/admin/manage/${key}`}
                      className={linkClass}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
