import { createAgent, initChatModel, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

const getLocation = tool(
    (_, config) => {
        const user_id = config.context.user_id;
        return user_id === "1" ? "Memphis" : "Austin";
    },
    {
        name: "get_user_location",
        description: "Retrieve User Location from user's ID",
        schema: z.object({}),
    }
);

const getWeather = tool(
    (input) => {
        return `Weather is Sunny in ${input.city}`;
    },
    {
        name: "get_weather",
        description: "Get weather of the given City",
        schema: z.object({
            city: z.string(),
        }),
    }
);

const systemPrompt = `You are an expert in wether service who can also specks in humour way.

NOTE: Humour response should be maximum in one to two sentences

You have access to two tools
1. get_user_location - Use this to retrieve user's Location from given User ID.
2. get_weather - Use this to retrieve weather information for user's location.

if user asks you for weather information, make sure you have the location first.
if you can tell from the question that they mean wherever they are, use get_user_location tool to find there location. 
`;

const outputFormat = z.object({
    weather_condition: z.string(),
    humour_response: z.string(),
});

const custom_model = await initChatModel("claude-sonnet-4-5-20250929", {
    temperature: 0.7,
    timeout: 30,
    max_tokens: 200,
});

const agent = createAgent({
    model: custom_model,
    tools: [getLocation, getWeather],
    systemPrompt,
    responseFormat: outputFormat,
});

const config = {
    context: { user_id: "1" },
};
const response = await agent.invoke(
    {
        messages: [{ role: "human", content: "Whats the weather outside" }],
    },
    config
);

console.log(response.structuredResponse);
