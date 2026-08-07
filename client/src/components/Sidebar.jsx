import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, MapPin, Truck, Hospital, Home, 
  Bell, Cpu, FileText, BarChart3, Users, HeartHandshake, ShieldCheck, 
  UserCheck, LifeBuoy, Baby, Dog, Radio, Lock, ShieldAlert, HeartPulse, FileCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mode }) {
  const { user, role } = useAuth();
  const userRole = (role || user?.role || '').toUpperCase();

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: Lock, highlight: true },
    { name: 'Incidents Overview', path: '/incidents', icon: AlertTriangle },
    { name: 'Live GIS Map', path: '/live-map', icon: MapPin },
    { name: 'Hospitals & Beds', path: '/hospitals', icon: Hospital },
    { name: 'Shelters & Relief', path: '/shelters', icon: Home },
    { name: 'AI Decision Audit', path: '/ai-decisions', icon: Cpu },
    { name: 'SitRep Reports', path: '/reports', icon: FileText },
    { name: 'User & Profile Settings', path: '/profile', icon: UserCheck },
  ];

  const commanderNav = [
    { name: 'Commander Operations', path: '/commander/dashboard', icon: ShieldAlert, highlight: true },
    { name: 'Live GIS Map', path: '/live-map', icon: MapPin },
    { name: 'Incident Command', path: '/incidents', icon: AlertTriangle },
    { name: 'Animal & Pet Rescue', path: '/animal-rescue', icon: Dog },
    { name: 'Resource Allocation', path: '/resources', icon: Truck },
    { name: 'Hospitals & Beds', path: '/hospitals', icon: Hospital },
    { name: 'Shelters & Relief', path: '/shelters', icon: Home },
    { name: 'AI Decision Audit', path: '/ai-decisions', icon: Cpu },
    { name: 'SitRep & Reports', path: '/reports', icon: FileText },
    { name: 'Analytics & Trends', path: '/analytics', icon: BarChart3 },
    { name: 'Broadcast Alerts', path: '/notifications', icon: Bell },
    { name: 'Commander Profile', path: '/profile', icon: UserCheck },
  ];

  const victimNav = [
    { name: 'Victim Portal', path: '/victim/dashboard', icon: HeartPulse, highlight: true },
    { name: 'Survival & Triage', path: '/survival', icon: LifeBuoy },
    { name: 'GPS Nearby Finder', path: '/nearby-finder', icon: MapPin },
    { name: 'Child Rescue Help', path: '/child-rescue', icon: Baby },
    { name: 'Animal & Pet Rescue', path: '/animal-rescue', icon: Dog },
    { name: 'Report Emergency SOS', path: '/report-incident', icon: AlertTriangle },
    { name: 'Family Safe Check-In', path: '/family-locator', icon: Users },
    { name: 'Disaster Preparedness', path: '/preparedness', icon: ShieldCheck },
    { name: 'Profile & ICE Card', path: '/profile', icon: UserCheck },
  ];

  let currentNav = victimNav;
  let navLabel = 'Victim Survival Portal';

  if (userRole === 'ADMIN') {
    currentNav = adminNav;
    navLabel = 'Admin Command Center';
  } else if (userRole === 'COMMANDER' || userRole === 'OPERATOR') {
    currentNav = commanderNav;
    navLabel = 'Commander Operations';
  }

  return (
    <aside className="w-64 bg-[#4D2308] border-r border-[#8A9992]/15 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="p-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-2.5 text-[11px] font-semibold text-[#8A9992] uppercase tracking-wider flex items-center justify-between">
          <span>{navLabel}</span>
          <span className="text-[10px] bg-[#8A9992]/20 px-2 py-0.5 rounded text-[#8A9992] font-mono">
            {userRole}
          </span>
        </div>

        {currentNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#8A9992] text-[#4D2308] font-bold shadow-md shadow-[#8A9992]/25'
                    : 'text-[#CFD0CD] hover:text-white hover:bg-[#55443A]/60'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] shrink-0 text-[#8A9992]" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-3 border-t border-[#8A9992]/15">
        <div className="p-3 rounded-xl bg-[#55443A] border border-[#8A9992]/20 text-xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8A9992]/20 flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#8A9992] animate-pulse shrink-0" />
          </div>
          <div>
            <p className="font-semibold text-[12px] text-white">RBAC Active</p>
            <p className="text-[10px] text-[#CFD0CD] font-mono">Role: {userRole || 'GUEST'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
