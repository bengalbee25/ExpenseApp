import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function IncomeExpenseLine({ data }) {
  return (
    <div className="card h-80">
      <h3 className="font-semibold mb-3 text-brand-700">Income & Expense Trend (Line)</h3>
      <ResponsiveContainer width="100%" height="97%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
          dataKey="ym"
          interval={0}                  
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
          padding={{ left: 20, right: 20 }} 
          />
          <YAxis 
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
          />
          <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
            contentStyle={{
              borderRadius: "12px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              border: "none",
              fontSize: "14px",
            }}
            labelStyle={{ color: "#374151", fontWeight: 500 }}
          />
          <Legend
          verticalAlign="top"      
          align="center"
          iconType="line"
          wrapperStyle={{
          fontSize: "13px",
          marginTop: "-10px",          
          color: "#374151",
          }}
          />
          <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
