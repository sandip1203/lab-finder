"use client"
import { useEffect, useState } from "react"
import Tests from "./test"
import Packages from "./package"
import Recommendation from "./recommendation"

export default function TestToggle(){
    const[activeTab, setActiveTab] = useState("Tests")
    const [tests, setTests] = useState([])
    const [packages, setPackages] = useState([])
    const [selectedTestIds, setSelectedTestIds] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelled = false

        async function loadCatalog() {
            try {
                const [testsResponse, packagesResponse] = await Promise.all([
                    fetch("/tests"),
                    fetch("/packages"),
                ])

                if (!testsResponse.ok || !packagesResponse.ok) {
                    throw new Error("Could not load tests and packages.")
                }

                const [testsData, packagesData] = await Promise.all([
                    testsResponse.json(),
                    packagesResponse.json(),
                ])

                if (!cancelled) {
                    setTests(testsData.test ?? [])
                    setPackages(packagesData.test ?? [])
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(requestError.message || "Could not load the catalog.")
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadCatalog()
        return () => {
            cancelled = true
        }
    }, [])

    function toggleTest(testId) {
        setSelectedTestIds((selected) => selected.includes(testId)
            ? selected.filter((id) => id !== testId)
            : [...selected, testId])
    }

    return(
        <div className="grid grid-cols-1 items-start gap-6 py-3 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.7fr)] lg:gap-8">
            <aside className="w-full lg:sticky lg:top-6">
                <Recommendation
                    tests={tests}
                    selectedTestIds={selectedTestIds}
                    onToggleTest={toggleTest}
                />
            </aside>

            <section className="min-w-0">
                <div className="mb-2 flex w-fit items-center rounded-full bg-gray-200 p-1" role="tablist" aria-label="Catalog">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "Tests"}
                        onClick={() => setActiveTab("Tests")}
                        className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${activeTab === "Tests" ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        Tests
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "Packages"}
                        onClick={() => setActiveTab("Packages")}
                        className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${activeTab === "Packages" ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        Packages
                    </button>
                </div>
                <div className="mt-5 w-full">
                    {loading ? (
                        <p className="py-6 text-gray-500">Loading tests and packages...</p>
                    ) : error ? (
                        <p className="py-6 text-red-600" role="alert">{error}</p>
                    ) : activeTab === "Tests" ? (
                        <Tests
                            tests={tests}
                            selectedTestIds={selectedTestIds}
                            onToggleTest={toggleTest}
                        />
                    ) : (
                        <Packages packages={packages} tests={tests} />
                    )}
                </div>
            </section>
        </div>

    )
}