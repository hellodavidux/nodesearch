"use client"

import { AddElementsPanel } from "./add-elements-panel"
import { NodeHandles } from "./node-handles"
import type { SelectedAction } from "@/lib/types"

interface SelectorNodeProps {
  data: {
    onSelectAction: (action: SelectedAction) => void
    onCancel: () => void
    sourceNodeId: string | null
    side: "left" | "right"
  }
}

export default function SelectorNode({ data }: SelectorNodeProps) {
  return (
    <div className="nowheel nodrag">
      <NodeHandles showHandles={true}>
        <AddElementsPanel onSelectAction={data.onSelectAction} onClose={data.onCancel} isEmbedded={true} />
      </NodeHandles>
    </div>
  )
}
