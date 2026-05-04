'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface AnalystData {
  name: string;
  efectividad: number;
  cobrado: number;
  exigible: number;
}

const data: AnalystData[] = [
  { name: 'María López', efectividad: 92, cobrado: 45000, exigible: 50000 },
  { name: 'Carlos Ruiz', efectividad: 87, cobrado: 38000, exigible: 45000 },
  { name: 'Ana González', efectividad: 95, cobrado: 52000, exigible: 55000 },
  { name: 'Juan Pérez', efectividad: 78, cobrado: 28000, exigible: 36000 },
  { name: 'Laura Martín', efectividad: 88, cobrado: 41000, exigible: 48000 },
];

const getColor = (value: number) => {
  if (value >= 90) return '#10b981';
  if (value >= 80) return '#3b82f6';
  return '#f59e0b';
};

export function EffectivenessChart() {
  return (
    <Card className="p-6 bg-white dark:bg-slate-900">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Efectividad por Analista</h3>
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
          <p className="text-2xl font-bold text-gray-900 dark:text-white">88%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Mejor Desempeño</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500">95% (Ana G.)</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Por Mejorar</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">78% (Juan P.)</p>
        </div>
      </div>
    </Card>
  );
}
