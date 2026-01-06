import { createAgent, tool } from "langchain";
import { z } from "zod";

const weatherTool = tool(
    (input) => {
        return `The weather is Sunny in ${input.city}`;
    },
    {
        name: "get_weather_data",
        description: "Retrieve weather info for specified Location",
        schema: z.object({
            city: z.string(),
        }),
    }
);
const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [weatherTool],
    systemPrompt: "",
});

const response = await agent.invoke({
    messages: [
        {
            role: "human",
            content: "Where was nike founded and whats the weather out there",
        },
    ],
});

console.log(response);
