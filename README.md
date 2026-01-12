# LangchainFramework

This project is a comprehensive exploration of Langchain concepts, focusing on foundational agent patterns, Retrieval-Augmented Generation (RAG) systems, and advanced integrations with LangGraph and LangSmith. The codebase is organized to help you understand, implement, and extend modern LLM-powered applications from scratch.

## Project Structure

-   **Foundation/**: Step-by-step agent implementations, from simple agents to advanced configurations, memory, dynamic model selection, middleware, and guardrails.
-   **RAG/**: Practical RAG system implementations, including retrievers, two-step and agentic RAG approaches, and a RAG agent server.
-   **langgraph.json**: Configuration for LangGraph graphs and environment variables.

---

## Foundation: Agent Concepts in Langchain

The `Foundation/` directory demonstrates the evolution of agent design in Langchain:

1. **01_simpleAgent.ts**: Minimal agent setup, showing how to create and run a basic agent.
2. **02_agentWithTool.ts**: Introduces tool usage, enabling agents to interact with external functions.
3. **03_agentWithConfigTool.ts**: Configurable tools, allowing dynamic tool selection and configuration.
4. **04_agentWithConfigToolSystemPrompt.ts**: Custom system prompts for agents, improving instruction following.
5. **05_agentWithConfigToolSystemPromptCustomizedModel.ts**: Model customization, showing how to swap and configure LLMs.
6. **06_agentWithMemory.ts**: Adds memory to agents, enabling context retention across turns.
7. **07_agentWithDynamicModelSelection.ts**: Dynamic model selection based on task or input.
8. **08_agentWithOtherMiddleware.ts**: Middleware integration for logging, monitoring, or modifying agent behavior.
9. **09_agentWithGuardrailProtection.ts**: Guardrails for safe and robust agent operation.

Each file is self-contained and demonstrates a specific concept, with code and comments to guide your understanding.

---

## RAG: Retrieval-Augmented Generation Systems

The `RAG/` directory covers modern RAG system design:

-   **retriever.ts**: Core retriever logic, showing how to fetch relevant documents for LLMs.
-   **01_ragRetriever.ts**: Basic RAG pipeline, integrating retrieval with generation.
-   **02_ragAgentUsingRetriever.ts**: Agent-based RAG, where the agent orchestrates retrieval and generation.
-   **03_TwoStepragAgent.ts**: Two-step RAG approach, separating retrieval and answer synthesis for improved accuracy.
-   **04_agenticRagAgent.ts**: Agentic RAG, where the agent reasons about when and how to retrieve, and how to use retrieved information.
-   **05_ragAgentServer.ts**: RAG agent exposed as a server, ready for integration with external applications.
-   **docs/**: Example documents and data for retrieval.

### RAG Approaches Explained

-   **Two-Step RAG**: First retrieves relevant context, then generates answers using the context. This separation allows for more control and transparency.
-   **Agentic RAG**: The agent decides when to retrieve, how to use retrieved data, and can perform multi-step reasoning, making the system more flexible and powerful.

---

## LangGraph and LangSmith Integration

-   **LangGraph**: The project uses LangGraph to define and manage agent workflows as graphs. See `langgraph.json` for graph configuration, and `RAG/05_ragAgentServer.ts` for a graph-based RAG agent server.
-   **LangSmith**: (If implemented) Integration points for LangSmith can be added for experiment tracking, evaluation, and debugging. Check for LangSmith usage in agent or RAG files.

---

## Getting Started

1. **Install dependencies:**
    ```sh
    npm install
    ```
2. **Set up environment variables:**
    - Copy `.env.example` to `.env` and fill in required values (API keys, etc).
3. **Run examples:**
    - Execute any script in `Foundation/` or `RAG/` using `tsx` or your preferred TypeScript runner.
    - Example:
        ```sh
        npx tsx Foundation/01_simpleAgent.ts
        ```
4. **Start the RAG Agent Server:**
    ```sh
    npx langgraphjs dev
    ```

---

## Concepts Implemented from Scratch

-   **Agent design patterns**: From simple to advanced, with memory, tools, and guardrails.
-   **Retrievers**: Custom document retrievers for RAG.
-   **RAG pipelines**: Both two-step and agentic approaches.
-   **Graph-based orchestration**: Using LangGraph for workflow management.
-   **Server integration**: Exposing agents as services.

---

## Extending the Project

-   Add new tools, retrievers, or agent types by following the patterns in `Foundation/` and `RAG/`.
-   Integrate with LangSmith for experiment tracking.
-   Use LangGraph to design more complex workflows.

---

## References

-   [Langchain Documentation](https://js.langchain.com/)
-   [LangGraph](https://github.com/langchain-ai/langgraph)
-   [LangSmith](https://smith.langchain.com/)

---

## License

MIT License
