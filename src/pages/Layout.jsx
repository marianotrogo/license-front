import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
}