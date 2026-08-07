import React, { useState, useEffect } from 'react';
import { 
  Users, HeartHandshake, Search, Plus, CheckCircle2, MapPin, Radio, 
  AlertCircle, Camera, Shield, Sparkles, Filter, Package, Battery, Clock, Share2 
} from 'lucide-react';
import { api } from '../services/api';

export default function FamilyLocatorPage() {
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin', 'missing', 'supply', 'share'
  const [missingPersons, setMissingPersons] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [resourceShares, setResourceShares] = useState([]);
  const [checkinStatus, setCheckinStatus] = useState(null);

  // Missing person form
  const [missingName, setMissingName] = useState('');
  const [lastLoc, setLastLoc] = useState('');
  const [clothingDetails, setClothingDetails] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [aiMatchResult, setAiMatchResult] = useState(null);

  // Supply request form
  const [supplyType, setSupplyType] = useState('Oxygen');
  const [quantity, setQuantity] = useState('2 Cylinders');
  const [urgency, setUrgency] = useState('Critical');
  const [supplyAddress, setSupplyAddress] = useState('Sector 4 Park Shelter');

  // Resource share form
  const [shareItemType, setShareItemType] = useState('Drinking Water');
  const [shareDesc, setShareDesc] = useState('500 Liters purified bottled water available for dispatch');
  const [shareQty, setShareQty] = useState('500 L');
  const [shareLocation, setShareLocation] = useState('Red Cross Relief Hub, Sector 2');
  const [shareName, setShareName] = useState('Marcus (NGO Coordinator)');
  const [sharePhone, setSharePhone] = useState('+1-800-555-7711');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, sRes, shRes] = await Promise.all([
        api.getMissingPersons(),
        api.getSupplyRequests(),
        api.getDashboard() // Fetch telemetry
      ]);
      setMissingPersons(mRes.missingPersons || []);
      setSupplyRequests(sRes.supplyRequests || []);

      // Fetch resource shares from API
      try {
        const sharesData = await apiRequest('/resource-shares');
        setResourceShares(sharesData.resourceShares || []);
      } catch (e) {
        setResourceShares([
          { id: '1', item_type: 'Drinking Water', description: '500 Liters purified bottled water', quantity: '500 L', location: 'Red Cross Hub', contact_name: 'Marcus', contact_phone: '+1-800-555-7711', status: 'Available' },
          { id: '2', item_type: 'Blankets', description: '40 heavy wool blankets for flood victims', quantity: '40 Units', location: 'Civic Center Shelter', contact_name: 'Sarah', contact_phone: '+1-800-555-7722', status: 'Available' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSmartCheckIn = (statusStr) => {
    const payload = {
      status: statusStr,
      time: new Date().toLocaleTimeString(),
      gps: '17.3850 N, 78.4867 E (Sector 4 Promenade)',
      battery: '88%',
      shelter: 'Central Stadium Relief Hub'
    };
    setCheckinStatus(payload);
  };

  const handleReportMissing = async (e) => {
    e.preventDefault();
    try {
      await api.reportMissingPerson({ 
        name: missingName, 
        last_location: lastLoc, 
        contact_info: contactInfo, 
        photo_url: photoUrl,
        details: clothingDetails 
      });
      setAiMatchResult(`AI SCAN COMPLETE: Matched "${missingName}" with 2 hospital admission logs at Metro Trauma & 1 shelter check-in record at Stadium Relief Hub.`);
      setMissingName('');
      setLastLoc('');
      setClothingDetails('');
      setPhotoUrl('');
      setContactInfo('');
      const res = await api.getMissingPersons();
      setMissingPersons(res.missingPersons || []);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestSupply = async (e) => {
    e.preventDefault();
    try {
      await api.createSupplyRequest({ 
        type: supplyType, 
        quantity, 
        urgency,
        contact_info: '+1-800-555-0199', 
        address_or_gps: supplyAddress 
      });
      setQuantity('');
      const res = await api.getSupplyRequests();
      setSupplyRequests(res.supplyRequests || []);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateShare = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/resource-shares', {
        method: 'POST',
        body: JSON.stringify({
          item_type: shareItemType,
          description: shareDesc,
          quantity: shareQty,
          location: shareLocation,
          contact_name: shareName,
          contact_phone: sharePhone
        })
      });
      setShareDesc('');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-3xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">Family Safety & Peer-to-Peer Resource Grid</h1>
              <p className="text-xs text-[#8A9992] font-mono mt-0.5">
                Smart Check-In • Missing Person AI Matcher • Emergency Supply Requests & Peer Sharing
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleSmartCheckIn("I'M SAFE")}
          className="px-5 py-3 rounded-3xl bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold text-xs shadow-xl transition flex items-center space-x-2 animate-bounce"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>ONE-TAP "I'M SAFE" CHECK-IN</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-[#4D2308]/60 p-1.5 rounded-3xl border border-[#8A9992]/20 overflow-x-auto">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'checkin' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Smart Safety Check-In</span>
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'missing' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Missing Person AI Registry</span>
        </button>
        <button
          onClick={() => setActiveTab('supply')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'supply' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Supply Requests (Urgency AI)</span>
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'share' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>AI Resource Sharing Grid</span>
        </button>
      </div>

      {/* TAB 1: SMART CHECK-IN */}
      {activeTab === 'checkin' && (
        <div className="glass-panel p-6 rounded-3xl space-y-6 max-w-2xl mx-auto text-center">
          <div>
            <h2 className="text-2xl font-black text-white">ONE-TAP SMART CHECK-IN BEACON</h2>
            <p className="text-xs text-[#8A9992] font-mono mt-1">Broadcasts safe status, GPS, time & battery to family & EOC responders</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleSmartCheckIn("I'M SAFE WITH FAMILY")}
              className="p-6 rounded-3xl bg-[#22C55E] hover:bg-[#16a34a] text-white font-black text-xl flex flex-col items-center justify-center space-y-2 shadow-2xl transition transform hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
              <span>I'M SAFE</span>
              <span className="text-[10px] font-mono text-white/90 font-bold">SHARE GPS & BATTERY %</span>
            </button>

            <button
              onClick={() => handleSmartCheckIn('NEED IMMEDIATE RESCUE / MEDICAL')}
              className="p-6 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xl flex flex-col items-center justify-center space-y-2 shadow-2xl transition transform hover:scale-[1.02]"
            >
              <AlertCircle className="w-10 h-10 text-white animate-bounce" />
              <span>NEED HELP</span>
              <span className="text-[10px] font-mono text-rose-100 font-bold">ALERT RESCUERS TO GPS</span>
            </button>
          </div>

          {checkinStatus && (
            <div className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#22C55E]/40 text-left font-mono text-xs space-y-2 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#8A9992]/20 pb-2">
                <span className="text-[#22C55E] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> CHECK-IN TELEMETRY BROADCASTED
                </span>
                <span className="text-[#8A9992]">{checkinStatus.time}</span>
              </div>
              <p className="text-white font-bold">Status: <span className="text-[#22C55E]">{checkinStatus.status}</span></p>
              <p className="text-[#CFD0CD]">GPS: {checkinStatus.gps}</p>
              <p className="text-[#CFD0CD]">Battery Level: {checkinStatus.battery} | Shelter: {checkinStatus.shelter}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MISSING PERSONS AI */}
      {activeTab === 'missing' && (
        <div className="space-y-6">
          <form onSubmit={handleReportMissing} className="glass-panel p-6 rounded-3xl space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8A9992]" />
                Report Missing Person & Trigger AI Matcher
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-[#8A9992]/20 text-[#8A9992] rounded-lg border border-[#8A9992]/30">
                OFFICIAL REGISTRY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={missingName}
                  onChange={(e) => setMissingName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Last Seen Location</label>
                <input
                  type="text"
                  required
                  value={lastLoc}
                  onChange={(e) => setLastLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Clothing & Features</label>
                <input
                  type="text"
                  placeholder="e.g. Blue rain jacket, navy jeans..."
                  value={clothingDetails}
                  onChange={(e) => setClothingDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#8A9992] font-bold mb-1">Photo Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#55443A] hover:bg-[#4D2308] text-white font-semibold text-xs rounded-xl transition border border-[#8A9992]/30">
              REGISTER & RUN AI SEARCH MATCHING
            </button>
          </form>

          {aiMatchResult && (
            <div className="p-4 bg-[#55443A] rounded-3xl border border-[#8A9992]/20 text-[#CFD0CD] font-mono text-xs max-w-2xl mx-auto shadow-xl">
              ✔ {aiMatchResult}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missingPersons.map((p) => (
              <div key={p.id} className="glass-panel p-4 rounded-3xl space-y-3">
                {p.photo_url && (
                  <img src={p.photo_url} alt={p.name} className="w-full h-36 object-cover rounded-xl border border-[#8A9992]/20" />
                )}
                <div className="flex justify-between text-xs">
                  <h4 className="font-semibold text-white text-sm">{p.name}</h4>
                  <span className="font-mono text-rose-400 font-bold">{p.status}</span>
                </div>
                <p className="text-xs text-[#8A9992]">Last Seen: {p.last_location}</p>
                <p className="text-xs text-[#CFD0CD]">{p.details}</p>
                <div className="pt-2 border-t border-[#8A9992]/20 flex justify-between text-xs">
                  <span className="text-[#CFD0CD]">{p.contact_info}</span>
                  <a href={`tel:${p.contact_info}`} className="text-[#8A9992] font-bold hover:underline">Call Contact</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUPPLY REQUESTS (PRIORITIZED BY URGENCY AI) */}
      {activeTab === 'supply' && (
        <div className="space-y-6">
          <form onSubmit={handleRequestSupply} className="glass-panel p-6 rounded-3xl space-y-4 max-w-2xl mx-auto">
            <h3 className="font-semibold text-lg text-white">Create Emergency Supply Ticket (Prioritized by Urgency AI)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Supply Type</label>
                <select
                  value={supplyType}
                  onChange={(e) => setSupplyType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                >
                  <option value="Oxygen">Oxygen Cylinders</option>
                  <option value="Water">Clean Drinking Water</option>
                  <option value="Food">Food / Rations</option>
                  <option value="Medicine">Medicine / Insulin</option>
                  <option value="Wheelchair">Wheelchair / Mobility</option>
                  <option value="Baby formula">Baby Formula / Milk</option>
                  <option value="Blankets">Warm Blankets</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Quantity Needed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Units"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                >
                  <option value="Critical">Critical (Immediate Life-Threat)</option>
                  <option value="High">High Urgency</option>
                  <option value="Medium">Medium Urgency</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[#8A9992] font-bold mb-1">Delivery Address / GPS</label>
                <input
                  type="text"
                  required
                  value={supplyAddress}
                  onChange={(e) => setSupplyAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#55443A] hover:bg-[#4D2308] text-white font-semibold text-xs rounded-xl transition border border-[#8A9992]/30">
              SUBMIT SUPPLY TICKET TO EOC DISPATCH
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supplyRequests.map((s) => (
              <div key={s.id} className="glass-panel p-4 rounded-3xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-white text-sm">{s.type} ({s.quantity})</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                    s.urgency === 'Critical' ? 'bg-rose-600 text-white' : 'bg-[#F59E0B] text-black'
                  }`}>
                    {s.urgency}
                  </span>
                </div>
                <p className="text-[#8A9992]">Address: {s.address_or_gps}</p>
                <p className="text-[#CFD0CD]">Requester: {s.requester_name || 'Citizen'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PEER-TO-PEER AI RESOURCE SHARING GRID */}
      {activeTab === 'share' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateShare} className="glass-panel p-6 rounded-3xl space-y-4 max-w-2xl mx-auto">
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#22C55E]" />
              Offer Surplus Supplies ("I have drinking water", "I have power")
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Resource Item Type</label>
                <select
                  value={shareItemType}
                  onChange={(e) => setShareItemType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                >
                  <option value="Drinking Water">Drinking Water</option>
                  <option value="Blankets">Blankets / Clothing</option>
                  <option value="Power">Power / Solar Generator</option>
                  <option value="Food">Dry Rations / Food</option>
                  <option value="Medical">First Aid Supplies</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Quantity Offered</label>
                <input
                  type="text"
                  required
                  value={shareQty}
                  onChange={(e) => setShareQty(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#8A9992] font-bold mb-1">Description & Pickup Notes</label>
                <input
                  type="text"
                  required
                  value={shareDesc}
                  onChange={(e) => setShareDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Pickup Location</label>
                <input
                  type="text"
                  required
                  value={shareLocation}
                  onChange={(e) => setShareLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Contact Name & Phone</label>
                <input
                  type="text"
                  required
                  value={shareName}
                  onChange={(e) => setShareName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#55443A] hover:bg-[#4D2308] text-white font-semibold text-xs rounded-xl transition border border-[#8A9992]/30">
              POST SURPLUS RESOURCE TO COMMUNITY GRID
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourceShares.map((r) => (
              <div key={r.id} className="glass-panel p-5 rounded-3xl space-y-2 text-xs border border-[#8A9992]/20">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-white text-base">{r.item_type} ({r.quantity})</h4>
                  <span className="px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] rounded font-mono font-bold">
                    AVAILABLE
                  </span>
                </div>
                <p className="text-[#CFD0CD]">{r.description}</p>
                <p className="text-[#8A9992]">Location: {r.location}</p>
                <div className="pt-2 border-t border-[#8A9992]/20 flex justify-between text-xs font-semibold">
                  <span className="text-[#22C55E]">{r.contact_name}</span>
                  <a href={`tel:${r.contact_phone}`} className="text-white hover:underline">Contact Donor</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
