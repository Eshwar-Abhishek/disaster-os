import React, { useState, useEffect } from 'react';
import { Bell, Radio, Send, Globe2 } from 'lucide-react';
import { api } from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [customMsg, setCustomMsg] = useState('');
  const [type, setType] = useState('Evacuation');

  const fetchNotifs = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!customMsg) return;
    try {
      await api.runAgentTask('notify', { description: customMsg, type });
      setCustomMsg('');
      fetchNotifs();
    } catch (err) {
      alert('Broadcast error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#8A9992]/20 pb-4">
        <h1 className="text-2xl font-semibold text-white">Emergency Citizen Alert Broadcasting</h1>
        <p className="text-xs text-[#8A9992] font-mono">Multilingual Cell Broadcast • SMS • Socket Alerts</p>
      </div>

      <form onSubmit={handleBroadcast} className="glass-panel p-5 rounded-3xl space-y-4">
        <h3 className="font-semibold text-sm text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          ISSUE NEW PUBLIC SAFETY BROADCAST
        </h3>
        <textarea
          rows={3}
          required
          placeholder="Enter emergency warning instruction for citizens..."
          value={customMsg}
          onChange={(e) => setCustomMsg(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] font-semibold placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-rose-600/30 flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>EXECUTE MULTILINGUAL CELL BROADCAST</span>
        </button>
      </form>

      <div className="glass-panel p-5 rounded-3xl space-y-3">
        <h3 className="font-semibold text-sm text-white">ACTIVE BROADCAST LOGS</h3>
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-3.5 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20 text-xs space-y-1">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#F59E0B]">
                <span>{notif.type} BROADCAST</span>
                <span className="text-[#8A9992]">{new Date(notif.sent_at).toLocaleString()}</span>
              </div>
              <p className="text-[#CFD0CD]">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
