import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Activity, Users, Shield } from 'lucide-react';

export default function AnalyticsPage() {
  const incidentData = [
    { name: 'Flood', count: 14 },
    { name: 'Earthquake', count: 8 },
    { name: 'Fire', count: 12 },
    { name: 'Collapse', count: 6 },
    { name: 'Chemical', count: 3 },
  ];

  const resourcePie = [
    { name: 'Rescue Teams', value: 45, color: '#55443A' },
    { name: 'Helicopters', value: 15, color: '#8A9992' },
    { name: 'Swift Boats', value: 25, color: '#CFD0CD' },
    { name: 'Ambulances', value: 35, color: '#8A9992' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#8A9992]/20 pb-4">
        <h1 className="text-2xl font-semibold text-white">DisasterOS Telemetry & Response Analytics</h1>
        <p className="text-xs text-[#8A9992] font-mono">Real-time Emergency Statistics & Resource Utilization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#8A9992]" />
            INCIDENTS BY DISASTER CATEGORY
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentData}>
                <XAxis dataKey="name" stroke="#8A9992" fontSize={12} />
                <YAxis stroke="#8A9992" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#55443A', borderColor: '#8A9992', color: '#CFD0CD' }} />
                <Bar dataKey="count" fill="#8A9992" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#8A9992]" />
            RESOURCE FLEET DISTRIBUTION
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resourcePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {resourcePie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#55443A', borderColor: '#8A9992', color: '#CFD0CD' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
