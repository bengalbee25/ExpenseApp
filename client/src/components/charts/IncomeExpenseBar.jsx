import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function IncomeExpenseBar({ data }) {
  
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.income || 0, d.expense || 0)),
    0
  );

  const maxY = Math.ceil(maxValue / 1000) * 1000;


  return (
    <div className="card h-80">
      <h3 className="font-semibold mb-3 text-brand-700">Income vs Expense (Monthly)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          barGap={6}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="ym"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            domain={[0, maxY]} // 👈 dynamic max value
            allowDecimals={false}
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
            iconType="circle"
            wrapperStyle={{
              fontSize: "13px",
              marginTop: "-10px",
              color: "#374151",
            }}
          />

          <Bar
            dataKey="income"
            name="Income"
            fill="url(#incomeGradient)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill="url(#expenseGradient)"
            radius={[4, 4, 0, 0]}
          />

          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
