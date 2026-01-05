import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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
