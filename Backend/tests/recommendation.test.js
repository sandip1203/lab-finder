import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { describe, it } from "node:test"
import { recommendCheapest } from "../src/services/recommendation.service.js"

const catalog = JSON.parse(
    await readFile(new URL("../data/lab-catalog.json", import.meta.url), "utf-8")
)

describe("recommendation examples", () => {
    for (const [index, example] of catalog.examples.entries()) {
        it(`matches catalog example ${index + 1}`, () => {
            const result = recommendCheapest(
                example.request.testIds,
                catalog.tests,
                catalog.packages
            )

            assert.deepEqual(result, example.expected)
        })
    }
})
