import { createAgent, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

const getWeather = tool(
    (input) => {
        return `Its always sunny in ${input.city}`;
    },
    {
        name: "get_weather",
        description: "Get the weather for a given city",
        schema: z.object({
            city: z.string(),
        }),
    }
);

const getTime = tool(
    (input) => {
        return `Its 03:00PM in ${input.city}`;
    },
    {
        name: "get_time",
        description: "Get time for a given city",
        schema: z.object({
            city: z.string(),
        }),
    }
);

const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [getWeather, getTime],
});

const response = await agent.invoke({
    messages: [
        { role: "human", content: "Whats the Weather and Time in New-york" },
    ],
});
console.log(response);
