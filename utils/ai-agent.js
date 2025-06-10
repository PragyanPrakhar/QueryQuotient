import { createAgent, gemini } from "@inngest/agent-kit";
import { ticketAnalysisPrompt } from "../prompts/ticketAnalysis-prompt.js";
import { systemPrompt } from "../prompts/system-prompt.js";

const analyzeTicket = async (ticket) => {
    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-1.5-flash-8b",
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AI Ticket Analyzer",
        system: systemPrompt,
    });
    const response = await supportAgent.run(ticketAnalysisPrompt(ticket));
    console.log("AI response:", response);
    const raw = response.output[0].content;
    //TODO : Print the whole response and check it.
    try {
        const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        let jsonString = match ? match[1] : raw.trim();
        // Remove inner code blocks (like ```javascript ... ```)
        jsonString = jsonString.replace(/```[\s\S]*?```/g, "");
        //TODO : Print the match and jsonString and check them.
        console.log("Sanitized JSON string:", jsonString);
        return JSON.parse(jsonString);
    } catch (error) {
        console.log(
            "❌ Error parsing JSON response from AI agent:",
            error.message
        );
        // return null;
        return {
            error: true,
            data: null,
            message: "Invalid JSON response from AI",
        };
    }
};

export default analyzeTicket;
