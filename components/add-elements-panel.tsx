"use client"

import type React from "react"
import { Star } from "lucide-react"

import { useState, useEffect, type DragEvent } from "react"
import {
  Blocks,
  Code,
  Wrench,
  ChevronDown,
  Search,
  X,
  Zap,
  Play,
  Pencil,
  FileText,
  Link,
  Mic,
  Box,
  BookOpen,
  ArrowDownUp,
  Bot,
  GitBranch,
  Repeat,
  StickyNote,
  MessageSquare,
  Clock,
  Share2,
  Database,
  Table,
  Webhook,
  GripVertical,
  Pin,
  PinOff,
} from "lucide-react"
import SlackIconComponent from "./SlackIcon"
import StackAIIcon from "./StackAIIcon"
import AnthropicIcon from "./AnthropicIcon"
import AirtableIcon from "./AirtableIcon"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { SelectedAction, AppDetail, Category } from "@/lib/types"

// =============================================================================
// DATA: App details with triggers and actions
// =============================================================================

const appDetails: Record<string, AppDetail> = {
  Slack: {
    tags: ["slack"],
    triggers: [
      { name: "On App Mention", description: "Triggered when your app is mentioned in a channel" },
      { name: "On New Message", description: "Triggered when a new message is posted" },
      { name: "On Channel Created", description: "Triggered when a new channel is created" },
      { name: "On Reaction Added", description: "Triggered when a reaction is added to a message" },
    ],
    actionGroups: [
      {
        name: "Channels",
        items: [
          { name: "Create Channel", description: "Create a new public or private Slack channel" },
          { name: "Archive Channel", description: "Archive an existing Slack channel" },
          { name: "Get Channel Info", description: "Get detailed information about a channel" },
          { name: "List Channels", description: "List all channels in the workspace" },
          { name: "Invite to Channel", description: "Invite a user to a channel" },
          { name: "Set Channel Topic", description: "Set the topic for a channel" },
        ],
      },
      {
        name: "Messages",
        items: [
          { name: "Send Message", description: "Send a message to a channel or user" },
          { name: "Update Message", description: "Update an existing message" },
          { name: "Delete Message", description: "Delete a message from a channel" },
          { name: "Schedule Message", description: "Schedule a message to be sent later" },
          { name: "Get Permalink", description: "Get a permanent link to a message" },
          { name: "Add Reaction", description: "Add an emoji reaction to a message" },
        ],
      },
      {
        name: "Files",
        items: [
          { name: "Upload File", description: "Upload a file to Slack" },
          { name: "Download Slack File", description: "Download a file from Slack" },
          { name: "Delete Slack File", description: "Delete a file from Slack" },
          { name: "Get Slack File Info", description: "Get information about a file" },
          { name: "List Files", description: "List all files in the workspace" },
        ],
      },
      {
        name: "Users",
        items: [
          { name: "Get User Info", description: "Get information about a user" },
          { name: "List Users", description: "List all users in the workspace" },
          { name: "Get User Presence", description: "Get a user's current presence status" },
          { name: "Set User Status", description: "Set the status for the authenticated user" },
          { name: "Lookup by Email", description: "Find a user by their email address" },
        ],
      },
    ],
  },
  StackAI: {
    tags: ["stackai"],
    triggers: [
      { name: "On Task Completion", description: "Triggered when a task is completed" },
      { name: "On Error", description: "Triggered when an error occurs" },
    ],
    actionGroups: [
      {
        name: "Code Tools",
        items: [{ name: "Analysis Tool", description: "A tool to analyze data, create charts and visualizations" }],
      },
      {
        name: "Document Tools",
        items: [
          { name: "Split Files", description: "Split text content from files into smaller chunks" },
          { name: "Create Spreadsheet File", description: "Create a CSV or Excel file from JSON structured data" },
          { name: "Create Slides", description: "A tool to create HTML slides from a presentation outline" },
          { name: "Document Q&A", description: "Answer questions about documents using AI" },
          {
            name: "Extract JSON Data with JMESPath",
            description: "Extract data from JSON objects using JMESPath queries",
          },
          { name: "Convert Markdown to File", description: "Convert markdown content to PDF, DOCX or other formats" },
          { name: "Page Split", description: "A tool to split a file into multiple file references" },
          { name: "Parse Files", description: "A tool to parse a file into multiple citations" },
        ],
      },
      {
        name: "Email Tools",
        items: [{ name: "Send Email", description: "Send an email using StackAI's email service" }],
      },
      {
        name: "Web Search Tools",
        items: [{ name: "Web Search", description: "Search the web for information with optional filters" }],
      },
      {
        name: "Computer Tools",
        items: [
          { name: "Browser Navigation", description: "Execute browser navigation commands" },
          { name: "Code Execution", description: "Execute code in Python, JavaScript, R, and more" },
          { name: "File Navigation", description: "Navigate and extract content from PDF and other files" },
          { name: "Terminal", description: "Execute a terminal command in the computer environment" },
        ],
      },
      {
        name: "AI Tasks",
        items: [
          { name: "Run Task", description: "Run an AI task" },
          { name: "Cancel Task", description: "Cancel an AI task" },
        ],
      },
    ],
  },
  Airtable: {
    tags: ["airtable"],
    triggers: [
      { name: "On Record Created", description: "Triggered when a new record is created" },
      { name: "On Record Updated", description: "Triggered when a record is updated" },
      { name: "On Record Deleted", description: "Triggered when a record is deleted" },
    ],
    actionGroups: [
      {
        name: "Records",
        items: [
          { name: "Create Record", description: "Create a new record in a table" },
          { name: "Update Record", description: "Update an existing record" },
          { name: "Delete Record", description: "Delete a record from a table" },
          { name: "Get Record", description: "Get a single record by ID" },
          { name: "List Records", description: "List all records in a table" },
          { name: "Search Records", description: "Search for records matching criteria" },
        ],
      },
      {
        name: "Tables",
        items: [
          { name: "Create Table", description: "Create a new table in a base" },
          { name: "Get Table Schema", description: "Get the schema of a table" },
          { name: "List Tables", description: "List all tables in a base" },
        ],
      },
      {
        name: "Bases",
        items: [
          { name: "List Bases", description: "List all accessible bases" },
          { name: "Get Base Schema", description: "Get the schema of a base" },
        ],
      },
    ],
  },
  Anthropic: {
    tags: ["anthropic"],
    triggers: [{ name: "On Response Complete", description: "Triggered when a model response is complete" }],
    actionGroups: [
      {
        name: "Messages",
        items: [
          { name: "Create Message", description: "Send a message to Claude and get a response" },
          { name: "Create Streaming Message", description: "Stream a message response from Claude" },
        ],
      },
      {
        name: "Models",
        items: [
          { name: "List Models", description: "List available Claude models" },
          { name: "Get Model Info", description: "Get information about a specific model" },
        ],
      },
      {
        name: "Embeddings",
        items: [
          { name: "Create Embedding", description: "Generate embeddings for text" },
          { name: "Batch Embeddings", description: "Generate embeddings for multiple texts" },
        ],
      },
    ],
  },
  "Google Drive": {
    tags: ["googledrive"],
    triggers: [
      { name: "On File Created", description: "Triggered when a new file is created" },
      { name: "On File Updated", description: "Triggered when a file is updated" },
    ],
    actionGroups: [
      {
        name: "Files",
        items: [
          { name: "Upload File", description: "Upload a file to Google Drive" },
          { name: "Download File", description: "Download a file from Google Drive" },
          { name: "List Files", description: "List files in Google Drive" },
        ],
      },
    ],
  },
  Gmail: {
    tags: ["gmail"],
    triggers: [
      { name: "On Email Received", description: "Triggered when a new email is received" },
      { name: "On Email Sent", description: "Triggered when an email is sent" },
    ],
    actionGroups: [
      {
        name: "Messages",
        items: [
          { name: "Send Email", description: "Send an email via Gmail" },
          { name: "Get Email", description: "Get a specific email by ID" },
          { name: "List Emails", description: "List emails from inbox" },
        ],
      },
    ],
  },
  Sheets: {
    tags: ["sheets"],
    triggers: [
      { name: "On Sheet Updated", description: "Triggered when a sheet is updated" },
    ],
    actionGroups: [
      {
        name: "Spreadsheets",
        items: [
          { name: "Read Range", description: "Read data from a range" },
          { name: "Write Range", description: "Write data to a range" },
          { name: "Create Sheet", description: "Create a new spreadsheet" },
        ],
      },
    ],
  },
  Outlook: {
    tags: ["outlook"],
    triggers: [
      { name: "On Email Received", description: "Triggered when a new email is received" },
    ],
    actionGroups: [
      {
        name: "Messages",
        items: [
          { name: "Send Email", description: "Send an email via Outlook" },
          { name: "Get Email", description: "Get a specific email" },
        ],
      },
    ],
  },
  Excel: {
    tags: ["excel"],
    triggers: [
      { name: "On Workbook Updated", description: "Triggered when a workbook is updated" },
    ],
    actionGroups: [
      {
        name: "Workbooks",
        items: [
          { name: "Read Range", description: "Read data from a range" },
          { name: "Write Range", description: "Write data to a range" },
        ],
      },
    ],
  },
  Calendar: {
    tags: ["calendar"],
    triggers: [
      { name: "On Event Created", description: "Triggered when a new calendar event is created" },
      { name: "On Event Updated", description: "Triggered when an event is updated" },
    ],
    actionGroups: [
      {
        name: "Events",
        items: [
          { name: "Create Event", description: "Create a new calendar event" },
          { name: "List Events", description: "List calendar events" },
        ],
      },
    ],
  },
  SharePoint: {
    tags: ["sharepoint"],
    triggers: [
      { name: "On File Created", description: "Triggered when a file is created" },
    ],
    actionGroups: [
      {
        name: "Files",
        items: [
          { name: "Upload File", description: "Upload a file to SharePoint" },
          { name: "Download File", description: "Download a file from SharePoint" },
        ],
      },
    ],
  },
}

