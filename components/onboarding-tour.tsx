"use client"
import React from 'react'


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
  React.useEffect(() => {
    if (!localStorage.getItem('tourDone')) {
      // Basit bir tur için her adımın içeriğini alert ile göster
      for (const step of steps) {
        window.alert(step.content)
      }
      localStorage.setItem('tourDone', 'true')
    }
  }, [])

  return null
}
