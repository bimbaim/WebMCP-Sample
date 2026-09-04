declare global {
  interface WebMCPTool {
    name: string;
    description: string;
    inputSchema: {
      type: "object";
      properties: Record<string, any>;
      required?: string[];
    };
    execute: (params: Record<string, any>) => Promise<string | Record<string, any>>;
  }

  interface ModelContext {
    registerTool: (tool: WebMCPTool) => void;
    unregisterTool: (name: string) => void;
  }

  interface Navigator {
    modelContext?: ModelContext;
  }

  interface WebMCPSubmitEvent extends Event {
    agentInvoked?: boolean;
    respondWith?: (response: string) => void;
  }
}

declare module "react" {
  interface HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolparamdescription?: string;
  }
}

export {};
