"use client"

import * as React from "react"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChartContainer({ className, children, ...props }: ChartContainerProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

