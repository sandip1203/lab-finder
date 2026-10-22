import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex flex-col ">
        <div className="flex justify-between items-center py-3">
      <Link className="flex gap-2 items-center" href="/" aria-label="Labwise home">
        <span className="bg-[#257768] py-1 px-3 m-2 font-bold text-xl text-white rounded-lg ">L</span>
        <span className="font-bold text-xl">labwise</span>
      </Link>
      <span className="text-sm text-gray-700">A clearer way to plan your tests</span>
    </div>
    <div className="h-px w-full bg-gray-200 "></div>
    </header>

  );
}
