// Skeleton loader pour les cartes de stats
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-300 animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
    <div className="h-8 bg-gray-300 rounded w-32 mt-4"></div>
  </div>
);

// Skeleton loader pour les graphes
export const ChartSkeleton = () => (
  <div className="bg-white rounded-lg shadow-inner p-8 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-gray-300 rounded w-32"></div>
      <div className="h-80 bg-gray-200 rounded"></div>
      <div className="flex gap-2 justify-center">
        <div className="h-10 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Skeleton loader pour les stats détaillées
export const CountryStatsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-8 h-6 bg-gray-300 rounded"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
