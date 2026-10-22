import { readFile } from "node:fs/promises"

function recommendCheapest(requestIds, tests, packages) {
    //  Validate the requested tests
    if (!Array.isArray(requestIds) || requestIds.length === 0) {
        throw new Error("Please provide testIds as a non-empty array")
    }

    // Remove duplicate IDs
    requestIds = [...new Set(requestIds)]

    const requestedTests = requestIds.map(id =>
        tests.find(test => test.id === id && test.status === true)
    )

    if (requestedTests.some(test => !test)) {
        throw new Error("One or more test IDs are invalid or inactive")
    }

    //  Calculate the individual price
    const individualTotal = requestedTests.every(
        test => typeof test.price === "number" && Number.isFinite(test.price)
    )
        ? requestedTests.reduce((sum, test) => sum + test.price, 0)
        : null

    //  Only consider active packages
    const activePackages = packages.filter(
        pack => pack.status === true && Array.isArray(pack.testIds)
    )

    let bestOption = null
    let bestScore = Number.POSITIVE_INFINITY

    //  Try every possible combination of packages
    function search(index, selectedPackages) {
        if (index === activePackages.length) {
            const coveredIds = new Set()

            for (const pack of selectedPackages) {
                for (const id of pack.testIds) {
                    if (requestIds.includes(id)) {
                        coveredIds.add(id)
                    }
                }
            }

            // Find requested tests not covered by selected packages
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

            // Extra tests included in packages but not requested
            const extraTests = [
                ...new Set(
                    selectedPackages.flatMap(pack => pack.testIds)
                )
            ].filter(id => !requestIds.includes(id))

            if (!bestOption || score < bestScore) {
                bestScore = score
                bestOption = {
                    items: [
                        ...selectedPackages.map(pack => ({
                            type: "package",
                            id: pack.id,
                            name: pack.name,
                            price: pack.price,
                            covers: pack.testIds.filter(id =>
                                requestIds.includes(id)
                            )
                        })),
                        ...missingTests.map(test => ({
                            type: "test",
                            id: test.id,
                            name: test.name,
                            price: test.price,
                            covers: [test.id]
                        }))
                    ],
                    total,
                    extraTests,
                    individualTotal,
                    savings: individualTotal === null || total === null
                        ? null
                        : individualTotal - total
                }
            }

            return
        }

        // Do not select this package
        search(index + 1, selectedPackages)

        // Select this package
        search(index + 1, [
            ...selectedPackages,
            activePackages[index]
        ])
    }

    search(0, [])

    return bestOption
}


export async function recommendation_data(req,res){
 try {
        const requestIds = req.body?.testIds

        const file = await readFile(new URL ("../../data/lab-catalog.json",import.meta.url),"utf-8")

        const data = JSON.parse(file)

        const result = recommendCheapest(
            requestIds,
            data.tests,
            data.packages ?? []
        )

        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}