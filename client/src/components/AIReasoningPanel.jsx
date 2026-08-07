import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight, Shield, Zap, RefreshCw } from 'lucide-react';

export default function AIReasoningPanel({ decision, agentName = 'Commander Agent', onTriggerReplan }) {
  if (!decision) {
    return (
      <div className="glass-panel rounded-3xl p-6 text-center text-[#CFD0CD] font-mono text-xs">
        <Cpu className="w-8 h-8 mx-auto mb-3 text-[#8A9992] animate-pulse" />
        <p>Awaiting AI Agent Telemetry...</p>
      </div>
    );
  }

  const confidenceColor =
    decision.confidence >= 90
      ? 'text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10'
      : decision.confidence >= 75
      ? 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10'
      : 'text-[#DC2626] border-[#DC2626]/30 bg-[#DC2626]/10';

  const priorityColor =
    decision.priority === 'Critical'
      ? 'bg-[#DC2626] text-white'
      : decision.priority === 'High'
      ? 'bg-[#F97316] text-white'
      : 'bg-[#8A9992] text-[#4D2308] font-bold';

  return (
    <div className="glass-panel-glow rounded-3xl p-5 space-y-4 border border-[#8A9992]/30 bg-[#55443A]/90">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#8A9992]/20 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#8A9992] animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              {agentName}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${priorityColor}`}>
                {decision.priority || 'High'}
              </span>
            </h3>
            <p className="text-[11px] text-[#8A9992]">Explainable Agentic Reasoning</p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 ${confidenceColor}`}>
          <Zap className="w-3.5 h-3.5" />
          <span>{decision.confidence}%</span>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-3 rounded-xl bg-[#4D2308] border border-[#8A9992]/20 text-sm text-[#CFD0CD]">
        <span className="font-medium text-[#8A9992] uppercase text-[10px] block mb-1">Summary</span>
        {decision.summary}
      </div>

      {/* Deep Reasoning */}
      <div className="space-y-1.5">
        <span className="font-medium text-[#8A9992] text-[11px] uppercase">Reasoning Steps</span>
        <p className="text-xs text-[#CFD0CD] bg-[#4D2308] p-3 rounded-xl border border-[#8A9992]/20 leading-relaxed font-mono">
          {decision.reasoning}
        </p>
      </div>

      {/* Commander Overall Plan */}
      {decision.overallPlan && (
        <div className="p-3 rounded-xl bg-[#4D2308] border border-[#8A9992]/20 text-xs space-y-1">
          <span className="font-medium text-[#8A9992] text-[11px] block">Global Master Plan</span>
          <p className="text-[#CFD0CD] font-mono text-[11px]">{decision.overallPlan}</p>
        </div>
      )}

      {/* Recommendations Checklist */}
      {decision.recommendations && decision.recommendations.length > 0 && (
        <div className="space-y-1.5">
          <span className="font-medium text-[#8A9992] text-[11px] uppercase">Recommended Actions</span>
          <div className="grid grid-cols-1 gap-1.5">
            {decision.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#CFD0CD] bg-[#4D2308]/70 p-2.5 rounded-xl border border-[#8A9992]/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Action & Replan */}
      <div className="pt-3 border-t border-[#8A9992]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-[#CFD0CD]">
          <ArrowRight className="w-4 h-4 text-[#8A9992] animate-pulse" />
          <span><strong className="text-white">Next:</strong> {decision.nextAction || decision.next_action}</span>
        </div>

        {onTriggerReplan && (
          <button
            onClick={onTriggerReplan}
            className="px-3.5 py-1.5 rounded-xl bg-[#55443A] hover:bg-[#4D2308] border border-[#8A9992]/40 text-white font-medium text-xs transition-all flex items-center space-x-1.5 shadow-sm shadow-[#55443A]/30"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#8A9992]" />
            <span>Trigger Replan</span>
          </button>
        )}
      </div>
    </div>
  );
}
