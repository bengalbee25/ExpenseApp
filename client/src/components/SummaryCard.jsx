export default function SummaryCard({ title, value }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl md:text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}
