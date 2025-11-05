export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-400 text-sm font-medium">Cargando...</p>
      </div>
    </div>
  );
}
