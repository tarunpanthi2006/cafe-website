import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function KPICard({ title, value, icon, color }) {
  const Icon = LucideIcons[icon] || LucideIcons.Activity;
  
  const colorMap = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={`w-14 h-14 rounded-full flex flex-shrink-0 items-center justify-center ${colorMap[color] || colorMap.amber}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-500 truncate">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
