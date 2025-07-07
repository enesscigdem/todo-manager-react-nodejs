"use client"
import { ResponsiveBar } from '@nivo/bar'
import { useTasks } from '@/context/tasks-provider'

export function InteractionDashboard() {
  const { state } = useTasks()
  const data = [
    { action: 'Eklendi', value: state.tasks.length },
    { action: 'Tamamlandı', value: state.tasks.filter(t => t.completed).length },
  ]
  return (
    <div className="h-40 w-full">
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="action"
        margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
        colors={{ scheme: 'category10' }}
        axisBottom={{ tickSize: 0 }}
        axisLeft={{ tickSize: 0 }}
      />
    </div>
  )
}
