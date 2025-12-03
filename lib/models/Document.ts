import mongoose, { Schema, Model } from "mongoose";

export interface IDocument {
  text: string;
  summary: string;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  text: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Document: Model<IDocument> =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);

export default Document;
