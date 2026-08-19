import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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
      model: "gemini-2.5-flash",
      contents: `Context: ${context.substring(0, 4000)}\nQuestion: ${question}`,
      config: {
        systemInstruction:
          "Answer the question based on the provided context. Be precise and relevant.",
        maxOutputTokens: 200,
        temperature: 0.5,
      },
    });

    const answer = response.text || "No answer available";
    return NextResponse.json({ answer }, { status: 200 });
  } catch (error: any) {
    console.error("Question error:", error);
    return NextResponse.json(
      { error: "Failed to answer question", details: error.message },
      { status: 500 }
    );
  }
}