const nodeDescriptions: Record<string, string> = {
  // Inputs
  Input: "Accept text or data input from users",
  Files: "Upload and process files in your workflow",
  Trigger: "Start workflow based on external events",
  URL: "Fetch data from a URL endpoint",
  Audio: "Record or process audio input",
  // Outputs
  Output: "Display results to the user",
  Action: "Perform an action based on workflow results",
  Template: "Generate formatted output from templates",
  // Core Nodes
  "AI Agent": "Intelligent agent that can reason and act",
  "Knowledge Base": "Store and retrieve knowledge for AI",
  // Logic
  Condition: "Branch workflow based on conditions",
  Loop: "Repeat actions multiple times",
  Switch: "Route workflow based on multiple conditions",
  Python: "Execute Python code",
  "If/Else": "Conditional branching based on conditions",
  "AI Routing": "Route workflow based on AI decisions",
  "Loop Subflow": "Repeat a subflow multiple times",
  // Utils
  Delay: "Wait for a specified duration",
  "StackAI Project": "Manage StackAI projects",
  "StackAI Project (Beta)": "Manage StackAI projects in beta",
  "Sticky Note": "Create a sticky note",
  "Default Message": "Send a default message",
  "Shared Memory": "Use shared memory for data storage",
  "Dynamic Vector Store": "Manage dynamic vector stores",
  "Text-to-SQL": "Convert text to SQL queries",
  "Search Tables": "Search tables for data",
  "Search Data": "Search data for specific information",
  // Apps without details
  Airtable: "Connect to Airtable databases",
  Anthropic: "Use Anthropic Claude AI models",
}

