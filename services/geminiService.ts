import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("Gemini API key not found. AI features will be disabled.");
}


export const generateConnectionMessage = async (
  currentUser: UserProfile,
  targetUser: UserProfile
): Promise<string> => {
  const fallbackMessage = `Hi ${targetUser.fullName.split(' ')[0]},\n\nI came across your profile and was impressed by your skills in ${targetUser.skills[0]?.skill || 'your field'}. I'm passionate about building new ventures and am looking for talented individuals to collaborate with.\n\nWould you be open to a brief chat next week to explore potential synergies?\n\nBest,\n${currentUser.fullName.split(' ')[0]}`;

  if (!ai) {
    return fallbackMessage;
  }

  const prompt = `
    Generate a professional and concise connection request message from ${currentUser.fullName} to ${targetUser.fullName}.
    The goal is to network and explore potential collaboration for starting a new business.

    My Profile (${currentUser.fullName}):
    - Headline: ${currentUser.headline}
    - Skills: ${currentUser.skills.map(s => s.skill).join(", ")}
    - Bio: ${currentUser.bio}

    Their Profile (${targetUser.fullName}):
    - Headline: ${targetUser.headline}
    - Skills: ${targetUser.skills.map(s => s.skill).join(", ")}

    The message should be friendly, mention a shared interest or a specific skill of theirs that is impressive, and propose a brief chat.
    Keep it under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating connection message:", error);
    return fallbackMessage;
  }
};
