"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  text: string
}

export function SocialButton({ icon, text, className, ...props }: SocialButtonProps) {
  const MotionButton = motion(Button)
  return (
    <MotionButton
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 ${className ?? ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon}
      <span>{text}</span>
    </MotionButton>
  )
}