// =============================================================================
// DATA: Categories and their items
// =============================================================================

const categories: Category[] = [
  {
    name: "Inputs & Outputs",
    icon: ArrowDownUp,
    items: [], // Items handled separately in two-column layout
  },
  {
    name: "Triggers",
    icon: Zap,
    items: [], // Items handled separately in two-column layout
  },
  {
    name: "Core Nodes",
    icon: StackAIIcon,
    items: [
      { name: "StackAI", icon: "stackai" }, // Changed from "box" to "bot"
    ],
  },
  {
    name: "Apps",
    icon: Blocks,
    items: [
      { name: "Slack", icon: "slack" },
      { name: "Google Drive", icon: "box" },
      { name: "Gmail", icon: "box" },
      { name: "Sheets", icon: "box" },
      { name: "Outlook", icon: "box" },
      { name: "Excel", icon: "box" },
      { name: "Calendar", icon: "clock" },
      { name: "SharePoint", icon: "box" },
      { name: "Airtable", icon: "airtable" },
      { name: "Anthropic", icon: "anthropic" },
    ],
  },
  {
    name: "Logic",
    icon: Code,
    items: [
      { name: "Python", icon: "python" },
      { name: "If/Else", icon: "branch" },
      { name: "AI Routing", icon: "branch" },
      { name: "Loop Subflow", icon: "repeat" },
    ],
  },
  {
    name: "Utils",
    icon: Wrench,
    items: [
      { name: "AI Agent", icon: "bot" },
      { name: "Knowledge Base", icon: "book" },
      { name: "StackAI Project", icon: "stackai" },
      { name: "StackAI Project (Beta)", icon: "stackai" },
      { name: "Sticky Note", icon: "sticky" },
      { name: "Default Message", icon: "message" },
      { name: "Delay", icon: "clock" },
      { name: "Shared Memory", icon: "share" },
      { name: "Dynamic Vector Store", icon: "database" },
      { name: "Text-to-SQL", icon: "code" },
      { name: "Search Tables", icon: "table" },
      { name: "Search Data", icon: "code" },
    ],
  },
]

const inputItems = [
  { name: "Input", icon: "pencil" },
  { name: "Files", icon: "file" },
  { name: "Trigger", icon: "zap" },
  { name: "URL", icon: "link" },
  { name: "Audio", icon: "mic" },
]

const outputItems = [
  { name: "Output", icon: "pencil" },
  { name: "Action", icon: "play" },
  { name: "Audio", icon: "mic" },
  { name: "Template", icon: "template" },
]

const builtInTriggers = [
  { name: "Scheduled Execution", icon: "clock" },
  { name: "Webhook", icon: "webhook" },
  { name: "User Text", icon: "pencil" },
  { name: "Files", icon: "file" },
  { name: "Audio", icon: "mic" },
  { name: "URL", icon: "link" },
]

const appTriggers = [
  { name: "Slack", icon: "slack" },
  { name: "Google Drive", icon: "box" },
  { name: "Gmail", icon: "box" },
  { name: "Sheets", icon: "box" },
  { name: "Outlook", icon: "box" },
  { name: "Excel", icon: "box" },
  { name: "Calendar", icon: "clock" },
  { name: "SharePoint", icon: "box" },
  { name: "Airtable", icon: "airtable" },
  { name: "Anthropic", icon: "anthropic" },
]

// Sidebar tab configuration with descriptions for tooltips
const categoryTabs = [
  { name: "Triggers", key: "Triggers", icon: Zap },
  { name: "Actions & Outputs", key: "Core Nodes", icon: StackAIIcon },
  { name: "Apps", key: "Apps", icon: Blocks },
  { name: "Logic", key: "Logic", icon: Code },
  { name: "Utils", key: "Utils", icon: Wrench },
]

const popularApps = [
  { name: "Slack", icon: "slack" },
  { name: "Google Drive", icon: "box" },
  { name: "Gmail", icon: "box" },
  { name: "Sheets", icon: "box" },
  { name: "Outlook", icon: "box" },
  { name: "Excel", icon: "box" },
  { name: "Calendar", icon: "clock" },
  { name: "SharePoint", icon: "box" },
]

const popularTools = [
  { name: "AI Agent", icon: "bot", category: "Core Nodes" },
  { name: "Knowledge Base", icon: "book", category: "Core Nodes" },
  { name: "Python", icon: "python", category: "Logic" },
  { name: "If/Else", icon: "branch", category: "Logic" },
  { name: "Delay", icon: "clock", category: "Utils" },
  { name: "Text-to-SQL", icon: "code", category: "Utils" },
  { name: "Output", icon: "pencil", category: "Outputs" },
  { name: "User Text", icon: "pencil", category: "Triggers" },
]

