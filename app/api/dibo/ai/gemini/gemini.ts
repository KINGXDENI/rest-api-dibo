import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  Content, // Added this line
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}
// Inisialisasi instance Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);

// Tentukan pengaturan keamanan
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const GeminiAI = async (
  userId: string,
  chat: string,
  imageUrl?: string
) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
  });

  let chatHistory: Content[] = []; // Riwayat obrolan di dalam memori

  // Gabungkan obrolan dan URL gambar menjadi pesan teks tunggal
  let textMessage = chat;
  if (imageUrl) {
    textMessage += `\n[Gambar: ${imageUrl}]`; // Sisipkan URL gambar sebagai teks
  }

  const chatSession = model.startChat({
    history: chatHistory,
    safetySettings: safetySettings,
  });

  try {
    const result = await chatSession.sendMessage([{ text: textMessage }]);
    const aggregatedResponse = await result.response;
    let text = aggregatedResponse.text();
    text = text.replace(/\*\*+/g, "*"); // Bersihkan teks

    // Perbarui riwayat obrolan
    chatHistory.push(
      { role: "user", parts: [{ text: chat }] },
      { role: "model", parts: [{ text: text }] }
    );

    return text;
  } catch (error) {
    console.error("Error in GeminiAI:", error);
    throw error;
  }
};

