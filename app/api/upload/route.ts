import { NextRequest, NextResponse } from "next/server";
import { getDocumentProxy, extractText } from "unpdf";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PDF exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));

    if (pdf.numPages > 10) {
      return NextResponse.json(
        { error: "PDF exceeds 10-page limit" },
        { status: 400 }
      );
    }

    const { text } = await extractText(pdf, { mergePages: true });

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "No readable text found in PDF" },
        { status: 400 }
      );
    }

    const summaryResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: text.substring(0, 4000),
      config: {
        systemInstruction:
          "Summarize the following text in 100 words or less. Be concise and capture key points.",
        maxOutputTokens: 1024,
        temperature: 0.5,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const summary = summaryResponse.text || "No summary available";

    const doc = new Document({ text, summary });
    await doc.save();

    return NextResponse.json({ text, summary }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);

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
      { error: "Failed to process PDF", details: error.message },
      { status: 500 }
    );
  }
}