// =============================================================================
// DATA: Category descriptions for detailed tooltips
// =============================================================================

const categoryDescriptions: Record<string, string> = {
  Home: "Quick access to popular apps and tools",
  Triggers: "Start workflows with events and actions",
  "Core Nodes": "Essential AI and processing nodes",
  Apps: "Connect to external services",
  Logic: "Control flow and conditions",
  Utils: "Helper tools and utilities",
}

const tabTooltips: Record<string, string> = {
  Popular: "Quick access to popular apps and tools",
  Triggers: "Start your workflow",
  Logic: "Control flow and decisions",
  Utils: "Utility functions",
  Apps: "Third-party integrations",
  "Core Nodes": "Essential building blocks",
}

// =============================================================================
// HELPER: Icon component based on type
// =============================================================================

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  pencil: Pencil,
  file: FileText,
  zap: Zap,
  link: Link,
  mic: Mic,
  play: Play,
  template: FileText,
  box: Box,
  book: BookOpen,
  code: Code,
  wrench: Wrench,
  slack: SlackIconComponent,
  stackai: StackAIIcon,
  airtable: AirtableIcon,
  anthropic: AnthropicIcon,
  bot: Bot, // Added Bot icon mapping for AI Agent
  gitbranch: GitBranch,
  repeat: Repeat,
  sticky: StickyNote,
  message: MessageSquare,
  clock: Clock,
  share: Share2,
  database: Database,
  table: Table,
  python: Code,
  branch: GitBranch,
  webhook: Webhook,
}

