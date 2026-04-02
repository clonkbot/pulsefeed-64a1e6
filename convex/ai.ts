import { action } from "./_generated/server";
import { v } from "convex/values";

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
    systemPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error("XAI_API_KEY is not configured");
    }

    const systemPrompt = args.systemPrompt || "You are a helpful assistant.";

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-latest",
        messages: [
          { role: "system", content: systemPrompt },
          ...args.messages,
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Grok API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content as string;
  },
});

// Get real-time weather and news using Grok's live capabilities
export const getWeatherAndNews = action({
  args: {
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error("XAI_API_KEY is not configured");
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-latest",
        messages: [
          {
            role: "system",
            content: `You are a real-time data assistant. Always respond with valid JSON only, no markdown.`,
          },
          {
            role: "user",
            content: `Get me the current weather for ${args.location} and top 5 recent news headlines.

Respond ONLY with this exact JSON structure (no markdown, no code blocks):
{
  "weather": {
    "temperature": <number in fahrenheit>,
    "condition": "<clear/cloudy/rainy/snowy/stormy/windy/foggy>",
    "humidity": <number 0-100>,
    "windSpeed": <number in mph>,
    "description": "<brief weather description>",
    "high": <number>,
    "low": <number>
  },
  "news": [
    {
      "headline": "<headline text>",
      "source": "<news source>",
      "category": "<politics/tech/sports/entertainment/business/world>"
    }
  ]
}`,
          },
        ],
        search_mode: "auto",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Grok API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content as string;

    // Parse the JSON response
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      return JSON.parse(cleanContent);
    } catch (e) {
      // Return fallback data if parsing fails
      return {
        weather: {
          temperature: 72,
          condition: "clear",
          humidity: 45,
          windSpeed: 8,
          description: "Clear skies with mild temperatures",
          high: 78,
          low: 62,
        },
        news: [
          { headline: "Unable to fetch live news", source: "System", category: "tech" },
        ],
      };
    }
  },
});
