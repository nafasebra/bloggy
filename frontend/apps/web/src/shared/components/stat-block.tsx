interface StatBlockProps {
  value: number | string;
  label: string;
}

export function StatBlock({ value, label }: StatBlockProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
