import { NextResponse } from "next/server";

const GEMINI_API_KEY = "AIzaSyAcnS-UDQQVZ8L1ueS6FL1EGWskgbfkSl0";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = "You are LifeLink Assistant, an AI chatbot for an online healthcare platform. Your primary purpose is to help users find hospitals, blood banks, or ambulances, and answer healthcare/medical related queries. You should ONLY reply to topics related to hospitals, healthcare, or this platform. If the user asks about anything unrelated, politely decline and steer the conversation back to healthcare and platform services. Keep your responses concise and helpful.";

    // Convert chat history map to the format Gemini expects
    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: geminiMessages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error details:", errorText);
      throw new Error(`Failed to fetch from Gemini: ${response.statusText}`);
    }

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to fetch response from AI" }, { status: 500 });
  }
}
