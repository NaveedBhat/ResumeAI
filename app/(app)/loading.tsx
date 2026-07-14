export default function AppLoading() {
  return (
    <div className="p-8 max-w-5xl">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-9 w-64 bg-white/5 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-48 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse" />
              <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="h-9 w-16 bg-white/5 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse flex-shrink-0" />
            <div className="flex-1">
              <div className="h-5 w-48 bg-white/5 rounded-lg animate-pulse mb-2" />
              <div className="h-3 w-32 bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="w-5 h-5 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
