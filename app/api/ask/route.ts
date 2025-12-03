import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Answer the question based on the provided context. Be precise and relevant.",
        },
        {
          role: "user",
          content: `Context: ${context.substring(
            0,
            4000
          )}\nQuestion: ${question}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    const answer = response.choices[0].message.content || "No answer available";
    return NextResponse.json({ answer }, { status: 200 });
  } catch (error: any) {
    console.error("Question error:", error);
    return NextResponse.json(
      { error: "Failed to answer question", details: error.message },
      { status: 500 }
    );
  }
}
