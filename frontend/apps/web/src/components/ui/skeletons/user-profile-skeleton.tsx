export function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              <div className="flex space-x-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center space-x-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3 mb-4" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
