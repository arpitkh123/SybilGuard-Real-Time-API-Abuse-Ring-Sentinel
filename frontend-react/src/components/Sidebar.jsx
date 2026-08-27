export default function Sidebar({ activeTab, setActiveTab, isConnected, onReset }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 tracking-tight">
              SybilGuard
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-medium tracking-wide">Enterprise Risk Sentinel</p>
        </div>
        
        <nav className="p-4 space-y-1.5">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20 shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span className="font-medium text-sm">Live Dashboard</span>
          </button>
          
          <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'audit' ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20 shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span className="font-medium text-sm">Explainability Audit</span>
          </button>

          {/* New Mock Features for Density */}
          <div className="pt-4 pb-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 px-4 font-semibold">Infrastructure</p>
          </div>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors opacity-70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-medium text-sm">Global Threat Map</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors opacity-70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            <span className="font-medium text-sm">API Integrations</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-4">
        {/* System Health Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 shadow-inner">
           <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Cluster Health</h4>
           <div className="space-y-3">
             <div>
               <div className="flex justify-between text-xs text-slate-400 mb-1"><span>CPU Load</span><span className="text-cyan-400 font-mono">24%</span></div>
               <div className="w-full bg-slate-800 rounded-full h-1"><div className="bg-cyan-400 h-1 rounded-full w-[24%]"></div></div>
             </div>
             <div>
               <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Mem Usage</span><span className="text-violet-400 font-mono">1.2GB</span></div>
               <div className="w-full bg-slate-800 rounded-full h-1"><div className="bg-violet-400 h-1 rounded-full w-[45%]"></div></div>
             </div>
           </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-lg border border-slate-800/60">
          {isConnected ? (
            <><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span><span className="text-emerald-400 font-mono text-xs">WebSocket: Connected</span></>
          ) : (
            <><span className="relative flex h-2.5 w-2.5"><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span></span><span className="text-rose-500 font-mono text-xs font-bold">WebSocket: Offline</span></>
          )}
        </div>
        <button onClick={onReset} className="w-full text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 py-2.5 rounded-lg transition-colors border border-slate-800">
          Clear Telemetry Cache
        </button>
      </div>
    </aside>
  );
}