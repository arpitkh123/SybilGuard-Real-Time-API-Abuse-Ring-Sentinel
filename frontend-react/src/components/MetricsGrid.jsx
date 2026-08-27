export default function MetricsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Analyzed Ingests</span>
        <p className="text-3xl font-mono font-bold text-blue-400 mt-2">{stats.total}</p>
        <div className="mt-2 text-xs text-gray-500">Live WebSocket Feed</div>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mitigated Attacks</span>
        <p className="text-3xl font-mono font-bold text-red-400 mt-2">{stats.blocked}</p>
        <div className="mt-2 text-xs text-red-400/80">Isolated abuse clusters</div>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recovered Margin</span>
        <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">₹ {stats.savings.toLocaleString()}</p>
        <div className="mt-2 text-xs text-emerald-400/80">Net loss prevention</div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inference Latency</span>
        <p className="text-3xl font-mono font-bold text-teal-300 mt-2">{stats.avgLatency} ms</p>
        <div className="mt-2 text-xs text-gray-500">Sub-5ms SLA Target</div>
      </div>
    </div>
  );
}