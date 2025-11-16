export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Skeleton */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Skeleton */}
          <div className="flex-1">
            <div className="mb-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-96 mb-4"></div>
                      <div className="flex gap-4 mb-3">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
