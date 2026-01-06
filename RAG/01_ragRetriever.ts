import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import "dotenv/config";

const docList = [];
const pdfPaths = ["./RAG/docs/nke-10k-2023.pdf"];
for (const pdfPath of pdfPaths) {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    docList.push(...docs);
}
console.log(`Documents Length: ${docList.length}`);

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docList);
console.log(`Chunks Length: ${chunks.length}`);

const embedding = new OpenAIEmbeddings({ model: "text-embedding-3-large" });
const vectorDB = new MemoryVectorStore(embedding);
await vectorDB.addDocuments(chunks);

export const retriever = vectorDB.asRetriever({
    searchType: "mmr",
    searchKwargs: { fetchK: 1 },
});

const relevant_docs = await retriever.invoke(
    "What was Nike's revenue in 2023?"
);
console.log(`Relevant Docs Length: ${relevant_docs.length}`);
console.log(
    `Page Content: ${relevant_docs.map((doc) => doc.pageContent).join("\n\n")}`
);
