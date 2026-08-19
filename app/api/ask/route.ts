import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, context } = body;

    if (!question || !context) {
      return NextResponse.json(
        { error: "Question and context are required" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Context: ${context.substring(0, 4000)}\nQuestion: ${question}`,
      config: {
        systemInstruction:
          "Answer the question based on the provided context. Be precise and relevant.",
        maxOutputTokens: 1024,
        temperature: 0.5,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const answer = response.text || "No answer available";
    return NextResponse.json({ answer }, { status: 200 });
  } catch (error: any) {
    console.error("Question error:", error);

    if (error.status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(error.message || "")) {
      return NextResponse.json(
        {
          error: "AI usage limit reached for today. Please try again later.",
          type: "quota",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to answer question", details: error.message },
      { status: 500 }
    );
  }
}
