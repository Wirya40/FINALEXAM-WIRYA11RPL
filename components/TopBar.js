import Link from "next/link";

export default function TopBar() {
  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4 mb-4 rounded">
      <div className="text-xl font-bold">My Shop</div>
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
