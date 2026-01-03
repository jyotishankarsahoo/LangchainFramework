import { createAgent, initChatModel, tool } from "langchain";
import { z } from "zod";
import { MemorySaver } from "@langchain/langgraph";
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

const checkPoint = new MemorySaver();

const agent = createAgent({
    model: custom_model,
    tools: [getLocation, getWeather],
    systemPrompt,
    responseFormat: outputFormat,
    checkpointer: checkPoint,
});

const config = {
    configurable: { thread_id: "1" },
    context: { user_id: "1" },
};

const qa_config = {
    configurable: { thread_id: "2" },
    context: { user_id: "3" },
};

const response = await agent.invoke(
    {
        messages: [{ role: "human", content: "Whats the weather outside" }],
    },
    config
);
const response1 = await agent.invoke(
    {
        messages: [
            { role: "human", content: "Whats location did you tell me about" },
        ],
    },
    config
);

const response2 = await agent.invoke(
    {
        messages: [
            {
                role: "human",
                content: "Suggest me good places in that location",
            },
        ],
    },
    config
);

const response3 = await agent.invoke(
    {
        messages: [
            {
                role: "human",
                content: "Suggest me good places in that location",
            },
        ],
    },
    config
);
const response4 = await agent.invoke(
    {
        messages: [
            {
                role: "human",
                content: "Suggest me good places in that location",
            },
        ],
    },
    qa_config
);
console.log(response.messages[response.messages.length - 1].content);
console.log(response1.messages[response1.messages.length - 1].content);
console.log(response2.messages[response2.messages.length - 1].content);
console.log(response3.messages[response3.messages.length - 1].content);
console.log(response4.messages[response4.messages.length - 1].content);

// {"weather_condition":"Sunny","humour_response":"It's sunny in Memphis - looks like even the weather is feeling like Elvis today, all bright and shining!"}
// {"weather_condition":"Sunny","humour_response":"I told you about Memphis - the home of blues, barbecue, and apparently some brilliant sunshine today!"}
// {"weather_condition":"Sunny","humour_response":"I'm a weather expert, not a tour guide - I can tell you it's sunny enough for sightseeing, but you'll need someone else to show you around Memphis!"}
// {"weather_condition":"Sunny","humour_response":"Sorry, I only forecast weather, not vacation plans - but with this sunny weather in Memphis, anywhere outdoors should be a hit!"}
// {"weather_condition":"Sunny","humour_response":"Perfect weather for exploring Austin! The sun's out and ready to give you a natural tan - sunscreen not included in this forecast!"}
