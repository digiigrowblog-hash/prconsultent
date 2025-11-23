export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center mx-auto mb-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#09879a] rounded-full animate-spin"></div>
        </div>
        <p className="text-[#09879a] font-semibold">Loading...</p>
      </div>
    </div>
  );
}
