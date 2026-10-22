export default function Tests({ tests, selectedTestIds, onToggleTest }) {
  const activeTests = tests.filter((test) => test.status)

  return (
    <div className="flex w-full flex-col gap-4">
      {activeTests.map((test) => {
        const isSelected = selectedTestIds.includes(test.id)

        return (
          <article
            className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
            key={test.id}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#ecf4f3] text-[#568c80]">
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
                <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
                <path d="M6.453 15h11.094M8.5 2h7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="truncate font-semibold">{test.name}</h2>
                <span className="text-sm text-gray-500">{test.code}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">Test ID: {test.id}</p>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-gray-700">
                    {test.price == null ? "Price unavailable" : `฿${test.price}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => onToggleTest(test.id)}
                    aria-pressed={isSelected}
                    className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                        : "border-[#ddeae1] bg-[#f7fbf8] text-[#257869] hover:bg-green-900 hover:text-white"
                    }`}
                  >
                    {isSelected ? "Added ✓" : "+ Add"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        )
      })}
      {activeTests.length === 0 && (
        <p className="py-6 text-center text-gray-500">No active tests are available.</p>
      )}
    </div>
  )
}
