import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Zap, Shield } from 'lucide-react';
import { api } from '../services/api';

export default function AIDecisionsPage() {
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    api.getAIDecisions().then(res => setDecisions(res.decisions || []));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#8A9992]/20 pb-4">
        <h1 className="text-2xl font-semibold text-white">AI Decision Audit Log & Explainability Engine</h1>
        <p className="text-xs text-[#8A9992] font-mono">100% Transparent Multi-Agent Decision Records & Confidence Scores</p>
      </div>

      <div className="space-y-4">
        {decisions.map((d) => (
          <div key={d.id} className="glass-panel p-5 rounded-3xl space-y-3 border-l-4 border-l-[#8A9992]">
            <div className="flex items-center justify-between text-xs border-b border-[#8A9992]/20 pb-2">
              <span className="font-semibold text-sm text-[#8A9992] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#8A9992]" />
                {d.agent_name}
              </span>
              <span className="font-mono text-[#22C55E] font-bold">{d.confidence}% CONFIDENCE</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#8A9992] uppercase">SUMMARY</span>
              <p className="text-sm font-bold text-white mt-0.5">{d.summary}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#8A9992] uppercase">REASONING TRACE</span>
              <p className="text-xs text-[#CFD0CD] font-mono bg-[#4D2308]/80 p-3 rounded-lg border border-[#8A9992]/20 mt-1">
                {d.reasoning}
              </p>
            </div>

            {d.recommendations && d.recommendations.length > 0 && (
              <div>
                <span className="text-[10px] font-mono text-[#8A9992] uppercase">RECOMMENDED ACTIONS</span>
                <ul className="text-xs text-[#CFD0CD] list-disc list-inside mt-1 space-y-1">
                  {d.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
