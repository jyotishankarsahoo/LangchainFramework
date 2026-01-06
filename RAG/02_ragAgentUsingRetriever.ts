import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import { retriever } from "./01_ragRetriever";

const ragMiddleware = dynamicSystemPromptMiddleware(async (state) => {
    const userMessage = state.messages[0].content;
    const queryString = typeof userMessage === "string" ? userMessage : "";
    const retrievedDocs = await retriever.invoke(queryString);
    const docContent = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");
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
        { role: "human", content: "When was Nike found and in which place?" },
    ],
});

console.log(response);
