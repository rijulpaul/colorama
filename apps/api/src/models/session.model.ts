import { Schema, model, type InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    context: { type: Schema.Types.Mixed, default: {} },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant", "system"], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    collection: "sessions",
  },
);

export type SessionDocument = InferSchemaType<typeof sessionSchema>;

export const SessionModel = model("Session", sessionSchema);
