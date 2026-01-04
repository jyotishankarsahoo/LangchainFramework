import { createAgent, tool } from "langchain";
import { z } from "zod";

const searchTool = tool(
    (query) => {
        return `Search result for ${query}: Found 5 Articles`;
    },
    {
        name: "search_tool",
        description: "Search internet for information",
        schema: z.object({
            query: z.string(),
        }),
    }
);
const weatherTool = tool(
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
const emailTool = tool(
    (recipient, subject) => {
        return `Email sent to ${recipient} with subject: ${subject}`;
    },
    {
        name: "email_tool",
        description: "Send email to some one",
        schema: z.object({
            recipient: z.string(),
            subject: z.string(),
        }),
    }
);
const agent = createAgent({
    model: "",
    tools: [searchTool, weatherTool, emailTool],
    middleware: [],
});

const response = await agent.invoke({
    messages: [
        {
            role: "human",
            content: "What is the weather in tokyo and email to jss@apple.com",
        },
    ],
});
console.log(response);
