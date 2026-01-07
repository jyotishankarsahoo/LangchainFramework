import { createAgent, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const loader = new PDFLoader("./RAG/docs/nke-10k-2023.pdf");
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const chunks = await splitter.splitDocuments(docs);
const embedding = new OpenAIEmbeddings({ model: "text-embedding-3-large" });
const vectorDB = new MemoryVectorStore(embedding);
await vectorDB.addDocuments(chunks);
const retriever = vectorDB.asRetriever({
    searchType: "mmr",
    searchKwargs: { fetchK: 1 },
});

const retrieverTool = tool(
    async ({ query }) => {
        const retrievedDocs = await retriever.invoke(query);
        const docContent = retrievedDocs
            .map((doc) => {
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
const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [weatherTool, retrieverTool, emailTool],
    systemPrompt:
        "You are a helpful question and answer assistant. You have access to tools that retrieves context from PDF documents, get weather tool and send email tool.Use the tools to help answer user query ",
});

const graph = agent;
