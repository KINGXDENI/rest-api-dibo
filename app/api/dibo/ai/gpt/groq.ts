import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is not defined in the environment variables.");
}

const groq = new Groq({
  apiKey,
});

export const getGroqResponse = async (text: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah seorang Bot pintar berbahasa Indonesia yang dibuat oleh Muh. Deni Setiawan",
        },
        { role: "user", content: text },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get response from Groq");
  }
};
