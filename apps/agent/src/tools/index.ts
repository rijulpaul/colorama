import type { Tool } from "langchain";

class Tools {
  protected tools: Tool[] = [];

  public add(tool: Tool): void {
    this.tools.push(tool);
  }

  public get(): Tool[] {
    return this.tools;
  }
}

export const tools = new Tools();
