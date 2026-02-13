const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
  try {
    const { messages, title, description, testCases, startCode } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "messages must be a non-empty array"
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content || msg.text || "" }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `
You are an elite Data Structures and Algorithms (DSA) tutor.

PROBLEM CONTEXT:
Title: ${title}
Description: ${description}
Examples: ${JSON.stringify(testCases)}
Initial Code: ${startCode}

STRICT RULES:
1. ONLY discuss the DSA problem context provided above.
2. ALWAYS respond in valid JSON.
3. Do not wrap output in markdown.

JSON RESPONSE FORMAT:
{
  "explanation": "Brief concept explanation",
  "approach": "Step-by-step algorithm logic",
  "code": "Corrected code snippet (if requested)",
  "tips": ["Optimization tip", "Common mistake"]
}
        `,
        temperature: 0.2,
        responseMimeType: "application/json"
      },
      contents: history
    });

    const responseText = response.text || "";

    let parsedResponse;
    try {
      const firstBrace = responseText.indexOf("{");
      const lastBrace = responseText.lastIndexOf("}");
      const jsonString = responseText.slice(firstBrace, lastBrace + 1);
      parsedResponse = JSON.parse(jsonString);
    } catch (e) {
      // console.error("JSON Parse Error:", responseText);
      return res.status(502).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: responseText
      });
    }

    res.status(200).json({
      success: true,
      data: parsedResponse
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = solveDoubt;