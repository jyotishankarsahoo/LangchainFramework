import { createAgent } from "langchain";


const agent = createAgent({
    model: "",
    tools: [],
    middleware: [],
});

const response = await agent.invoke({
    messages: [
        {
            role: "human",
            content: "What is the weather in tokyo and email to jss@apple.com",
        },
    ],
});
console.log(response);