import type { Meta, StoryObj } from '@storybook/react'
import { TaskCard } from './task-card'

const meta: Meta<typeof TaskCard> = {
  component: TaskCard,
  title: 'TaskCard',
  argTypes: {
    dragHandleListeners: { control: false },
    isDragging: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Görev kartı bileşeni',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof TaskCard>

export const Default: Story = {
  args: {
    id: '1',
    title: 'Örnek Görev',
    description: 'Bu bir örnek açıklamadır',
    priority: 'Medium',
    completed: false,
  },
}
