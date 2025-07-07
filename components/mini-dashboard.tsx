"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useTasks } from '@/context/tasks-provider'

export function MiniDashboard() {
  const { state } = useTasks()
  const completed = state.tasks.filter((t) => t.completed).length
  const active = state.tasks.length - completed

  const data = [
    { name: 'Tamamlanan', value: completed },
    { name: 'Aktif', value: active },
  ]

  const COLORS = ['hsl(var(--primary))', '#e5e7eb']

  return (
    <div className="mb-6 w-full h-32" aria-label="Bugün Tamamlanan Görevler">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={30} outerRadius={40} paddingAngle={4}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
