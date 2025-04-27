import dotenv from "dotenv";
dotenv.config();

import express from "express";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import multer from "multer";
import cloudinary from "./cloudinaryConfig.js";

const app = express();
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post("/ai-analysis", async (req, res) => {
  try {
    const { prompt, type, userId } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("Missing Authorization header");

    const { data: user, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user.user || user.user.id !== userId) {
      throw new Error("Invalid or unauthorized user");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("medical_history, allergies, current_medication")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.warn("No profile data found or multiple rows returned. Skipping patient context.");
    }

    const enhancedPrompt = `
      ${prompt}
      ${
        profile
          ? `\nPatient Context:\n- Medical History: ${profile.medical_history || "None"}\n- Allergies: ${profile.allergies || "None"}\n- Current Medication: ${profile.current_medication || "None"}`
          : ""
      }
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            type === "chat"
              ? "You are a helpful AI doctor assistant specializing in general health inquiries. Provide clear, concise, and professional medical guidance. Use patient context if provided."
              : "You are a helpful AI assistant specializing in providing medical and health-related guidance.",
        },
        { role: "user", content: enhancedPrompt },
      ],
    });

    const generatedText =
      response.choices[0].message.content || "No response available.";
    res.json({ generatedText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/reports", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("Received file:", req.file);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "notes_images" },
          (error, cloudinaryResult) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(cloudinaryResult);
            }
          }
        )
        .end(req.file.buffer);
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a medical report analysis assistant. Provide a structured and professional analysis.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
You are a licensed clinical assistant. Please analyze the uploaded medical report image.

Return a structured summary with the following format:
- Key Findings:
- Possible Concerns:
- Suggested Next Steps:
- Notes for the Patient:

Be concise and professional.
              `.trim(),
            },
            {
              type: "image_url",
              image_url: { url: result.secure_url },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    const generatedText =
      response.choices[0].message.content.trim() || "No response available";
    res.json({ generatedText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => console.log("Server running on port 8000"));
