"use client"

import type React from "react"

import type { DragEvent } from "react"

type DraggableItemProps = {
  children: React.ReactNode
  data: {
    appName: string
    actionName: string
    description: string
    type: "trigger" | "action"
  }
  className?: string
  onClick?: () => void
}

export function DraggableItem({ children, data, className, onClick }: DraggableItemProps) {
  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(data))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div draggable onDragStart={onDragStart} onClick={onClick} className={className}>
      {children}
    </div>
  )
}
