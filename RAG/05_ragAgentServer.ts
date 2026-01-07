import { createAgent, tool } from "langchain";
import { Document } from "@langchain/core/documents";
import { MemorySaver } from "@langchain/langgraph";
import { z } from "zod";
import "dotenv/config";
import { ragRetriever } from "./retriever";

const retrieverTool = tool(
    async ({ query }) => {
        const retriever = await ragRetriever();
        const retrievedDocs: Document[] = await retriever.invoke(query);
        const docContent = retrievedDocs
            .map((doc: Document) => {
                return doc.pageContent;
            })
            .join("\n\n");
        return docContent;
    },
    {
        name: "retriever",
        description: "Retrieve information from PDF documents",
        schema: z.object({
            query: z.string(),
        }),
    }
);
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
const emailTool = tool(
    ({ emailID, subject }) => {
        return `Email sent to ${emailID} with subject: ${subject}`;
    },
    {
        name: "send_email",
        description: "Send email to some one with specified subject",
        schema: z.object({
            emailID: z.string(),
            subject: z.string(),
        }),
    }
);

const memorySaver = new MemorySaver();
const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [weatherTool, retrieverTool, emailTool],
    checkpointer: memorySaver,
    systemPrompt:
        "You are a helpful question and answer assistant. You have access to tools that retrieves context from PDF documents, get weather tool and send email tool.Use the tools to help answer user query ",
});

export const graph = agent;
