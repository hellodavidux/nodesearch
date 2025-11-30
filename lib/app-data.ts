// Shared app details data used across components
// =============================================================================

export interface ActionItem {
  name: string
  description: string
}

export interface ActionGroup {
  name: string
  items: ActionItem[]
}

export interface AppDetail {
  tags: string[]
  triggers: ActionItem[]
  actionGroups: ActionGroup[]
}

export const appDetails: Record<string, AppDetail> = {
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
    ],
  },
  Notion: {
    tags: ["notion"],
    triggers: [
      { name: "On Page Created", description: "Triggered when a new page is created" },
      { name: "On Page Updated", description: "Triggered when a page is updated" },
      { name: "On Database Item Created", description: "Triggered when a new database item is created" },
    ],
    actionGroups: [
      {
        name: "Pages",
        items: [
          { name: "Create Page", description: "Create a new page in Notion" },
          { name: "Update Page", description: "Update an existing page" },
          { name: "Get Page", description: "Retrieve a page by ID" },
          { name: "Archive Page", description: "Archive a page" },
        ],
      },
      {
        name: "Databases",
        items: [
          { name: "Query Database", description: "Query a database" },
          { name: "Create Database", description: "Create a new database" },
          { name: "Update Database", description: "Update database properties" },
        ],
      },
    ],
  },
  "Google Drive": {
    tags: ["google-drive"],
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
          { name: "Copy File", description: "Create a copy of a file" },
          { name: "Delete File", description: "Delete a file" },
        ],
      },
      {
        name: "Folders",
        items: [
          { name: "Create Folder", description: "Create a new folder" },
          { name: "List Folder Contents", description: "List files in a folder" },
        ],
      },
    ],
  },
}

// List of all available providers
export const PROVIDERS = Object.keys(appDetails)

// Helper to get all actions/triggers for a provider
export function getProviderActions(providerName: string): { triggers: ActionItem[]; actions: ActionItem[] } {
  const details = appDetails[providerName]
  if (!details) return { triggers: [], actions: [] }

  const actions = details.actionGroups.flatMap((group) => group.items)
  return { triggers: details.triggers, actions }
}
