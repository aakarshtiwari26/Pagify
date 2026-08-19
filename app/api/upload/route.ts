import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { GoogleGenAI } from "@google/genai";
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
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer, { max: 100 });
    const text = data.text;
    const pageCount = data.numpages;

    if (pageCount > 10) {
      return NextResponse.json(
        { error: "PDF exceeds 10-page limit" },
        { status: 400 }
      );
    }

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "No readable text found in PDF" },
        { status: 400 }
      );
    }

    const summaryResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text.substring(0, 4000),
      config: {
        systemInstruction:
          "Summarize the following text in 100 words or less. Be concise and capture key points.",
        maxOutputTokens: 150,
        temperature: 0.5,
      },
    });

    const summary = summaryResponse.text || "No summary available";

    const doc = new Document({ text, summary });
    await doc.save();

    return NextResponse.json({ text, summary }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF", details: error.message },
      { status: 500 }
    );
  }
}
