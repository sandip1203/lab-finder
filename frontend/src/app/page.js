import Navbar from "./components/navbar.js";
import Testpackage from "./components/toggleTestPackage.js";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl  px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Testpackage/>

    </div>
  );
}
