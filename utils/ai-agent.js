import { createAgent, gemini } from "@inngest/agent-kit";
import { ticketAnalysisPrompt } from "../prompts/ticketAnalysis-prompt";
import { systemPrompt } from "../prompts/system-prompt";

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
    const raw = response.output[0].content;
    //TODO : Print the whole response and check it.
    try {
        const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const jsonString = match ? match[1] : raw.trim();
        //TODO : Print the match and jsonString and check them.
        console.log("Raw AI response:", raw);
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
