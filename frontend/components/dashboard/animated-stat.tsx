"use client"

import * as React from "react"

function useAnimatedCounter(end: number, duration: number = 1000) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeProgress = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeProgress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}

export function AnimatedStatValue({ value }: { value: string }) {
  const numValue = parseFloat(value.replace(/[^0-9.]/g, ''))
  const suffix = value.replace(/[0-9.]/g, '')
  const isDecimal = value.includes('.')
  
  const animatedNum = useAnimatedCounter(Math.floor(numValue), 1200)
  
  if (isDecimal) {
    const decimalPart = value.split('.')[1].replace(/[^0-9]/g, '')
    return <>{animatedNum}.{decimalPart}{suffix}</>
  }
  
  return <>{animatedNum}{suffix}</>
}
