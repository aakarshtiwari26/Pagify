"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  MessageSquare,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [qaStatus, setQaStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [isSpeakingSummary, setIsSpeakingSummary] = useState(false);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus("File size exceeds 5MB limit");
        return;
      }
      setSelectedFile(file);
      setUploadStatus(`Selected: ${file.name}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus("File size exceeds 5MB limit");
        return;
      }
      setSelectedFile(file);
      setUploadStatus(`Selected: ${file.name}`);
    } else {
      setUploadStatus("Please select a PDF file");
    }
  };

  const uploadPDF = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("Uploading and processing PDF...");
    setSummary("");

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process PDF");
      }

      setExtractedText(result.text);
      setSummary(result.summary);
      setUploadStatus("PDF processed successfully! ✓");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !extractedText) return;

    setIsAsking(true);
    setQaStatus("Fetching answer...");
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: extractedText }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to get answer");
      }

      setAnswer(result.answer);
      setQaStatus("Question answered successfully! ✓");
      setQuestion("");
    } catch (error: any) {
      setQaStatus(`Error: ${error.message}`);
    } finally {
      setIsAsking(false);
    }
  };

  const speakText = (
    text: string,
    isSpeaking: boolean,
    setIsSpeaking: (val: boolean) => void
  ) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice =
      voices.find((voice) => voice.lang === "en-IN") ||
      voices.find((voice) => voice.lang === "en-US");

    if (indianVoice) utterance.voice = indianVoice;
    utterance.lang = "en-IN";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Pagify</h1>
          <p className="text-muted-foreground">
            Unlock Knowledge with AI-Powered PDF Insights
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Upload PDF
            </CardTitle>
            <CardDescription>
              Upload a PDF file (max 5MB, 10 pages) to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                Drag & Drop your PDF here or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            <div className="flex gap-4 items-center">
              <Button
                onClick={uploadPDF}
                disabled={!selectedFile || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upload PDF"
                )}
              </Button>
            </div>
            {uploadStatus && (
              <p
                className={`text-sm ${
                  uploadStatus.includes("Error")
                    ? "text-destructive"
                    : uploadStatus.includes("✓")
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {uploadStatus}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Summary
              </CardTitle>
              {summary && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    speakText(summary, isSpeakingSummary, setIsSpeakingSummary)
                  }
                  title="Listen to summary"
                >
                  {isSpeakingSummary ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isUploading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-6 min-h-[120px]">
                <p className="text-foreground leading-relaxed">
                  {summary || "Upload a PDF to see its summary."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Ask a Question
              </CardTitle>
              {answer && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    speakText(answer, isSpeakingAnswer, setIsSpeakingAnswer)
                  }
                  title="Listen to answer"
                >
                  {isSpeakingAnswer ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
            <CardDescription>
              Ask questions about the PDF content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask about the PDF content..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                disabled={!extractedText}
              />
              <Button
                onClick={askQuestion}
                disabled={!extractedText || !question.trim() || isAsking}
              >
                {isAsking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
            {isAsking ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-6 min-h-[120px]">
                <p className="text-foreground leading-relaxed">
                  {answer || "Answers will appear here."}
                </p>
              </div>
            )}
            {qaStatus && (
              <p
                className={`text-sm ${
                  qaStatus.includes("Error")
                    ? "text-destructive"
                    : qaStatus.includes("✓")
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {qaStatus}
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="mt-16 py-8 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">© 2025 Pagify. All rights reserved.</p>
          <p className="italic mb-2">
            "Education is the manifestation of the perfection already in man." —
            Swami Vivekananda
          </p>
          <p>
            Designed & Developed by{" "}
            <a
              href="https://www.linkedin.com/in/aakarshtiwari/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Aakarsh Tiwari
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
