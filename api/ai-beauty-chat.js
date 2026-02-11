import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { question, product } = req.body;

    const prompt = `
You are a luxury beauty assistant.
Product: ${product.title}
Description: ${product.description}

User question: ${question}

Answer in a warm, Sephora-like tone, concise but helpful.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({
      answer: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "AI is currently unavailable." });
  }
}
