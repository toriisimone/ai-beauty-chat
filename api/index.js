const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async function handler(req, res) {
  // Allow Shopify / browsers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(200).json({ answer: "Method not allowed." });
  }

  try {
    const { question, product } = req.body || {};

    if (!question) {
      return res.status(400).json({ answer: "No question provided." });
    }

    const prompt = `
You are a luxury Sephora-style beauty assistant.

PRODUCT:
${product?.title || "Unknown product"}

DESCRIPTION:
${product?.description || "No description provided."}

USER QUESTION:
${question}

Give a warm, concise, helpful answer.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "I’m having trouble answering that right now.";

    return res.status(200).json({ answer });

  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).json({ answer: "AI is currently unavailable." });
  }
};
