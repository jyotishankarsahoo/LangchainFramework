import { createAgent, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

const getUserLocation = tool(
    (_, config) => {
        const user_id = config.context.user_id;
        return user_id === "1" ? "memphis" : "austin";
    },
    {
        name: "get_user_location",
        description: "Retrieve User Location from User ID",
        schema: z.object({}),
    }
);
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

const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [getUserLocation, getWeather],
});

const config = {
    context: { user_id: "1" },
};
const response = await agent.invoke(
    {
        messages: [{ role: "human", content: "Whats weather outside" }],
    },
    config
);
console.log(response);