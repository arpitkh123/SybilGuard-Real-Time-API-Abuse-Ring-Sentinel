export default function ApiIntegrations() {
  const integrations = [
    { name: "Razorpay Core Ledger", status: "Connected", desc: "Live transaction blocking via Webhook.", active: true },
    { name: "Slack SecOps Alerts", status: "Active", desc: "Pushing anomaly alerts to #security-ops.", active: true },
    { name: "AWS CloudWatch Logs", status: "Connected", desc: "Exporting raw JSON inference telemetry.", active: true },
    { name: "Datadog APM", status: "Disabled", desc: "Monitor sub-millisecond pipeline latency.", active: false },
  ];

  return (
    <div className="animate-[fadeIn_0.2s_ease-in] max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">Ecosystem Integrations</h2>
        <p className="text-sm text-slate-400 mt-1">Manage where SybilGuard sends mitigation signals and telemetry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((app, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${app.active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}></div>
                <h3 className="text-base font-semibold text-slate-200">{app.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">{app.desc}</p>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${app.active ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                {app.status}
              </span>
            </div>
            
            {/* Toggle Switch UI */}
            <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${app.active ? 'bg-violet-600' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${app.active ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}