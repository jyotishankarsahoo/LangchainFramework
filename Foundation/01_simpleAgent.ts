import { createAgent } from "langchain";
import "dotenv/config";

const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
});
const response = await agent.invoke({
    messages: [
        {
            role: "human",
            content: "What is 2 + 2?",
        },
    ],
});
const lastMessage = response.messages[response.messages.length-1].content;
console.log(lastMessage)