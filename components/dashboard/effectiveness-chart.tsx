'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalystData {
  name: string;
  efectividad: number;
  cobrado: number;
  exigible: number;
}

const getColor = (value: number) => {
  if (value >= 90) return '#10b981';
  if (value >= 80) return '#3b82f6';
  return '#f59e0b';
};

export function EffectivenessChart({ data }: { data?: AnalystData[] }) {
  if (!data || data.length === 0) return null;

  const avg = Math.round(data.reduce((s, d) => s + d.efectividad, 0) / data.length);
  const best = data.reduce((a, b) => a.efectividad > b.efectividad ? a : b);
  const worst = data.reduce((a, b) => a.efectividad < b.efectividad ? a : b);

  return (
    <Card className="p-6 bg-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Efectividad por Analista</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tasa de recuperación de cada miembro del equipo</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" label={{ value: 'Efectividad (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }}
          />
          <Bar dataKey="efectividad" fill="#3b82f6" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.efectividad)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Efectividad Promedio</p>
          <p className="text-2xl font-bold text-foreground">{avg}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Mejor Desempeño</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500">{best.efectividad}% ({best.name.split(' ')[0]})</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Por Mejorar</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">{worst.efectividad}% ({worst.name.split(' ')[0]})</p>
        </div>
      </div>
    </Card>
  );
}
