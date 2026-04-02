interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  high: number;
  low: number;
}

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();

  if (c.includes("clear") || c.includes("sunny")) {
    return (
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-pulse">
          <svg className="w-14 h-14 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 100 12 6 6 0 000-12z"/>
          </svg>
        </div>
        <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl -z-10" />
      </div>
    );
  }

  if (c.includes("cloud")) {
    return (
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center shadow-2xl shadow-zinc-500/30">
          <svg className="w-14 h-14 text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.5 20q-2.275 0-3.888-1.575T1 14.575q0-1.95 1.175-3.475T5.25 9.15q.625-2.3 2.5-3.725T12 4q2.925 0 4.963 2.038T19 11q1.725.2 2.863 1.488T23 15.5q0 1.875-1.313 3.188T18.5 20H6.5z"/>
          </svg>
        </div>
      </div>
    );
  }

  if (c.includes("rain")) {
    return (
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <svg className="w-14 h-14 text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.5 18q-2.275 0-3.888-1.575T1 12.575q0-1.95 1.175-3.475T5.25 7.15q.625-2.3 2.5-3.725T12 2q2.925 0 4.963 2.038T19 9q1.725.2 2.863 1.488T23 13.5q0 1.875-1.313 3.188T18.5 18h-12zm.5 2l-1.5 3m4-3l-1.5 3m4-3l-1.5 3m4-3l-1.5 3"/>
          </svg>
        </div>
        <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl -z-10 animate-pulse" />
      </div>
    );
  }

  if (c.includes("snow")) {
    return (
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-blue-200 flex items-center justify-center shadow-2xl shadow-white/30">
          <svg className="w-14 h-14 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l.324 3.236 2.21-2.41.876 3.152 2.89-1.346-.324 3.236 3.024.5-1.814 2.632 2.814 1.346-2.89 1.346 1.814 2.632-3.024.5.324 3.236-2.89-1.346-.876 3.152-2.21-2.41L12 22l-.324-3.236-2.21 2.41-.876-3.152-2.89 1.346.324-3.236-3.024-.5 1.814-2.632L2 12l2.814-1.346-1.814-2.632 3.024-.5-.324-3.236 2.89 1.346.876-3.152 2.21 2.41L12 2z"/>
          </svg>
        </div>
      </div>
    );
  }

  if (c.includes("storm") || c.includes("thunder")) {
    return (
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-flicker">
          <svg className="w-14 h-14 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-xl -z-10" />
      </div>
    );
  }

  // Default (windy, foggy, etc.)
  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
        <svg className="w-14 h-14 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    </div>
  );
};

export function WeatherCard({ weather, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
          <div className="w-24 h-24 rounded-full bg-zinc-800/50 animate-pulse" />
          <div className="mt-6 w-32 h-12 bg-zinc-800/50 rounded-lg animate-pulse" />
          <div className="mt-4 w-48 h-6 bg-zinc-800/50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full flex items-center justify-center min-h-[300px]">
        <p className="text-zinc-500">No weather data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <h3 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2 font-display">
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        Current Weather
      </h3>

      <div className="flex flex-col items-center">
        <WeatherIcon condition={weather.condition} />

        <div className="mt-6 text-center">
          <div className="text-6xl font-bold text-zinc-100 font-display">
            {Math.round(weather.temperature)}
            <span className="text-2xl text-zinc-400 font-normal">°F</span>
          </div>
          <p className="mt-2 text-lg text-zinc-300 capitalize">{weather.condition}</p>
          <p className="mt-1 text-sm text-zinc-500">{weather.description}</p>
        </div>

        <div className="mt-6 w-full grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 rounded-xl p-4 text-center border border-zinc-800/50">
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">High / Low</div>
            <div className="text-lg font-semibold text-zinc-200">
              {Math.round(weather.high)}° / {Math.round(weather.low)}°
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 text-center border border-zinc-800/50">
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Humidity</div>
            <div className="text-lg font-semibold text-cyan-400">{weather.humidity}%</div>
          </div>
        </div>

        <div className="mt-4 w-full bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span className="text-zinc-400 text-sm">Wind Speed</span>
            </div>
            <span className="text-zinc-200 font-semibold">{weather.windSpeed} mph</span>
          </div>
        </div>
      </div>
    </div>
  );
}
