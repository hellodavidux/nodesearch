"use client"

import type React from "react"
import { memo } from "react"
import { type NodeProps, useReactFlow } from "@xyflow/react"
import { Clock, MoreVertical, Pencil, FileText, Zap, Link, Mic, Play, Box, BookOpen, Code, Wrench, RefreshCw } from "lucide-react"
import SlackIconComponent from "./SlackIcon"
import StackAIIcon from "./StackAIIcon"
import AnthropicIcon from "./AnthropicIcon"
import AirtableIcon from "./AirtableIcon"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Trash2 } from "lucide-react"
import { NodeHandles } from "./node-handles"
import type { WorkflowNodeData } from "@/lib/types"

export function AppIcon({ appName, className }: { appName: string; className?: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    slack: <SlackIconComponent className={className} />,
    stackai: <StackAIIcon className={className} />,
    airtable: <AirtableIcon className={className} />,
    anthropic: <AnthropicIcon className={className} />,
    input: <Pencil className={className} />,
    output: <Pencil className={className} />,
    files: <FileText className={className} />,
    trigger: <Zap className={className} />,
    url: <Link className={className} />,
    audio: <Mic className={className} />,
    action: <Play className={className} />,
    template: <FileText className={className} />,
    "ai agent": <Box className={className} />,
    "knowledge base": <BookOpen className={className} />,
    condition: <Code className={className} />,
    loop: <Code className={className} />,
    switch: <Code className={className} />,
    code: <Code className={className} />,
    delay: <Wrench className={className} />,
    "http request": <Wrench className={className} />,
  }

  const name = appName.toLowerCase()
  return iconMap[name] ?? <div className={`bg-muted rounded ${className}`} />
}

function getNodeIconBg(appName: string): string {
  const name = appName.toLowerCase()

  const colorMap: Record<string, string> = {
    // Apps - amber
    slack: "border-amber-200 bg-amber-50",
    stackai: "border-amber-200 bg-amber-50",
    airtable: "border-amber-200 bg-amber-50",
    anthropic: "border-amber-200 bg-amber-50",
    // Inputs - blue
    input: "border-blue-200 bg-blue-50",
    files: "border-blue-200 bg-blue-50",
    trigger: "border-blue-200 bg-blue-50",
    url: "border-blue-200 bg-blue-50",
    audio: "border-blue-200 bg-blue-50",
    // Outputs - green
    output: "border-green-200 bg-green-50",
    action: "border-green-200 bg-green-50",
    template: "border-green-200 bg-green-50",
    // Core - purple
    "ai agent": "border-purple-200 bg-purple-50",
    "knowledge base": "border-purple-200 bg-purple-50",
    // Logic - orange
    condition: "border-orange-200 bg-orange-50",
    loop: "border-orange-200 bg-orange-50",
    switch: "border-orange-200 bg-orange-50",
    // Utils - gray
    delay: "border-gray-200 bg-gray-50",
    "http request": "border-gray-200 bg-gray-50",
    code: "border-gray-200 bg-gray-50",
  }

  return colorMap[name] ?? "border-amber-200 bg-amber-50"
}

function WorkflowNode({ data, id }: NodeProps) {
  const nodeData = data as WorkflowNodeData
  const {
    appName,
    actionName,
    description,
    version = "v1.0.0",
    onReplaceNode,
    onHandleClick,
    onDeleteNode,
  } = nodeData

  const { getNode, getViewport } = useReactFlow()

  const handleHandleClick = (side: "left" | "right", e: React.MouseEvent) => {
    e.stopPropagation()
    const node = getNode(id as string)
    if (node) {
      const rect = e.currentTarget.getBoundingClientRect()
      // Calculate position next to the node - more to the left and higher
      const position = {
        x: side === "right" ? rect.right + 50 : rect.left - 10, // Position panel more to the left
        y: rect.top - 100, // Position higher (reduced from -56)
      }
      
      // Store the source node ID and side for when an action is selected
      ;(window as any).__handleClickSourceNode = { nodeId: id, side }
      
      // Open node selector at this position
      if ((window as any).__openNodeSelector) {
        ;(window as any).__openNodeSelector(position, "handle")
      } else if (onHandleClick) {
        // Fallback to original behavior
        onHandleClick(side, position)
      }
    }
  }

  const handleReplaceNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    const node = getNode(id as string)
    if (node) {
      // Calculate screen position from flow position
      const viewport = getViewport()
      const nodeHeight = 60 // Reduced node height for positioning
      const screenX = (node.position.x * viewport.zoom) + viewport.x + 48 // Add sidebar width
      const screenY = (node.position.y * viewport.zoom) + viewport.y + 56 + nodeHeight + 8 // Add top bar, reduced node height, and smaller gap
      
      const position = {
        x: screenX,
        y: screenY,
      }
      
      // Store that we're replacing this node
      ;(window as any).__replaceNodeId = id
      
      // Open node selector at this position
      if ((window as any).__openNodeSelector) {
        ;(window as any).__openNodeSelector(position, "replace")
      }
    }
  }

  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteNode?.(id)
  }

  const iconBg = getNodeIconBg(appName)

  return (
    <NodeHandles onLeftClick={(e) => handleHandleClick("left", e)} onRightClick={(e) => handleHandleClick("right", e)}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {/* Main card */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 w-[380px]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <AppIcon appName={appName} className="w-4 h-4" />
              </div>
              <span className="text-base font-semibold text-foreground flex-1">{actionName}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-md hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleReplaceNode}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Replace
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteNode}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{description}</p>

            {/* Metadata badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/30 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>0.00 sec</span>
              </div>
              <div className="px-2.5 py-1 rounded-full border border-border bg-muted/30 text-xs text-muted-foreground">
                {version}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleReplaceNode}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Replace
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDeleteNode} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </NodeHandles>
  )
}

export default memo(WorkflowNode)
