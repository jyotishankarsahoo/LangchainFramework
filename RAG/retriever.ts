import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

// Global variable to persist across hot-reloads in dev mode
let retrieverInstance: any = null;

export async function ragRetriever() {
    if (retrieverInstance) {
        return retrieverInstance;
    }
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
    retrieverInstance = vectorDB.asRetriever({
        searchType: "mmr",
        searchKwargs: { fetchK: 2 },
    });
    return retrieverInstance;
}
