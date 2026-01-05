import {
    createAgent,
    initChatModel,
    llmToolSelectorMiddleware,
    modelFallbackMiddleware,
    summarizationMiddleware,
    tool,
} from "langchain";
import { z } from "zod";
import "dotenv/config";

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

const toolSelectionModel = await initChatModel("qwen2.5:latest", {
    modelProvider: "ollama",
    baseurl: "http://localhost:11434",
    max_token: 200,
});
const fallbackModel = await initChatModel("qwen3:8b", {
    modelProvider: "ollama",
    baseurl: "http://localhost:11434",
    max_token: 200,
});
const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [searchTool, weatherTool, emailTool],
    middleware: [
        llmToolSelectorMiddleware({
            model: toolSelectionModel,
            maxTools: 2,
        }),
        summarizationMiddleware({
            model: "claude-sonnet-4-5-20250929",
            maxTokensBeforeSummary: 500,
            messagesToKeep: 5,
        }),
        modelFallbackMiddleware(fallbackModel),
    ],
});

const response = await agent.invoke({
    messages: [
        {
            role: "human",
            content:
                "What is the weather in tokyo and send email me to jss@apple.com with subject Weather?",
        },
    ],
});
console.log(response);
