import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

export default function ExpensePie({ data }) {
  const colors = [
    '#10b981', '#ef4444', '#3b82f6', '#f59e0b',
    '#8b5cf6', '#14b8a6', '#ec4899', '#6366f1',
    '#84cc16', '#f97316'
  ];

  if (!data || data.length === 0) {
    return (
      <div className="card h-80 flex items-center justify-center text-gray-500">
        No expense data available
      </div>
    );
  }

  return (
    <div className="card h-80">
      <h3 className="font-semibold mb-3 text-brand-700">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              border: 'none',
              fontSize: '14px',
            }}
          />

          {/* Compact legend inside the chart box */}
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            iconType="circle"
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '13px',
              color: '#374151',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
