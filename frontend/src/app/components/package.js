export default function Packages({ packages, tests }) {
  const activePackages = packages.filter((labPackage) => labPackage.status)

  return (
    <div className="flex w-full flex-col gap-4">
      {activePackages.map((labPackage) => {
        const includedTests = [...new Set(labPackage.testIds)]
          .map((testId) => tests.find((test) => test.id === testId))
          .filter(Boolean)

        return (
          <article
            className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
            key={labPackage.id}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v8l9 5 9-5V8M12 13v8" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="truncate font-semibold">{labPackage.name}</h2>
                <p className="shrink-0 font-semibold text-gray-800">
                  {labPackage.price == null ? "Price unavailable" : `฿${labPackage.price}`}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500">Package ID: {labPackage.id}</p>
              <p className="mt-2 text-sm text-gray-600">
                Includes: {includedTests.length > 0
                  ? includedTests.map((test) => test.name).join(", ")
                  : "No test details available"}
              </p>
            </div>
          </article>
        )
      })}
      {activePackages.length === 0 && (
        <p className="py-6 text-center text-gray-500">No active packages are available.</p>
      )}
    </div>
  )
}
