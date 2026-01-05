import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import "dotenv/config";

// Load Docs using PDFLoader
const allDocs = [];
const pdfPaths = ["./RAG/docs/nke-10k-2023.pdf"];

for (const path of pdfPaths) {
    const loader = new PDFLoader(path);
    const docs = await loader.load();
    allDocs.push(...docs);
}
console.log(allDocs.length);

// Split all Docs in to Chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const chunks = await splitter.splitDocuments(allDocs);
console.log(chunks.length);

// Define Embedding to be used on Chunks
const embedding = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});

// Define a Vector Store to Store Embedding
const vectorStore = new MemoryVectorStore(embedding);

// Store Chunks in to Vector Store using Embedding
await vectorStore.addDocuments(chunks);

// Test Retrieval
// const results = await vectorStore.similaritySearch(
//     "When was like incorporated?"
// );
const retriever = vectorStore.asRetriever({
    searchType: "mmr",
    searchKwargs: { fetchK: 1 },
});
// const retrieved_context = await retriever.invoke("When was like incorporated?");
// console.log(retrieved_context);

// Define a Middleware for system prompt
const ragMiddleware = dynamicSystemPromptMiddleware(async (state) => {
    // Fetch user query
    const userQuery = state.messages[0].content;
    // Make sure userQuery is of String type
    const query = typeof userQuery === "string" ? userQuery : "";
    // Invoke retriever to get relevant docs
    const retrievedDocs = await retriever.invoke(query);
    // Store all Doc Content in a String
    const docContent = retrievedDocs
        .map((doc) => {
            return doc.pageContent;
        })
        .join("\n\n");
    return `You are a Helpful Question and Answering assistance.
            Use the following context from the document to answer the user's question.
            If you are not able to find answer in documents, respond saying I don't know.
            Don't provide made up answer
            Only answer if you find answer in provided docContent
            \n\n 
            ${docContent}`;
});

const agent = createAgent({
    model: "gpt-4o",
    tools: [],
    middleware: [ragMiddleware],
});

const response = await agent.invoke({
    messages: [
        {
            role: "user",
            content:
                "When was Nike revenue in 2023 and from which town Nike started?",
        },
    ],
});

console.log(response);
