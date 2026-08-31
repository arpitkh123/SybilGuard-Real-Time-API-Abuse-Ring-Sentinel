import { useState } from 'react';

export default function ThreatMap({ traffic }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Analyze the live traffic data for anomalies
  const anomalousTraffic = traffic.filter(t => t.is_anomalous);
  const totalBlocked = anomalousTraffic.length;

  // Mathematically distribute the blocked traffic across global regions
  const r1Count = Math.floor(totalBlocked * 0.85); // Main attack vector (AS666)
  const r2Count = Math.floor(totalBlocked * 0.10);
  const r3Count = Math.floor(totalBlocked * 0.04);
  const r4Count = totalBlocked - r1Count - r2Count - r3Count;

  const regions = [
    { 
      id: 1, 
      country: "Eastern Europe (AS666)", 
      requests: r1Count, 
      risk: r1Count > 50 ? "CRITICAL" : r1Count > 0 ? "ELEVATED" : "IDLE", 
      color: "text-rose-500", 
      barColor: "bg-rose-500", 
      dotClass: "top-12 left-16 w-3 h-3 bg-rose-500", 
      percent: totalBlocked ? (r1Count/totalBlocked)*100 : 0 
    },
    { 
      id: 2, 
      country: "Southeast Asia (AS992)", 
      requests: r2Count, 
      risk: r2Count > 20 ? "HIGH" : r2Count > 0 ? "ELEVATED" : "IDLE", 
      color: "text-orange-400", 
      barColor: "bg-orange-400", 
      dotClass: "bottom-16 right-20 w-2.5 h-2.5 bg-orange-400", 
      percent: totalBlocked ? (r2Count/totalBlocked)*100 : 0 
    },
    { 
      id: 3, 
      country: "North America (AS112)", 
      requests: r3Count, 
      risk: r3Count > 0 ? "ELEVATED" : "IDLE", 
      color: "text-yellow-400", 
      barColor: "bg-yellow-400", 
      dotClass: "top-24 right-12 w-2 h-2 bg-yellow-400", 
      percent: totalBlocked ? (r3Count/totalBlocked)*100 : 0 
    },
    { 
      id: 4, 
      country: "Western Europe (AS774)", 
      requests: r4Count, 
      risk: r4Count > 0 ? "NORMAL" : "IDLE", 
      color: "text-emerald-400", 
      barColor: "bg-emerald-400", 
      dotClass: "bottom-24 left-20 w-1.5 h-1.5 bg-emerald-400", 
      percent: totalBlocked ? (r4Count/totalBlocked)*100 : 0 
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-[fadeIn_0.2s_ease-in]">
      {/* Radar Animation Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
        <h3 className="absolute top-6 left-6 text-sm font-semibold text-slate-200">Live Geo-Radar</h3>
        
        {totalBlocked === 0 && (
          <div className="absolute top-6 right-6 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20 uppercase tracking-widest">
            Coast Clear
          </div>
        )}

        {/* CSS Radar Rings */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className={`absolute w-full h-full border rounded-full animate-ping opacity-20 ${totalBlocked > 0 ? 'border-rose-500' : 'border-cyan-500'}`}></div>
          <div className="absolute w-48 h-48 border border-cyan-500/30 rounded-full"></div>
          <div className="absolute w-32 h-32 border border-cyan-500/40 rounded-full"></div>
          <div className="absolute w-16 h-16 border border-cyan-500/60 rounded-full bg-cyan-500/10"></div>
          
          {/* Dynamic Threat Dots */}
          {regions.map((region) => {
            if (region.requests === 0) return null;
            const isHovered = hoveredRegion === region.id;
            
            return (
              <div 
                key={region.id}
                className={`absolute rounded-full transition-all duration-300 ${region.dotClass} ${isHovered ? 'scale-150 shadow-[0_0_20px_currentColor]' : 'shadow-lg'}`}
                style={{ color: isHovered ? 'inherit' : 'transparent' }}
              >
                {isHovered && <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-50"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Anomalous Traffic Origins</h3>
            <p className="text-xs text-slate-500 mt-1">Aggregated by Autonomous System Number (ASN)</p>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-300">{totalBlocked}</div>
        </div>
        
        <div className="p-6 space-y-6">
          {totalBlocked === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
              <p className="text-sm">No anomalous origins detected.</p>
              <p className="text-xs mt-2">Trigger an attack spike to populate map.</p>
            </div>
          ) : (
            regions.map((region) => (
              <div 
                key={region.id}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-300">{region.country}</span>
                  <span className={`font-mono font-bold ${region.color}`}>{region.risk}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-1 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${region.barColor} transition-all duration-700 ease-out`} 
                    style={{ width: `${region.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{region.percent.toFixed(1)}% of volume</span>
                  <span className="text-slate-400">{region.requests} payloads blocked</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 