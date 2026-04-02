import { useState, useEffect } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { WeatherCard } from "./WeatherCard";
import { NewsCard } from "./NewsCard";
import { ChatBot } from "./ChatBot";

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

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [location, setLocation] = useState("New York");
  const [locationInput, setLocationInput] = useState("New York");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getWeatherAndNews = useAction(api.ai.getWeatherAndNews);
  const preferences = useQuery(api.preferences.get);
  const setLocationPref = useMutation(api.preferences.setLocation);

  // Load user's saved location
  useEffect(() => {
    if (preferences?.primaryLocation) {
      setLocation(preferences.primaryLocation);
      setLocationInput(preferences.primaryLocation);
    }
  }, [preferences]);

  // Fetch weather and news data
  const fetchData = async (loc: string) => {
    setIsLoading(true);
    try {
      const data = await getWeatherAndNews({ location: loc });
      setWeather(data.weather);
      setNews(data.news);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(location);
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => fetchData(location), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      setLocation(locationInput.trim());
      await setLocationPref({ location: locationInput.trim() });
    }
  };

  const getWeatherBackground = () => {
    if (!weather) return "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950";
    const condition = weather.condition.toLowerCase();
    if (condition.includes("clear") || condition.includes("sunny")) return "weather-clear";
    if (condition.includes("cloud")) return "weather-cloudy";
    if (condition.includes("rain")) return "weather-rainy";
    if (condition.includes("snow")) return "weather-snowy";
    if (condition.includes("storm")) return "weather-stormy";
    return "weather-clear";
  };

  return (
    <div className={`min-h-screen ${getWeatherBackground()} relative overflow-hidden transition-all duration-1000`}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent animate-scan-line" />
      </div>

      {/* CRT overlay */}
      <div className="crt-overlay" />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-6 h-6 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-display text-xl font-bold">
              <span className="gradient-text">PULSE</span>
              <span className="text-zinc-400 font-light">FEED</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleLocationSubmit} className="relative">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-48 sm:w-56 px-4 py-2 pr-10 bg-zinc-900/80 border border-zinc-700 rounded-xl text-zinc-100 text-sm placeholder-zinc-500 focus:border-amber-500/50"
                placeholder="Enter location..."
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-amber-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <button
              onClick={() => fetchData(location)}
              disabled={isLoading}
              className="p-2 bg-zinc-900/80 border border-zinc-700 rounded-xl text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 transition-all disabled:opacity-50"
              title="Refresh"
            >
              <svg className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 bg-zinc-900/80 border border-zinc-700 rounded-xl text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition-all"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Location and time */}
        <div className="mb-6 md:mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-100 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </h2>
              {lastUpdated && (
                <p className="text-zinc-500 text-sm mt-1 font-mono">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-zinc-400 font-mono">LIVE</span>
            </div>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather card - takes up 1 column on lg */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <WeatherCard weather={weather} isLoading={isLoading} />
          </div>

          {/* News section - takes up 2 columns on lg */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2 font-display">
                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Headlines
                <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full font-mono">
                  REAL-TIME
                </span>
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {news.map((item, index) => (
                    <NewsCard key={index} news={item} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Chat bot toggle button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-zinc-950 shadow-lg shadow-amber-500/30 flex items-center justify-center hover:scale-110 transition-transform ${isChatOpen ? "hidden" : ""}`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat bot panel */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} location={location} weather={weather} news={news} />

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-zinc-600 border-t border-zinc-800/30">
        Requested by @LBallz77283 · Built by @clonkbot
      </footer>
    </div>
  );
}
