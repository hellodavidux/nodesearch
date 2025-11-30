import { AddElementsPanel } from "./add-elements-panel"
import { NodeHandles } from "./node-handles"
import type { SelectedAction } from "@/lib/types"

interface InitialNodeProps {
  data: {
    onSelectAction: (action: SelectedAction) => void
  }
}

export default function InitialNode({ data }: InitialNodeProps) {
  return (
    <NodeHandles showHandles={true}>
      <AddElementsPanel onSelectAction={data.onSelectAction} isEmbedded={true} />
    </NodeHandles>
  )
}
