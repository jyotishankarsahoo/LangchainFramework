import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import "dotenv/config";

// Load Docs using PDFLoader
const loader = new PDFLoader("./RAG/docs/nke-10k-2023.pdf");
const docs = await loader.load();
console.log(docs.length);

// Split all Docs in to Chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const chunks = await splitter.splitDocuments(docs);
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
const results = await vectorStore.similaritySearch(
    "When was like incorporated?"
);
const retriever = vectorStore.asRetriever({
    searchType: "mmr",
    searchKwargs: { fetchK: 1 },
});
const retriever_response = await retriever.invoke(
    "When was like incorporated?"
);
console.log(retriever_response);