function ItemIcon({ type, muted = false }: { type: string; muted?: boolean }) {
  const Icon = iconMap[type] || Box
  return <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${muted ? "text-muted-foreground" : "text-foreground"}`} />
}

// =============================================================================
// HELPER: Draggable item wrapper
// =============================================================================

function DraggableItem({
  data,
  onClick,
  className,
  children,
}: {
  data: SelectedAction
  onClick?: () => void
  className?: string
  children: React.ReactNode
}) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(data))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleClick = (e: React.MouseEvent) => {
    // Only call onClick if it's provided (for non-sidebar sources)
    if (onClick) {
      onClick()
    }
  }

  return (
    <div draggable onDragStart={handleDragStart} onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

type AddElementsPanelProps = {
  onSelectAction?: (action: SelectedAction) => void
  isEmbedded?: boolean
  onClose?: () => void
  source?: "sidebar" | "handle" | "replace" // Source of the panel opening
  isPinned?: boolean
  onPinToggle?: (pinned: boolean) => void
  initialTab?: string // Initial active tab when opening
}

export function AddElementsPanel({ onSelectAction, source = "handle", isPinned = false, onPinToggle, initialTab }: AddElementsPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab || "Popular")
  
  // Update activeTab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedApp, setExpandedApp] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [triggersExpanded, setTriggersExpanded] = useState(true)
  const [actionsExpanded, setActionsExpanded] = useState(true)
  const [tabKey, setTabKey] = useState(0)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const getTabIndex = () => {
    if (activeTab === "Popular") return 0
    const tabIndex = categoryTabs.findIndex((tab) => tab.key === activeTab)
    return tabIndex + 1 // +1 because Popular is index 0
  }

  const handleItemClick = (categoryName: string, item: any) => {
    // For sidebar source, don't navigate to sublevels - items are draggable only
    if (source === "sidebar") {
      return
    }

    const uniqueKey = `${categoryName}-${item.name}`
    const details = appDetails[item.name]

    if (details) {
      setSelectedApp(item.name)
      return
    }

    const description = nodeDescriptions[item.name] || `${item.name} node`
    setSelectedAction(item.name)
    onSelectAction?.({
      appName: item.name,
      actionName: item.name,
      description,
      type: "action",
    })
  }

  const handleTriggerClick = (appName: string, trigger: any) => {
    const description = trigger.description || `${trigger.name} trigger`
    setSelectedAction(trigger.name)
    onSelectAction?.({
      appName: appName,
      actionName: trigger.name,
      description: description,
      type: "trigger",
    })
  }

  const handleActionClick = (appName: string, action: any) => {
    const description = action.description || `${action.name} action`
    setSelectedAction(action.name)
    onSelectAction?.({
      appName: appName,
      actionName: action.name,
      description,
      type: "action",
    })
  }

  const toggleGroup = (groupName: string) => {
    if (expandedGroups.includes(groupName)) {
      setExpandedGroups(expandedGroups.filter((group) => group !== groupName))
    } else {
      setExpandedGroups([...expandedGroups, groupName])
    }
  }

  const handlePopularAppClick = (appName: string) => {
    // For sidebar source, don't navigate to sublevels - apps are draggable only
    if (source === "sidebar") {
      return
    }
    setSelectedApp(appName)
  }

  const handlePopularToolClick = (tool: { name: string; icon: string; category: string }) => {
    const description = nodeDescriptions[tool.name] || `${tool.name} node`
    setSelectedAction(tool.name)
    onSelectAction?.({
      appName: tool.name,
      actionName: tool.name,
      description,
      type: "action",
    })
  }

  const handleClose = () => {
    setSelectedApp(null)
  }

  const renderHomeView = () => (
    <div className="p-3 py-0">
      <div className={`grid ${source === "sidebar" ? "grid-cols-1" : "grid-cols-2"} gap-0.5`}>
        {/* Popular Tools Column */}
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-light">Popular tools</h4>
          <div className="space-y-0.5">
            {popularTools.map((tool) => {
              const actionData: SelectedAction = {
                appName: tool.name,
                actionName: tool.name,
                description: nodeDescriptions[tool.name] || `${tool.name} node`,
                type: "action",
              }
              
              if (source === "sidebar") {
                return (
                  <DraggableItem
                    key={tool.name}
                    data={actionData}
                    className="group/item"
                  >
                    <div className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <ItemIcon type={tool.icon} muted />
                        <span className="text-foreground truncate font-medium">{tool.name}</span>
              </div>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none" />
          </div>
                  </DraggableItem>
                )
              }
              
              return (
              <div
                key={tool.name}
                onClick={() => handlePopularToolClick(tool)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <ItemIcon type={tool.icon} muted />
                <span className="text-foreground truncate font-medium">{tool.name}</span>
              </div>
              )
            })}
          </div>
        </div>

        {/* Popular Apps Column */}
        <div className={source === "sidebar" ? "mt-4" : ""}>
          <h4 className="text-muted-foreground mb-2 text-sm font-light">Popular apps</h4>
          <div className="space-y-0.5">
            {popularApps.map((app) => {
              const details = appDetails[app.name]
              const actionData: SelectedAction = {
                appName: app.name,
                actionName: app.name,
                description: `${app.name} app`,
                type: "action",
              }
              
              if (source === "sidebar") {
                return (
                  <DraggableItem
                    key={app.name}
                    data={actionData}
                    className="group/item"
                  >
                    <div className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <ItemIcon type={app.icon} muted />
                        <span className="text-foreground truncate font-medium">{app.name}</span>
      </div>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none" />
    </div>
                  </DraggableItem>
                )
              }
              
              return (
                <div
                  key={app.name}
                  className="group/item"
                  onMouseEnter={(e) => e.stopPropagation()}
                >
                  <div
                    onClick={() => handlePopularAppClick(app.name)}
                    className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ItemIcon type={app.icon} muted />
                      <span className="text-foreground truncate font-medium">{app.name}</span>
                    </div>
                    {details && (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  const renderCoreView = () => {
    const coreTools = [
      // Code Tools
      { name: "Analysis Tool", icon: "code", category: "Code Tools" },
      // Document Tools
      { name: "Split Files", icon: "file", category: "Document Tools" },
      { name: "Create Spreadsheet File", icon: "file", category: "Document Tools" },
      { name: "Create Slides", icon: "file", category: "Document Tools" },
      { name: "Document Q&A", icon: "book", category: "Document Tools" },
      { name: "Extract JSON Data with JMESPath", icon: "code", category: "Document Tools" },
      { name: "Convert Markdown to File", icon: "file", category: "Document Tools" },
      { name: "Page Split", icon: "file", category: "Document Tools" },
      { name: "Parse Files", icon: "file", category: "Document Tools" },
      { name: "PDF to Image", icon: "file", category: "Document Tools" },
      { name: "Summarize Documents", icon: "book", category: "Document Tools" },
      { name: "Transcribe Documents", icon: "file", category: "Document Tools" },
      { name: "Translate Documents", icon: "file", category: "Document Tools" },
      // Time Tools
      { name: "Current Time", icon: "clock", category: "Time Tools" },
      { name: "Weekday Calculator", icon: "clock", category: "Time Tools" },
      // Web Tools
      { name: "Deep Research", icon: "link", category: "Web Tools" },
      { name: "Get Website as Markdown", icon: "link", category: "Web Tools" },
      { name: "Job Search", icon: "link", category: "Web Tools" },
      { name: "News Search", icon: "link", category: "Web Tools" },
      { name: "Send HTTP Request", icon: "link", category: "Web Tools" },
      // Knowledge Base Tools
      { name: "List Knowledge Base Contents", icon: "database", category: "Knowledge Base Tools" },
      { name: "List Knowledge Bases", icon: "database", category: "Knowledge Base Tools" },
      { name: "Read Knowledge Base File", icon: "database", category: "Knowledge Base Tools" },
      { name: "Search Knowledge Base", icon: "database", category: "Knowledge Base Tools" },
      // Documents Tools
      { name: "Fill PDF Form", icon: "file", category: "Documents Tools" },
      // Workflow Tools
      { name: "Generate StackAI Workflow", icon: "stackai", category: "Workflow Tools" },
      { name: "Get StackAI Action", icon: "stackai", category: "Workflow Tools" },
      { name: "List StackAI Actions", icon: "stackai", category: "Workflow Tools" },
      { name: "List StackAI Triggers", icon: "stackai", category: "Workflow Tools" },
      { name: "Execute StackAI Project", icon: "stackai", category: "Workflow Tools" },
      // Files Tools
      { name: "Download Private File", icon: "file", category: "Files Tools" },
      // Image Tools
      { name: "Convert HTML to Image", icon: "file", category: "Image Tools" },
      { name: "Image-to-Image Transform", icon: "file", category: "Image Tools" },
      { name: "Image to Text", icon: "file", category: "Image Tools" },
      { name: "Text to Image", icon: "file", category: "Image Tools" },
      // Email Tools
      { name: "Send Email", icon: "message", category: "Email Tools" },
      // Web Search Tools
      { name: "Web Search", icon: "link", category: "Web Search Tools" },
      // Computer Tools
      { name: "Browser Navigation", icon: "code", category: "Computer Tools" },
      { name: "Code Execution", icon: "code", category: "Computer Tools" },
      { name: "File Navigation", icon: "file", category: "Computer Tools" },
      { name: "Terminal", icon: "code", category: "Computer Tools" },
    ]

    const groupedTools = coreTools.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    }, {} as Record<string, typeof coreTools>)

    return (
    <div className="p-3 py-0">
        <div className="space-y-3">
          {/* Output and Template at the top */}
          <div>
            <div className="px-3 py-1 text-sm font-light text-muted-foreground mb-1">
              <span>Outputs</span>
            </div>
            <div className="space-y-0.5 px-2">
              {source === "sidebar" ? (
                <>
                  <DraggableItem
                    data={{
                      appName: "Output",
                      actionName: "Output",
                      description: "Output node",
                      type: "action",
                    }}
                    className="group/item"
                  >
                    <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-md text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <div className="flex-shrink-0">
                          <ItemIcon type="pencil" />
                        </div>
                        <span className="text-foreground truncate font-medium min-w-0">Output</span>
                      </div>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none ml-1" />
                    </div>
                  </DraggableItem>
                  <DraggableItem
                    data={{
                      appName: "Template",
                      actionName: "Template",
                      description: "Template node",
                      type: "action",
                    }}
                    className="group/item"
                  >
                    <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-md text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <div className="flex-shrink-0">
                          <ItemIcon type="template" />
                        </div>
                        <span className="text-foreground truncate font-medium min-w-0">Template</span>
                      </div>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none ml-1" />
                    </div>
                  </DraggableItem>
                </>
              ) : (
                <>
                  <div
                    onClick={() => handleItemClick("Core Nodes", { name: "Output", icon: "pencil" })}
          className="flex items-center gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
        >
                    <ItemIcon type="pencil" />
                    <span className="text-foreground truncate font-medium">Output</span>
        </div>
        <div
                    onClick={() => handleItemClick("Core Nodes", { name: "Template", icon: "template" })}
          className="flex items-center gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
        >
                    <ItemIcon type="template" />
                    <span className="text-foreground truncate font-medium">Template</span>
        </div>
                </>
              )}
      </div>
    </div>
          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category}>
              <div className="px-3 py-1 text-sm font-light text-muted-foreground mb-1">
                <span>{category}</span>
              </div>
              <div className="space-y-0.5 px-2">
                {tools.map((tool) => {
                  const actionData: SelectedAction = {
                    appName: tool.name,
                    actionName: tool.name,
                    description: nodeDescriptions[tool.name] || `${tool.name} node`,
                    type: "action",
                  }
                  
                  if (source === "sidebar") {
                    return (
                      <DraggableItem
                        key={tool.name}
                        data={actionData}
                        className="group/item"
                      >
                        <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-md text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                            <div className="flex-shrink-0">
                              <ItemIcon type={tool.icon} />
                            </div>
                            <span className="text-foreground truncate font-medium min-w-0">{tool.name}</span>
                          </div>
                          <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none ml-1" />
                        </div>
                      </DraggableItem>
                    )
                  }
                  
                  return (
                    <div
                      key={tool.name}
                      onClick={() => handleItemClick("Core Nodes", tool)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
              >
                      <ItemIcon type={tool.icon} />
                      <span className="text-foreground truncate font-medium">{tool.name}</span>
                    </div>
                  )
                })}
              </div>
              </div>
            ))}
          </div>
        </div>
    )
  }

  const renderTriggersView = () => (
    <div className="p-3 py-0">
      <div className={`grid ${source === "sidebar" ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
        {/* Built-in Triggers Column */}
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-light">Built-in Triggers</h4>
          <div className="space-y-0.5 px-0">
            {builtInTriggers.map((item) => {
              const actionData: SelectedAction = {
                appName: item.name,
                actionName: item.name,
                description: nodeDescriptions[item.name] || `${item.name} trigger`,
                type: "trigger",
              }
              
              if (source === "sidebar") {
                return (
                  <DraggableItem
                    key={item.name}
                    data={actionData}
                    className="group/item"
                  >
                    <div className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <ItemIcon type={item.icon} />
                        <span className="text-foreground truncate font-medium">{item.name}</span>
                      </div>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none" />
                    </div>
                  </DraggableItem>
                )
              }
              
              return (
              <div
                key={item.name}
                onClick={() => handleItemClick("Triggers", item)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <ItemIcon type={item.icon} />
                <span className="text-foreground truncate font-medium">{item.name}</span>
              </div>
              )
            })}
          </div>
        </div>

        {/* App Triggers Column */}
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-light">App Triggers</h4>
          <div className="space-y-0.5 px-0">
            {appTriggers.map((app) => {
              const details = appDetails[app.name]
              const actionData: SelectedAction = {
                appName: app.name,
                actionName: app.name,
                description: `${app.name} app`,
                type: "action",
              }
              
              if (source === "sidebar") {
                return (
                  <DraggableItem
                    key={app.name}
                    data={actionData}
                    className="group/item"
                  >
                    <div className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <ItemIcon type={app.icon} muted />
                        <span className="text-foreground truncate font-medium">{app.name}</span>
      </div>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none" />
    </div>
                  </DraggableItem>
                )
              }
              
              return (
                <div
                  key={app.name}
                  className="group/item"
                  onMouseEnter={(e) => e.stopPropagation()}
                >
                  <div
                    onClick={() => handlePopularAppClick(app.name)}
                    className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ItemIcon type={app.icon} muted />
                      <span className="text-foreground truncate font-medium">{app.name}</span>
                    </div>
                    {details && (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppDetailView = (appName: string) => {
    const details = appDetails[appName]
    if (!details) return null

    return (
      <div className="animate-in fade-in duration-300">
        {/* Back button and app header */}
        <div className="px-3 border-border/50 bg-background sticky top-0 z-40 py-0 border-b-0">
          <button
            onClick={() => setSelectedApp(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-0.5 pb-2"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Triggers Section */}
        {details.triggers.length > 0 && (
          <div className="mt-1">
            <div className="px-3 py-1 flex items-center gap-2 text-sm font-light text-muted-foreground lowercase">
              <Zap className="w-3.5 h-3.5" />
              <span>Triggers</span>
            </div>
            <div className="space-y-0.5 px-2 pl-6">
              {details.triggers.map((trigger) => (
                <DraggableItem
                  key={trigger.name}
                  data={{
                    appName: appName,
                    actionName: trigger.name,
                    description: trigger.description,
                    type: "trigger",
                  }}
                  onClick={() => handleTriggerClick(appName, trigger)}
                >
                  <div className="flex items-center gap-2.5 py-1 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors">
                    <ItemIcon type={appName.toLowerCase()} />
                    <span className="text-foreground truncate font-medium">{trigger.name}</span>
                  </div>
                </DraggableItem>
              ))}
            </div>
          </div>
        )}

        {/* Action Groups */}
        {details.actionGroups.map((group) => (
          <div key={group.name} className="mt-2">
            <div className="px-3 py-1 flex items-center gap-2 text-sm font-light text-muted-foreground lowercase">
              <Play className="w-3.5 h-3.5" />
              <span>{group.name}</span>
            </div>
            <div className="space-y-0.5 px-2 pl-6">
              {group.items.map((action) => (
                <DraggableItem
                  key={action.name}
                  data={{
                    appName: appName,
                    actionName: action.name,
                    description: action.description,
                    type: "action",
                  }}
                  onClick={() => handleActionClick(appName, action)}
                >
                  <div className="flex items-center gap-2.5 py-1 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors">
                    <ItemIcon type={appName.toLowerCase()} />
                    <span className="text-foreground truncate font-medium">{action.name}</span>
                  </div>
                </DraggableItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const isSearching = searchQuery.trim().length > 0

  const filteredCategories = isSearching
    ? categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
        }))
        .filter((cat) => cat.items.length > 0)
    : categories.filter((cat) => cat.name === activeTab)

  return (
    <TooltipProvider delayDuration={100}>
      <div className={`bg-card rounded-xl border border-border shadow-lg flex overflow-hidden group ${
        source === "sidebar" ? "w-[280px] h-[520px]" : "w-[380px] h-[280px]"
      }`}>
        {/* Sidebar with category tabs */}
        <div className="w-12 border-border/30 flex flex-col items-center py-2 flex-shrink-0 leading-3 h-auto border-r gap-0.5 relative">
          <div
            className="absolute left-1.5 w-9 h-9 bg-accent rounded-lg transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${getTabIndex() * 38}px)`,
            }}
          />

          {/* Popular Tab */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setActiveTab("Popular")
                  setSearchQuery("")
                  setSelectedApp(null) // Clear selected app when changing tabs
                  setTabKey((prev) => prev + 1)
                }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer relative z-10 ${
                  activeTab === "Popular"
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Star className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              sideOffset={0}
              avoidCollisions={false}
              className="bg-white text-foreground border border-border/50 shadow-md px-2 py-1.5 rounded-lg"
              arrowClassName="bg-white fill-white border-border/50"
            >
              <span className="text-sm font-medium">Popular</span>
            </TooltipContent>
          </Tooltip>

          {categoryTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            const category = categories.find((c) => c.name === tab.key)
            const hasSearchMatch =
              isSearching && category?.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

            return (
              <Tooltip key={tab.key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveTab(tab.key)
                      setSearchQuery("")
                      setSelectedApp(null) // Clear selected app when changing tabs
                      if (!selectedApp) {
                        setTabKey((prev) => prev + 1)
                      }
                    }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer relative z-10 ${
                      isActive
                        ? "text-accent-foreground"
                        : hasSearchMatch
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  sideOffset={0}
                  avoidCollisions={false}
                  className="bg-white text-foreground border border-border/50 shadow-md px-2 py-1.5 rounded-lg"
                  arrowClassName="bg-white fill-white border-border/50"
                >
                  <span className="text-sm font-medium">{tab.name}</span>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header with search */}
          <div className="sticky top-0 z-10 bg-background border-b border-border/30 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <div className={`relative ${source === "sidebar" ? "flex-1" : "flex-1"}`}>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className={`w-full pl-8 ${searchQuery ? "pr-8" : source === "sidebar" ? "pr-10" : "pr-8"} py-1 text-sm bg-muted/50 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-ring`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition-colors group"
                  >
                    <X className="w-3.5 h-3.5 group-hover:text-foreground transition-colors animate-in spin-in-180 duration-200 text-ring" />
                  </button>
                )}
              </div>
              {/* Pin button - only show for sidebar source */}
              {source === "sidebar" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onPinToggle?.(!isPinned)
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                        isPinned
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      {isPinned ? (
                        <Pin className="w-3.5 h-3.5" />
                      ) : (
                        <PinOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    avoidCollisions={false}
                    className="bg-white text-foreground border border-border/50 shadow-md px-2 py-1.5 rounded-lg"
                    arrowClassName="bg-white fill-white border-border/50"
                  >
                    <span className="text-sm font-medium">{isPinned ? "Unpin" : "Pin"}</span>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Items list */}
          <div
            className={`flex-1 overflow-y-auto nowheel my-2 py-[0] node-selector-scrollable ${source === "sidebar" ? "node-selector-scrollable-thin" : ""}`}
            onWheel={(e) => e.stopPropagation()}
          >
            <div key={tabKey} className="animate-in fade-in duration-300">
              {selectedApp ? (
                renderAppDetailView(selectedApp)
              ) : activeTab === "Popular" && !isSearching ? (
                renderHomeView()
              ) : activeTab === "Core Nodes" && !isSearching ? (
                renderCoreView()
              ) : activeTab === "Triggers" && !isSearching ? (
                renderTriggersView()
              ) : (
                <>
                  {filteredCategories.map((category) => (
                    <div key={category.name}>
                      {/* Category header (always shown) */}
                      <div className="px-3 font-light text-muted-foreground text-sm py-1.5 my-0 lowercase">
                        {category.name === "Apps" ? "Popular apps" : category.name}
                      </div>

                      {/* Category items */}
                      {category.items.map((item) => {
                        const uniqueKey = `${category.name}-${item.name}`
                        const details = appDetails[item.name]
                        const isExpanded = false
                        const actionData: SelectedAction = {
                          appName: item.name,
                          actionName: item.name,
                          description: nodeDescriptions[item.name] || `${item.name} node`,
                          type: "action",
                        }

                        if (source === "sidebar") {
                        return (
                            <DraggableItem
                              key={uniqueKey}
                              data={actionData}
                              className="group/item"
                            >
                              <div className="flex items-center justify-between py-1.5 pl-3 pr-3 text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0 overflow-hidden">
                                <div className="flex items-center gap-2 text-foreground min-w-0 flex-1 overflow-hidden">
                                  <div className="flex-shrink-0">
                                    <ItemIcon type={item.icon} />
                                  </div>
                                  <span className="text-sm font-medium truncate min-w-0">{item.name}</span>
                                </div>
                                <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none ml-1" />
                              </div>
                            </DraggableItem>
                          )
                        }

                        return (
                          <div key={uniqueKey} className="group/item">
                            {/* Item row */}
                            <div
                              onClick={() => handleItemClick(category.name, item)}
                              className={`flex items-center justify-between py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors ${
                                selectedAction === item.name && !details ? "bg-accent/40" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2.5 text-foreground overflow-x-auto whitespace-nowrap">
                                <ItemIcon type={item.icon} />
                                <span className="text-sm font-medium">{item.name}</span>
                              </div>
                              {details && (
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                  {/* More apps section - only show for Apps category */}
                  {filteredCategories.some(cat => cat.name === "Apps") && !isSearching && (
                    <div>
                      <div className="px-3 font-light text-muted-foreground text-sm py-1.5 my-0 lowercase">
                        More apps
                      </div>
                      {[
                        { name: "Notion", icon: "box" },
                        { name: "Trello", icon: "box" },
                        { name: "Asana", icon: "box" },
                        { name: "Jira", icon: "box" },
                        { name: "GitHub", icon: "code" },
                        { name: "GitLab", icon: "code" },
                        { name: "Bitbucket", icon: "code" },
                        { name: "Dropbox", icon: "box" },
                        { name: "OneDrive", icon: "box" },
                        { name: "Zoom", icon: "mic" },
                        { name: "Teams", icon: "message" },
                        { name: "Discord", icon: "message" },
                      ].map((item) => {
                        const actionData: SelectedAction = {
                          appName: item.name,
                          actionName: item.name,
                          description: `${item.name} app`,
                          type: "action",
                        }

                        if (source === "sidebar") {
                          return (
                            <DraggableItem
                              key={item.name}
                              data={actionData}
                              className="group/item"
                            >
                              <div className="flex items-center justify-between py-1.5 pl-3 pr-3 text-sm cursor-grab hover:bg-accent/50 transition-colors min-w-0 overflow-hidden">
                                <div className="flex items-center gap-2 text-foreground min-w-0 flex-1 overflow-hidden">
                                  <div className="flex-shrink-0">
                                    <ItemIcon type={item.icon} />
                                  </div>
                                  <span className="text-sm font-medium truncate min-w-0">{item.name}</span>
                                </div>
                                <GripVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none ml-1" />
                              </div>
                            </DraggableItem>
                          )
                        }

                        return (
                          <div key={item.name} className="group/item">
                            <div
                              onClick={() => handleItemClick("Apps", item)}
                              className="flex items-center justify-between py-1.5 px-2 rounded-md text-sm cursor-pointer hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 text-foreground overflow-x-auto whitespace-nowrap">
                                <ItemIcon type={item.icon} />
                                <span className="text-sm font-medium">{item.name}</span>
                              </div>
                              {appDetails[item.name] && (
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
