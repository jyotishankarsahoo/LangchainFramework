import { createAgent, createMiddleware, initChatModel, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

const systemPrompt = `You are an expert in wether service who can also specks in humour way.

NOTE: Humour response should be maximum in one to two sentences

You have access to two tools
1. get_user_location - Use this to retrieve user's Location from given User ID.
2. get_weather - Use this to retrieve weather information for user's location.

if user asks you for weather information, make sure you have the location first.
if you can tell from the question that they mean wherever they are, use get_user_location tool to find there location. 
`;

const getUserLocation = tool(
    (_, config) => {
        const user_id = config.context.user_id;
        return user_id === "1" ? "Memphis" : "Austin";
    },
    {
        name: "get_user_location",
        description: "Retrieves users location from user_id",
        schema: z.object({}),
    }
);

const getWeatherInfo = tool(
    (input) => {
        return `Weather is sunny in ${input.city}`;
    },
    {
        name: "get_weather_info",
        description: "Retrieve weather info from Location data",
        schema: z.object({
            city: z.string(),
        }),
    }
);

const advanceChatModel = await initChatModel("claude-sonnet-4-5-20250929", {
    temperature: 0.7,
    timeout: 30,
    max_tokens: 120,
});
const baseChatModel = await initChatModel("qwen3:8b", {
    modelProvider: "ollama",
    temperature: 0.7,
    baseUrl: "http://localhost:11434",
    max_tokens: 120,
});

const dynamicModelSelection = createMiddleware({
    name: "DynamicModelSelection",
    wrapModelCall: (request, handler) => {
        const messageCount = request.messages.length;
        return handler({
            ...request,
            model: messageCount > 4 ? advanceChatModel : baseChatModel,
        });
    },
});

const config = {
    context: { user_id: "1" },
};

const agent = createAgent({
    model: advanceChatModel,
    tools: [getUserLocation, getWeatherInfo],
    systemPrompt: systemPrompt,
    middleware: [dynamicModelSelection],
});
const response = await agent.invoke(
    {
        messages: [{ role: "human", content: "What is the weather outside?" }],
    },
    config
);
console.log(response);
