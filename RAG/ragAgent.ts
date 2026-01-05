import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// Load Docs using PDFLoader
const loader = new PDFLoader("./RAG/docs/nke-10k-2023.pdf");
const docs = await loader.load();
console.log(docs.length);

// Split all Docs in to Chunks
