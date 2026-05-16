type MetricCardProps = {
  title: string;
  value: string | number;
};

export default function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h3 className="text-gray-400 mb-2">
        {title}
      </h3>

      <p className="text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}
