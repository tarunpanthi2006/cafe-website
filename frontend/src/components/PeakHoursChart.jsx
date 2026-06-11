import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PeakHoursChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="bg-white rounded-xl shadow-md p-6 h-80 flex items-center justify-center text-gray-500 border border-gray-100">No data available</div>;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-6">📊 Order Volume by Hour</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
            <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="orders" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
