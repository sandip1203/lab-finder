import { readFile } from "node:fs/promises"

export function recommendCheapest(requestIds, tests, packages) {
    if (!Array.isArray(requestIds) || requestIds.length === 0) {
        throw new Error("Please provide testIds as a non-empty array")
    }

    const uniqueRequestIds = [...new Set(requestIds)]
    const requestedTests = uniqueRequestIds.map(id =>
        tests.find(test => test.id === id && test.status === true)
    )

    if (requestedTests.some(test => !test)) {
        throw new Error("One or more test IDs are invalid or inactive")
    }

    const individualTotal = requestedTests.every(
        test => typeof test.price === "number" && Number.isFinite(test.price)
    )
        ? requestedTests.reduce((sum, test) => sum + test.price, 0)
        : null

    const activePackages = packages.filter(
        pack =>
            pack.status === true &&
            Array.isArray(pack.testIds) &&
            typeof pack.price === "number" &&
            Number.isFinite(pack.price)
    )

    let bestOption = null
    let bestScore = Number.POSITIVE_INFINITY

    function search(index, selectedPackages) {
        if (index === activePackages.length) {
            const coveredIds = new Set(
                selectedPackages.flatMap(pack => pack.testIds)
            )
            const missingTests = requestedTests.filter(
                test => !coveredIds.has(test.id)
            )
            const packageTotal = selectedPackages.reduce(
                (sum, pack) => sum + pack.price,
                0
            )
            const missingPricesKnown = missingTests.every(
                test => typeof test.price === "number" && Number.isFinite(test.price)
            )
            const total = missingPricesKnown
                ? packageTotal + missingTests.reduce((sum, test) => sum + test.price, 0)
                : null
            const score = total ?? Number.POSITIVE_INFINITY
            const extraTests = [
                ...new Set(selectedPackages.flatMap(pack => pack.testIds)),
            ].filter(id => !uniqueRequestIds.includes(id))

            if (!bestOption || score < bestScore) {
                bestScore = score
                bestOption = {
                    items: [
                        ...selectedPackages.map(pack => ({
                            type: "package",
                            id: pack.id,
                            name: pack.name,
                            price: pack.price,
                            covers: [
                                ...new Set(
                                    pack.testIds.filter(id =>
                                        uniqueRequestIds.includes(id)
                                    )
                                ),
                            ],
                        })),
                        ...missingTests.map(test => ({
                            type: "test",
                            id: test.id,
                            name: test.name,
                            price: test.price,
                            covers: [test.id],
                        })),
                    ],
                    total,
                    extraTests,
                    individualTotal,
                    savings:
                        individualTotal === null || total === null
                            ? null
                            : individualTotal - total,
                }
            }

            return
        }

        search(index + 1, selectedPackages)
        search(index + 1, [...selectedPackages, activePackages[index]])
    }

    search(0, [])
    return bestOption
}

export async function getRecommendation(requestIds) {
    const file = await readFile(
        new URL("../../data/lab-catalog.json", import.meta.url),
        "utf-8"
    )
    const data = JSON.parse(file)

    return recommendCheapest(requestIds, data.tests, data.packages ?? [])
}
