import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  high: number;
  low: number;
}

interface NewsItem {
  headline: string;
  source: string;
  category: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  weather: WeatherData | null;
  news: NewsItem[];
}

export function ChatBot({ isOpen, onClose, location, weather, news }: ChatBotProps) {
  const messages = useQuery(api.chat.list);
  const sendMessage = useMutation(api.chat.send);
  const clearChat = useMutation(api.chat.clear);
  const chat = useAction(api.ai.chat);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Save user message
      await sendMessage({ content: userMessage, role: "user" });

      // Build context
      const weatherContext = weather
        ? `Current weather in ${location}: ${weather.temperature}°F, ${weather.condition}, humidity ${weather.humidity}%, wind ${weather.windSpeed} mph. ${weather.description}`
        : `Location: ${location}`;

      const newsContext = news.length > 0
        ? `Recent headlines: ${news.map(n => n.headline).join("; ")}`
        : "";

      // Get history for context
      const history = (messages || []).slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Call Grok
      const response = await chat({
        messages: [...history, { role: "user", content: userMessage }],
        systemPrompt: `You are PulseBot, a friendly and knowledgeable AI assistant for PulseFeed - a real-time weather and news tracking application. You help users understand weather conditions, discuss news headlines, and answer questions about their location.

Current context:
${weatherContext}
${newsContext}

Guidelines:
- Be helpful, concise, and friendly
- Reference the current weather and news when relevant
- Provide weather advice (e.g., "bring an umbrella" for rain)
- Discuss news topics if users ask
- Keep responses brief but informative (2-3 sentences max unless asked for detail)
- Use a modern, conversational tone`,
      });

      // Save assistant response
      await sendMessage({ content: response, role: "assistant" });
    } catch (error) {
      console.error("Chat error:", error);
      await sendMessage({
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    await clearChat();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Chat panel */}
      <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-96 h-[80vh] md:h-[600px] md:max-h-[80vh] bg-zinc-950 md:rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100 font-display">PulseBot</h3>
              <p className="text-xs text-zinc-500">Powered by Grok</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Clear chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome message */}
          {(!messages || messages.length === 0) && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-zinc-200 font-semibold mb-2">Hi! I'm PulseBot</h4>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Ask me about the weather, news, or anything else! I'm here to help.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {["What's the weather like?", "Summarize the news", "Should I bring an umbrella?"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages?.map((message: { _id: string; role: string; content: string }) => (
            <div
              key={message._id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950"
                    : "bg-zinc-800 text-zinc-200"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask PulseBot anything..."
              className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:border-amber-500/50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
