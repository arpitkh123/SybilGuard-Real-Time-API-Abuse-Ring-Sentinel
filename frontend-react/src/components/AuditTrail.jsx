export default function AuditTrail({ traffic, selectedTxn, onSelectTxn, setActiveTab }) {
  // Find recent anomalies to show when no specific transaction is selected
  const recentAnomalies = traffic.filter(t => t.is_anomalous).slice(0, 5);

  if (!selectedTxn) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-8 h-full animate-[fadeIn_0.2s_ease-in]">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Pending Explainability Audits</h2>
        <p className="text-sm text-slate-400 mb-6">Select a recent mitigated threat below to view the AI decision rationale, or select a normal transaction from the Live Dashboard.</p>
        
        {recentAnomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-700 rounded-xl bg-slate-950/50">
            <span className="text-emerald-400 mb-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
            <p className="text-slate-400 font-medium">No recent anomalies detected.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAnomalies.map((txn, idx) => (
              <div key={idx} onClick={() => onSelectTxn(txn)} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-lg cursor-pointer transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                  <div>
                    <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{txn.transaction_id}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">Score: {txn.anomaly_score.toFixed(4)}</div>
                  </div>
                </div>
                <button className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-700 group-hover:bg-slate-800 transition-colors">
                  Inspect Vector &rarr;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // The actual detailed audit view (same as before, but modularized)
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden animate-[fadeIn_0.2s_ease-in]">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-200">Incident Telemetry: {selectedTxn.transaction_id}</h3>
        <button onClick={() => { onSelectTxn(null); setActiveTab('dashboard'); }} className="text-xs text-cyan-400 hover:text-cyan-300">
          &larr; Return to Stream
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <span className="text-xs font-semibold text-slate-500 uppercase">Mitigation Status</span>
            <div className={`text-2xl font-bold font-mono mt-1 ${selectedTxn.is_anomalous ? 'text-rose-500' : 'text-emerald-400'}`}>{selectedTxn.mitigation_action}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <span className="text-xs font-semibold text-slate-500 uppercase">Isolation Forest Score</span>
            <div className="text-3xl font-bold font-mono text-violet-400 mt-1">{selectedTxn.anomaly_score.toFixed(4)}</div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feature Vector Weights</h4>
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Temporal Jitter Variance</span>
              <span className={selectedTxn.is_anomalous ? 'text-rose-500 font-bold' : 'text-emerald-400'}>{selectedTxn.is_anomalous ? 'ANOMALOUS' : 'ORGANIC'}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${selectedTxn.is_anomalous ? 'bg-rose-500 w-[12%]' : 'bg-emerald-500 w-[80%]'}`}></div></div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
              <span>ASN Request Velocity</span>
              <span className={selectedTxn.is_anomalous ? 'text-rose-500 font-bold' : 'text-emerald-400'}>{selectedTxn.is_anomalous ? 'SURGE DETECTED' : 'NORMAL'}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${selectedTxn.is_anomalous ? 'bg-rose-500 w-[92%]' : 'bg-emerald-500 w-[24%]'}`}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}