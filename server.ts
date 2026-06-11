import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Polyfill or auxiliary helper for exponential backoff on transient model API limits
async function callGeminiWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = (error.message || "").toLowerCase();
    const isTransient = 
      errorStr.includes("503") || 
      errorStr.includes("unavailable") || 
      errorStr.includes("429") || 
      errorStr.includes("resource exhausted") ||
      errorStr.includes("busy") ||
      error.status === 503 ||
      error.status === 429;

    if (isTransient && retries > 0) {
      console.warn(`[Gemini Retry Log] Detacted transient error: "${error.message || error}". Retrying in ${delay}ms... (Retries remaining: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callGeminiWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Financial Assistant endpoint with full product context
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        text: "مرحباً! يبدو أن مفتاح Gemini API لم يتم تكوينه بعد في خيارات المنصة (Settings > Secrets). يرجى تكوينه لمباشرة تفعيل المساعد المالي الذكي.\n\nHello! It seems the Gemini API key is not configured in the Secrets manager yet. Please configure it to enable the AI Financial Assistant."
      });
    }

    // Build standard, structured context prompt
    const contextPrompt = `
You are the Senior Financial Analyst & Cost Accounting Consultant for AnaCompta.
AnaCompta is an industrial cost accounting ERP.
Below is the current data logged in the ERP:
${JSON.stringify(context, null, 2)}

Analyze this data and keep it in mind to answer the user's questions in detail, highlighting accounting anomalies, profit variance (الانحرافات), and workshop cost bottlenecks.
Always give answers directly, professionally, and politely, preferring the same language as the user's message (Arabic preferred, but supports French or English if requested). Keep answers structured in clear bullet points or short markdown paragraphs.
`;

    const chatSession = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: contextPrompt,
        temperature: 0.2, // Low temperature for high precision accounting answers
      }
    });

    // Populate history if available
    for (const entry of history) {
      // Additional chat history context can be loaded if specified
    }

    const result = await callGeminiWithRetry(async () => {
      return await chatSession.sendMessage({
        message: message,
      });
    });

    if (!result || !result.text) {
      throw new Error("No text returned in Gemini response");
    }

    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini Assistant error:", error);
    
    let status = 500;
    let friendlyMessage = "عذراً، واجهت مشكلة في معالجة طلبك حالياً.";
    let friendlyMessageEn = "An unexpected error occurred while processing your request.";
    
    const errorStr = (error.message || "").toLowerCase();
    if (errorStr.includes("503") || errorStr.includes("unavailable") || error.status === 503) {
      status = 503;
      friendlyMessage = "خوادم الذكاء الاصطناعي تشهد طلباً مرتفعاً جداً في الوقت الحالي ومؤقتاً غير متاحة. يرجى الانتظار لمدة دقيقة واحدة وإعادة إرسال رسالتك مرو أخرى.";
      friendlyMessageEn = "The AI servers are currently experiencing extremely high demand and are temporarily unavailable. Please wait a minute and re-send your message.";
    } else if (errorStr.includes("429") || errorStr.includes("resource exhausted") || error.status === 429) {
      status = 429;
      friendlyMessage = "لقد تم تجاوز الحد المسموح به لطلبات الذكاء الاصطناعي مجاناً حالياً. يرجى المحاولة بعد قليل.";
      friendlyMessageEn = "Free tier rate limits exceeded. Please wait a moment and try again.";
    }
    
    res.status(status).json({ 
      error: error.message || "Internal Server Error",
      friendlyMessage,
      friendlyMessageEn
    });
  }
});

// Vite Middleware Integration
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AnaCompta Server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Error launching AnaCompta server node:", err);
});
