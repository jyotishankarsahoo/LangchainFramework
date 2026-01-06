import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { createAgent, tool } from "langchain";
import { z } from "zod";
import "dotenv/config";

const allDocs = [];
const pdfPaths = ["./RAG/docs/nke-10k-2023.pdf"];
for (const pdfPath of pdfPaths) {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    allDocs.push(...docs);
}
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const chunks = await splitter.splitDocuments(allDocs);
const embedding = new OpenAIEmbeddings({ model: "text-embedding-3-large" });
const vectorDB = new MemoryVectorStore(embedding);
await vectorDB.addDocuments(chunks);

const ragRetrieverTool = tool(
    async ({ query }) => {
        const retriever = vectorDB.asRetriever({
            searchType: "mmr",
            searchKwargs: { fetchK: 1 },
        });
        const retrievedDocs = await retriever.invoke(query);
        const docContents = retrievedDocs
            .map((doc) => {
                return doc.pageContent;
            })
            .join("\n\n");
        return docContents;
    },
    {
        name: "retrieve",
        description: "Retrieve information from PDF documents.",
        schema: z.object({
            query: z.string(),
        }),
    }
);
const weatherTool = tool(
    (input) => {
        return `The weather is Sunny in ${input.city}`;
    },
    {
        name: "get_weather_data",
        description: "Retrieve weather info for specified Location.",
        schema: z.object({
            city: z.string(),
        }),
    }
);
const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [weatherTool, ragRetrieverTool],
    systemPrompt:
        "You have access to tools that retrieves context from PDF documents & get weather tool.Use the tools to help answer user query",
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
// ** Nike was founded near Beaverton, Oregon, USA.
// ** The company's World Campus headquarters is located on an approximately 400-acre site near Beaverton.
// ** Current weather in Beaverton:** ☀️ **Sunny**",
