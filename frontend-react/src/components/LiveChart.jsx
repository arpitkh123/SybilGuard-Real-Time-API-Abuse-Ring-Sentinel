import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LiveChart({ traffic }) {
  // We reverse the array so the graph flows from left to right (oldest to newest)
  const chartData = [...traffic].reverse().map((txn, index) => ({
    index: index,
    score: parseFloat(txn.anomaly_score.toFixed(3)),
    isAnomaly: txn.is_anomalous,
    id: txn.transaction_id
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col h-[280px]">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/70 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-200">Isolation Forest Decision Boundary</h3>
        <div className="flex space-x-3 text-[10px] font-mono">
          <span className="text-cyan-400 flex items-center"><div className="w-2 h-2 bg-cyan-400 rounded-full mr-1"></div> Baseline</span>
          <span className="text-rose-500 flex items-center"><div className="w-2 h-2 bg-rose-500 rounded-full mr-1"></div> Anomaly</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 pb-6">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-600">Waiting for telemetry...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="index" hide />
              {/* Domain assumes Isolation Forest scores usually range from -1 to 1 */}
              <YAxis domain={[-0.2, 0.2]} stroke="#475569" fontSize={10} tickFormatter={(tick) => tick.toFixed(2)} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px', borderRadius: '8px' }}
                itemStyle={{ color: '#22d3ee' }}
                labelFormatter={() => ''}
                formatter={(value, name, props) => [value, props.payload.id]}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#22d3ee" 
                strokeWidth={2} 
                isAnimationActive={false}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  // If it's an anomaly, render a bright red dot, otherwise hide the dot
                  if (payload.isAnomaly) {
                    return <circle key={payload.id} cx={cx} cy={cy} r={4} fill="#f43f5e" stroke="#fff" strokeWidth={1} />;
                  }
                  return <circle key={payload.id} cx={cx} cy={cy} r={0} />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}