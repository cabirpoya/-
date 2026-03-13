import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateBookMetadata(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      بر اساس متن زیر از یک کتاب، اطلاعات زیر را استخراج یا پیشنهاد بده:
      1. عنوان دقیق یا پیشنهادی کتاب
      2. نام نویسنده
      3. دسته‌بندی (فقط یکی از این موارد: fiction, history, science, psychology, philosophy, biography)
      4. خلاصه‌ای جذاب در ۳ جمله
      5. یک توصیف بصری دقیق برای طراحی جلد (به انگلیسی برای مدل تصویرساز)
      
      متن کتاب:
      ${text.substring(0, 3000)}
    `,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Error parsing AI response", e);
    return null;
  }
}

export async function generateCoverImage(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          text: `Professional book cover design, high quality, artistic, related to: ${prompt}. No text on image.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
