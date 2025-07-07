"use client"
import React from 'react'
import Joyride from 'react-joyride'

const steps = [
  {
    target: '[data-tour="add"]',
    content: 'Yeni görev eklemek için buraya tıklayın',
  },
  {
    target: '[data-tour="filter"]',
    content: 'Görevlerinizi filtreleyebilirsiniz',
  },
  {
    target: '[data-tour="theme"]',
    content: 'Buradan temayı değiştirebilirsiniz',
  },
]

export function OnboardingTour() {
  const [run, setRun] = React.useState(false)
  React.useEffect(() => {
    if (!localStorage.getItem('tourDone')) {
      setRun(true)
    }
  }, [])
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      callback={(data) => {
        if (data.status === 'finished' || data.status === 'skipped') {
          localStorage.setItem('tourDone', 'true')
        }
      }}
    />
  )
}
