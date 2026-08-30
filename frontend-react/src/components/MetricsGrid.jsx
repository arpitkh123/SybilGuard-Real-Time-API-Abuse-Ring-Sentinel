export default function MetricsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analyzed Ingests</span>
        <p className="text-3xl font-mono font-bold text-violet-400 mt-2">{stats.total}</p>
        <div className="mt-2 text-xs text-slate-500 font-medium">Live WebSocket Feed</div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20 relative overflow-hidden">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mitigated Attacks</span>
        <p className="text-3xl font-mono font-bold text-rose-500 mt-2">{stats.blocked}</p>
        <div className="mt-2 text-xs text-rose-500/80 font-medium">Isolated abuse clusters</div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recovered Margin</span>
        <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">₹ {stats.savings.toLocaleString()}</p>
        <div className="mt-2 text-xs text-emerald-500/80 font-medium">Net loss prevention</div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inference Latency</span>
        <p className="text-3xl font-mono font-bold text-cyan-400 mt-2">{stats.avgLatency} ms</p>
        <div className="mt-2 text-xs text-slate-500 font-medium">Sub-5ms SLA Target</div>
      </div>
    </div>
  );
}