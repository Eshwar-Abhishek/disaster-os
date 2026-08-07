import React, { useState, useEffect } from 'react';
import { 
  Lock, Shield, CheckCircle2, XCircle, UserX, UserCheck, Trash2, Cpu, Activity, 
  FileText, ShieldAlert, Server, Users, Sparkles, Building, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requests' | 'users' | 'security' | 'health'
  const [commanderRequests, setCommanderRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [reqRes, usrRes, secRes, audRes, hltRes] = await Promise.all([
        api.getCommanderRequests(),
        api.getAdminUsers(),
        api.getSecurityLogs(),
        api.getAuditLogs(),
        api.getSystemHealth()
      ]);

      setCommanderRequests(reqRes.requests || []);
      setUsers(usrRes.users || []);
      setSecurityLogs(secRes.logs || []);
      setAuditLogs(audRes.logs || []);
      setSystemHealth(hltRes || null);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCommander = async (reqId) => {
    try {
      const res = await api.approveCommanderRequest(reqId);
      setMsg(res.message);
      loadAdminData();
    } catch (err) {
      alert('Approval failed: ' + err.message);
    }
  };

  const handleRejectCommander = async (reqId) => {
    try {
      const res = await api.rejectCommanderRequest(reqId);
      setMsg(res.message);
      loadAdminData();
    } catch (err) {
      alert('Rejection failed: ' + err.message);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const res = await api.toggleUserActive(userId);
      setMsg(res.message);
      loadAdminData();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      const res = await api.deleteUser(userId);
      setMsg(res.message);
      loadAdminData();
    } catch (err) {
      alert('Deletion failed: ' + err.message);
    }
  };

  const pendingRequests = commanderRequests.filter(r => r.status === 'Pending');
  const commanders = users.filter(u => (u.role || '').toUpperCase() === 'COMMANDER' || (u.role || '').toUpperCase() === 'OPERATOR');
  const victims = users.filter(u => (u.role || '').toUpperCase() === 'VICTIM' || (u.role || '').toUpperCase() === 'CITIZEN');

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-3xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center">
            <Lock className="w-7 h-7 text-[#CFD0CD]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">System Admin EOC Command Center</h1>
            <p className="text-xs text-[#8A9992] font-mono mt-0.5">
              Full Platform Control • Commander Approval Workflow • User & RBAC Management
            </p>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 bg-[#4D2308] hover:bg-[#55443A] border border-[#8A9992]/30 text-[#CFD0CD] hover:text-white font-semibold text-xs rounded-3xl transition flex items-center space-x-2 shadow-lg"
        >
          <RefreshCw className="w-4 h-4 text-[#8A9992]" />
          <span>Refresh Admin Store</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 bg-[#22C55E]/20 border border-[#22C55E]/40 rounded-2xl text-[#22C55E] text-xs font-mono text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Admin Section Tabs */}
      <div className="flex bg-[#4D2308]/80 p-1.5 rounded-2xl border border-[#8A9992]/20 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition font-bold whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl transition font-bold whitespace-nowrap flex items-center gap-2 relative ${
            activeTab === 'requests' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Commander Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl transition font-bold whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Role Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl transition font-bold whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'security' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Security & Audit Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2.5 rounded-xl transition font-bold whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'health' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Database & Platform Health</span>
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-mono text-[#8A9992] font-bold block">TOTAL USERS</span>
              <div className="text-3xl font-extrabold text-white font-mono">{users.length}</div>
              <p className="text-[11px] text-[#8A9992]">{commanders.length} Commanders • {victims.length} Victims</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-mono text-[#8A9992] font-bold block">PENDING COMMANDER REQUESTS</span>
              <div className="text-3xl font-extrabold text-[#F59E0B] font-mono">{pendingRequests.length}</div>
              <p className="text-[11px] text-[#8A9992]">Requires Admin Verification</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-mono text-[#8A9992] font-bold block">SECURITY LOGS RECORDED</span>
              <div className="text-3xl font-extrabold text-[#22C55E] font-mono">{securityLogs.length}</div>
              <p className="text-[11px] text-[#8A9992]">Audit Events Tracked</p>
            </div>

            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-mono text-[#8A9992] font-bold block">PLATFORM STATUS</span>
              <div className="text-2xl font-extrabold text-[#22C55E] font-mono">{systemHealth?.health || 'OPTIMAL'}</div>
              <p className="text-[11px] text-[#8A9992]">Multi-Agent Cycle Active</p>
            </div>
          </div>

          {/* Quick Action Pending Commander Table */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8A9992]" />
              PENDING COMMANDER APPROVALS ({pendingRequests.length})
            </h3>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-[#8A9992] font-mono">No pending commander access requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-[#4D2308]/90 rounded-2xl border border-[#8A9992]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{req.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[10px] font-bold">
                          {req.gov_org}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A9992] font-mono">{req.email} • {req.phone} • {req.designation}</p>
                      <p className="text-xs text-[#CFD0CD] mt-1"><span className="text-[#8A9992] font-bold">Reason:</span> {req.reason}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveCommander(req.id)}
                        className="px-4 py-2 bg-[#22C55E] hover:bg-[#22C55E]/80 text-[#111827] font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>APPROVE COMMANDER</span>
                      </button>

                      <button
                        onClick={() => handleRejectCommander(req.id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>REJECT</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMMANDER REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-semibold text-lg text-white">ALL COMMANDER ACCESS REQUESTS ({commanderRequests.length})</h3>
          <div className="space-y-3">
            {commanderRequests.map((req) => (
              <div key={req.id} className="p-4 bg-[#4D2308]/90 rounded-2xl border border-[#8A9992]/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8A9992]/20 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-base">{req.name}</h4>
                    <p className="text-xs text-[#8A9992] font-mono">{req.email} • ID: {req.employee_id || 'N/A'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl font-mono text-xs font-bold ${
                    req.status === 'Approved' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30' :
                    req.status === 'Rejected' ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30' :
                    'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                  }`}>
                    STATUS: {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div><span className="text-[#8A9992] block text-[10px]">GOVT ORGANIZATION</span><span className="text-white font-bold">{req.gov_org}</span></div>
                  <div><span className="text-[#8A9992] block text-[10px]">DEPARTMENT / DESIGNATION</span><span className="text-white font-bold">{req.department} ({req.designation})</span></div>
                  <div><span className="text-[#8A9992] block text-[10px]">REGION & PHONE</span><span className="text-white font-bold">{req.region} ({req.phone})</span></div>
                </div>

                <div className="p-3 bg-[#55443A]/80 rounded-xl text-xs text-[#CFD0CD]">
                  <span className="font-bold text-[#8A9992] block font-mono text-[10px]">REASON FOR ACCESS:</span>
                  {req.reason}
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleApproveCommander(req.id)}
                      className="px-4 py-2 bg-[#22C55E] text-[#111827] font-bold text-xs rounded-xl hover:bg-[#22C55E]/80 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Generate Commander Account</span>
                    </button>
                    <button
                      onClick={() => handleRejectCommander(req.id)}
                      className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-500 transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-semibold text-lg text-white">SYSTEM USERS & ROLE MANAGEMENT ({users.length})</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#8A9992]/20 text-[#8A9992]">
                  <th className="pb-3 px-2">USER</th>
                  <th className="pb-3 px-2">EMAIL</th>
                  <th className="pb-3 px-2">ROLE</th>
                  <th className="pb-3 px-2">STATUS</th>
                  <th className="pb-3 px-2">LAST LOGIN</th>
                  <th className="pb-3 px-2 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8A9992]/10 text-[#CFD0CD]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#4D2308]/50 transition">
                    <td className="py-3 px-2 font-bold text-white">{u.full_name || u.name}</td>
                    <td className="py-3 px-2 text-[#8A9992]">{u.email}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        (u.role || '').toUpperCase() === 'ADMIN' ? 'bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30' :
                        (u.role || '').toUpperCase() === 'COMMANDER' ? 'bg-[#55443A] text-white border border-[#8A9992]/30' :
                        'bg-[#4D2308] text-[#CFD0CD] border border-[#8A9992]/20'
                      }`}>
                        {(u.role || 'VICTIM').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${u.is_active ? 'text-[#22C55E]' : 'text-rose-400'}`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[#8A9992]">{u.last_login ? new Date(u.last_login).toLocaleString() : 'N/A'}</td>
                    <td className="py-3 px-2 text-right space-x-2">
                      {u.email !== 'admin@resq.gov' && (
                        <>
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            className="px-2.5 py-1 bg-[#55443A] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] rounded-lg transition font-bold"
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="px-2 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg transition font-bold"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECURITY LOGS TAB */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-base text-white">SECURITY AUDIT TRAIL ({securityLogs.length})</h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto font-mono text-xs pr-1">
              {securityLogs.map((log, idx) => (
                <div key={log.id || idx} className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20 space-y-1">
                  <div className="flex justify-between text-[10px] text-[#8A9992]">
                    <span className="font-bold text-[#CFD0CD]">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-white">{log.user_email} • IP: {log.ip || '127.0.0.1'}</p>
                  <p className="text-xs text-[#8A9992]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-base text-white">SYSTEM ACTION AUDIT LOGS ({auditLogs.length})</h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto font-mono text-xs pr-1">
              {auditLogs.map((log, idx) => (
                <div key={log.id || idx} className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20 space-y-1">
                  <div className="flex justify-between text-[10px] text-[#8A9992]">
                    <span className="font-bold text-[#22C55E]">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-white">By: {log.performed_by || 'System'}</p>
                  <p className="text-xs text-[#CFD0CD]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HEALTH TAB */}
      {activeTab === 'health' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-semibold text-lg text-white">DATABASE & PLATFORM HEALTH DIAGNOSTICS</h3>

          {systemHealth && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#4D2308]/90 rounded-2xl border border-[#8A9992]/20 space-y-2">
                <span className="text-[#8A9992] block text-[10px]">DATABASE ENGINE</span>
                <span className="text-white font-bold text-base">{systemHealth.database}</span>
                <p className="text-[#CFD0CD]">Active Users: {systemHealth.total_registered_users}</p>
              </div>

              <div className="p-4 bg-[#4D2308]/90 rounded-2xl border border-[#8A9992]/20 space-y-2">
                <span className="text-[#8A9992] block text-[10px]">SERVER UPTIME</span>
                <span className="text-[#22C55E] font-bold text-base">{Math.floor(systemHealth.uptime)} seconds</span>
                <p className="text-[#CFD0CD]">Status: {systemHealth.health}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
