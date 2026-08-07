import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom SVG Markers Generator
const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 15px;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

const incidentIcon = createCustomIcon('#DC2626', '⚠️');
const hospitalIcon = createCustomIcon('#CFD0CD', '🏥');
const resourceIcon = createCustomIcon('#8A9992', '🚁');
const shelterIcon = createCustomIcon('#55443A', '⛺');

// Specific Hazard Marker Icons for Bridges, Chemical Leaks, Crowds & Barricades
const bridgeIcon = createCustomIcon('#DC2626', '🌉');
const chemicalIcon = createCustomIcon('#DC2626', '🧪');
const crowdIcon = createCustomIcon('#EAB308', '👥');
const barricadeIcon = createCustomIcon('#F97316', '🚧');
const genericHazardIcon = createCustomIcon('#DC2626', '☣️');

function getHazardIconAndColor(hazardType) {
  const typeLower = (hazardType || '').toLowerCase();
  if (typeLower.includes('bridge') || typeLower.includes('collapsed bridge')) {
    return { icon: bridgeIcon, color: '#ef4444', label: 'Collapsed Bridge' };
  }
  if (typeLower.includes('chemical') || typeLower.includes('leak') || typeLower.includes('gas')) {
    return { icon: chemicalIcon, color: '#ef4444', label: 'Chemical Plume Leak' };
  }
  if (typeLower.includes('crowd') || typeLower.includes('panic')) {
    return { icon: crowdIcon, color: '#eab308', label: 'Crowd Bottleneck' };
  }
  if (typeLower.includes('barricade') || typeLower.includes('police') || typeLower.includes('blocked')) {
    return { icon: barricadeIcon, color: '#f97316', label: 'Police Barricade' };
  }
  return { icon: genericHazardIcon, color: '#ef4444', label: hazardType || 'Hazard' };
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

const victimSosIcon = createCustomIcon('#F59E0B', '🚨');

export default function InteractiveMap({ 
  incidents = [], 
  hospitals = [], 
  resources = [], 
  shelters = [], 
  hazards = [], 
  supplyRequests = [],
  activeRoute = null, 
  height = '450px' 
}) {
  const defaultCenter = [17.4065, 78.4772]; // Hyderabad default center

  // Sample Dynamic Reroute Waypoints bypassing Collapsed Bridge & Chemical Leak
  const sampleDynamicReroute = activeRoute || [
    [17.3850, 78.4867], // Sector 4 Flood Origin
    [17.3920, 78.4720], // Highway 7 Bypass (Bypassing Collapsed Bridge)
    [17.4080, 78.4610], // Safe Corridor North of Chemical Leak
    [17.4100, 78.4600]  // Metro General Hospital ER Entrance
  ];

  return (
    <div style={{ height, width: '100%' }} className="rounded-3xl overflow-hidden border border-[#8A9992]/20 shadow-elevated relative">
      <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={incidents.length > 0 ? [parseFloat(incidents[0].latitude), parseFloat(incidents[0].longitude)] : defaultCenter} />
        
        {/* Dark Tactical Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Incidents Markers & Threat Perimeters */}
        {incidents.map((inc) => {
          const lat = parseFloat(inc.latitude);
          const lng = parseFloat(inc.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <React.Fragment key={`inc-${inc.id}`}>
              <Marker position={[lat, lng]} icon={incidentIcon}>
                <Popup>
                  <div className="text-slate-900 font-sans p-1 min-w-[220px]">
                    <span className="text-xs font-bold uppercase bg-[#ef4444] text-white px-2 py-0.5 rounded">
                      {inc.severity} • {inc.type}
                    </span>
                    <h4 className="font-extrabold text-sm mt-1">{inc.title}</h4>
                    <p className="text-xs text-slate-700 mt-1">{inc.description}</p>
                    <p className="text-xs font-bold text-[#ef4444] mt-1">Casualties Risk: {inc.casualties}</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[lat, lng]}
                radius={inc.severity === 'Critical' ? 1200 : 600}
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 }}
              />
            </React.Fragment>
          );
        })}

        {/* Hospitals Markers */}
        {hospitals.map((hosp) => {
          const lat = parseFloat(hosp.latitude);
          const lng = parseFloat(hosp.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={`hosp-${hosp.id}`} position={[lat, lng]} icon={hospitalIcon}>
              <Popup>
                <div className="text-slate-900 font-sans p-1">
                  <h4 className="font-bold text-sm">{hosp.name}</h4>
                  <p className="text-xs text-slate-600">{hosp.address}</p>
                  <div className="text-xs font-bold text-[#22c55e] mt-1">
                    Beds Available: {hosp.available_beds} / {hosp.total_beds} (ICU: {hosp.icu_beds})
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Resources Markers */}
        {resources.map((res) => {
          const lat = parseFloat(res.current_lat);
          const lng = parseFloat(res.current_lng);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={`res-${res.id}`} position={[lat, lng]} icon={resourceIcon}>
              <Popup>
                <div className="text-slate-900 font-sans p-1">
                  <h4 className="font-bold text-sm">{res.name} ({res.type})</h4>
                  <p className="text-xs font-semibold text-[#8A9992]">Status: {res.status}</p>
                  <p className="text-xs text-slate-600">Operator: {res.operator_name || 'Unit Commander'}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelters Markers */}
        {shelters.map((sh) => {
          const lat = parseFloat(sh.latitude);
          const lng = parseFloat(sh.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={`sh-${sh.id}`} position={[lat, lng]} icon={shelterIcon}>
              <Popup>
                <div className="text-slate-900 font-sans p-1">
                  <h4 className="font-bold text-sm">{sh.name}</h4>
                  <p className="text-xs text-slate-600">Occupancy: {sh.occupied} / {sh.capacity}</p>
                  <p className="text-xs text-[#84A98C] font-bold mt-0.5">
                    Food: {sh.food_available ? 'Yes' : 'No'} • Water: {sh.water_available ? 'Yes' : 'No'} • Pets: {sh.pet_friendly ? 'Yes' : 'No'}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Hazard Markers for Collapsed Bridges, Chemical Leaks, Crowds & Barricades */}
        {hazards.map((hz) => {
          const lat = parseFloat(hz.latitude);
          const lng = parseFloat(hz.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          const meta = getHazardIconAndColor(hz.hazard_type);

          return (
            <React.Fragment key={`hz-${hz.id}`}>
              <Marker position={[lat, lng]} icon={meta.icon}>
                <Popup>
                  <div className="text-slate-900 font-sans p-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white" style={{ backgroundColor: meta.color }}>
                      {meta.label}
                    </span>
                    <h4 className="font-extrabold text-sm mt-1">{hz.hazard_type}</h4>
                    <p className="text-xs text-slate-700 mt-1">{hz.description}</p>
                    <p className="text-[10px] font-mono text-[#ef4444] mt-1">⚠️ DYNAMIC AI REROUTING APPLIED</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[lat, lng]}
                radius={400}
                pathOptions={{ color: meta.color, fillColor: meta.color, fillOpacity: 0.25 }}
              />
            </React.Fragment>
          );
        })}

        {/* Victim Emergency & Supply SOS Markers */}
        {supplyRequests.map((sp) => {
          const lat = parseFloat(sp.latitude);
          const lng = parseFloat(sp.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <React.Fragment key={`sp-${sp.id}`}>
              <Marker position={[lat, lng]} icon={victimSosIcon}>
                <Popup>
                  <div className="text-slate-900 font-sans p-1 min-w-[200px]">
                    <span className="text-[10px] font-bold uppercase bg-[#F59E0B] text-slate-900 px-2 py-0.5 rounded">
                      VICTIM SOS: {sp.type}
                    </span>
                    <h4 className="font-extrabold text-sm mt-1">{sp.requester_name}</h4>
                    <p className="text-xs text-slate-700">Phone: {sp.contact_info}</p>
                    <p className="text-xs text-slate-700">Details: {sp.quantity}</p>
                    <p className="text-[10px] font-mono text-[#DC2626] font-bold mt-1">GPS: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[lat, lng]}
                radius={300}
                pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.25 }}
              />
            </React.Fragment>
          );
        })}

        {/* Dynamic AI Rerouting Safe Path Overlay */}
        <Polyline
          positions={sampleDynamicReroute}
          pathOptions={{ color: '#22C55E', weight: 5, opacity: 0.85, dashArray: '12, 12' }}
        />
      </MapContainer>
    </div>
  );
}
