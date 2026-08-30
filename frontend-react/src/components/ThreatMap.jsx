export default function ThreatMap() {
  const regions = [
    { country: "Eastern Europe (AS443)", requests: "14,203", risk: "CRITICAL", color: "text-rose-500", bar: "bg-rose-500 w-[85%]" },
    { country: "Southeast Asia (AS992)", requests: "8,401", risk: "HIGH", color: "text-orange-400", bar: "bg-orange-400 w-[60%]" },
    { country: "North America (AS112)", requests: "3,190", risk: "ELEVATED", color: "text-yellow-400", bar: "bg-yellow-400 w-[30%]" },
    { country: "Western Europe (AS774)", requests: "942", risk: "NORMAL", color: "text-emerald-400", bar: "bg-emerald-400 w-[10%]" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-[fadeIn_0.2s_ease-in]">
      {/* Radar Animation Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
        <h3 className="absolute top-6 left-6 text-sm font-semibold text-slate-200">Live Geo-Radar</h3>
        
        {/* CSS Radar Rings */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute w-full h-full border border-cyan-500/20 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-48 h-48 border border-cyan-500/30 rounded-full"></div>
          <div className="absolute w-32 h-32 border border-cyan-500/40 rounded-full"></div>
          <div className="absolute w-16 h-16 border border-cyan-500/60 rounded-full bg-cyan-500/10"></div>
          
          {/* Threat Dots */}
          <div className="absolute top-12 left-16 w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,1)]"></div>
          <div className="absolute bottom-16 right-20 w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,1)]"></div>
          <div className="absolute top-24 right-12 w-2 h-2 bg-yellow-400 rounded-full"></div>
        </div>
      </div>

      {/* Origin Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200">Anomalous Traffic Origins</h3>
          <p className="text-xs text-slate-500 mt-1">Aggregated by Autonomous System Number (ASN)</p>
        </div>
        <div className="p-6 space-y-6">
          {regions.map((region, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-300">{region.country}</span>
                <span className={`font-mono font-bold ${region.color}`}>{region.risk}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-1">
                <div className={`h-2 rounded-full ${region.bar}`}></div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono text-right">{region.requests} blocked payloads</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}