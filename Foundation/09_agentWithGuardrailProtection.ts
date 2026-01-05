import { createAgent, piiMiddleware } from "langchain";
import "dotenv/config";

const PII_RULES = {
    ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    credit_card: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
};
const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    middleware: [
        piiMiddleware("credit_card", {
            strategy: "redact",
            detector: PII_RULES.credit_card,
            applyToInput: true,
            applyToOutput: true,
        }),
        piiMiddleware("phone_number", {
            strategy: "mask",
            detector: PII_RULES.phone,
            applyToInput: true,
            applyToOutput: true,
        }),
        piiMiddleware("ssn", {
            strategy: "redact",
            detector: PII_RULES.ssn,
            applyToInput: true,
            applyToOutput: true,
        }),
    ],
});

const response = await agent.invoke({
    messages: [
        {
            role: "human",
            content:
                "my card number is 4532-4532-5678-9010, is is master or visa?",
        },
        {
            role: "human",
            content: "Look up my ssn 123-4567-6789",
        },
    ],
});

console.log(response);
// "I can help you identify the card type!
// The card number **[REDACTED_CREDIT_CARD]** is a **Visa** card.
// Cards starting with \"4\" are Visa cards, while Mastercard typically starts with numbers 51-55 or 2221-2720.
// Regarding your second request:
// I cannot and will not look up, verify, or process Social Security Numbers.
