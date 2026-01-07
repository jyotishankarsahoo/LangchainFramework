import { createAgent, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

const weatherTool = tool(
    (input) => {
        return `The weather in ${input.city} is Sunny`;
    },
    {
        name: "get_weather_info",
        description: "Retrieve weather info for a location",
        schema: z.object({
            city: z.string(),
        }),
    }
);
const agent = createAgent({
    model: "gpt-4o",
    tools: [weatherTool],
    systemPrompt:
        "You are a helpful question and answer assistant. You have access to tools that retrieves context from PDF documents & get weather tool.Use the tools to help answer user query ",
});

const graph = agent;
