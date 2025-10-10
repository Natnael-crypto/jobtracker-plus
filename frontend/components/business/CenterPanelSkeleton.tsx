export const CenterPanelSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="flex space-x-3">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="h-4 w-1/3 bg-gray-200 mb-6 rounded" />

      <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 mb-8">
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>

      <div className="flex justify-between items-center mb-4 border-1 py-4 rounded-lg px-2 border-gray-200">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      <div className="flex space-x-6 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded" />
        ))}
      </div>

      <div className="pt-4 space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);
