import asyncio
import os
import sys
import json
from mcp.server import Server
from mcp.server.models import InitializationOptions
import mcp.types as types
from mcp.server.stdio import stdio_server

# Add brain path to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'agatha-brain')))
from toolbox import AgathaToolbox

class AgathaMCPServer:
    def __init__(self):
        self.server = Server("agatha-mcp-server")
        self.toolbox = AgathaToolbox()
        self.setup_handlers()

    def setup_handlers(self):
        @self.server.list_tools()
        async def handle_list_tools() -> list[types.Tool]:
            """List available Agatha tools via MCP."""
            # For brevity, we export the core "execution" tools
            return [
                types.Tool(
                    name="execute_agatha_capability",
                    description="Execute one of the 1000 Agathos or Kakos capabilities.",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "side": {"type": "string", "enum": ["agathos", "kakos"]},
                            "name": {"type": "string", "description": "The exact name of the pillar or shadow."},
                            "params": {"type": "object", "description": "Optional parameters for the action."},
                            "mock": {"type": "boolean", "description": "Run in simulation mode (Mock Mode)."}
                        },
                        "required": ["side", "name"]
                    }
                ),
                types.Tool(
                    name="read_capability_docs",
                    description="Read the documentation for a specific Agatha capability.",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search term for a pillar or shadow."}
                        },
                        "required": ["query"]
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(
            name: str, 
            arguments: dict | None
        ) -> list[types.TextContent]:
            if name == "execute_agatha_capability":
                if not arguments:
                    return [types.TextContent(type="text", text="Error: Missing arguments")]
                
                side = arguments.get("side")
                capability_name = arguments.get("name")
                params = arguments.get("params", {})
                mock = arguments.get("mock", False)

                intent = {
                    "side": side,
                    "action": "pillar" if side == "agathos" else "shadow",
                    "name": capability_name,
                    "params": params
                }

                result = self.toolbox.execute_mission_step(intent, mock=mock)
                return [
                    types.TextContent(
                        type="text", 
                        text=json.dumps(result, indent=2)
                    )
                ]

            if name == "read_capability_docs":
                query = arguments.get("query", "")
                docs_path = os.path.join(os.path.dirname(__file__), "MASTER_CAPABILITIES.md")
                try:
                    with open(docs_path, 'r') as f:
                        content = f.read()
                        # Simple search for the line containing the query
                        lines = [l for l in content.split('\n') if query.lower() in l.lower()]
                        return [types.TextContent(type="text", text="\n".join(lines) if lines else "Capability not found in docs.")]
                except Exception as e:
                    return [types.TextContent(type="text", text=f"Error reading docs: {str(e)}")]
            
            raise ValueError(f"Unknown tool: {name}")

    async def run(self):
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name="agatha-mcp-server",
                    server_version="1.0.0",
                    capabilities=self.server.get_capabilities()
                )
            )

if __name__ == "__main__":
    mcp_server = AgathaMCPServer()
    asyncio.run(mcp_server.run())
