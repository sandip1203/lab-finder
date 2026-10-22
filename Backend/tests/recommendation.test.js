import assert from "node:assert/strict"
import { once } from "node:events"
import { readFile } from "node:fs/promises"
import { after, before, describe, it } from "node:test"
import app from "../src/app.js"

const catalog = JSON.parse(
    await readFile(new URL("../data/lab-catalog.json", import.meta.url), "utf-8")
)

describe("POST /recommendation", () => {
    let server
    let baseUrl

    before(async () => {
        server = app.listen(0)
        await once(server, "listening")
        baseUrl = `http://127.0.0.1:${server.address().port}`
    })

    after(async () => {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => error ? reject(error) : resolve())
            })
        }
    })

    for (const [index, example] of catalog.examples.entries()) {
        it(`matches catalog example ${index + 1}`, async () => {
            const response = await fetch(`${baseUrl}/recommendation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(example.request),
            })

            assert.equal(response.status, 200)
            assert.deepEqual(await response.json(), example.expected)
        })
    }

    it("returns a client error when testIds is empty", async () => {
        const response = await fetch(`${baseUrl}/recommendation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testIds: [] }),
        })

        assert.equal(response.status, 400)
        assert.deepEqual(await response.json(), {
            message: "Please provide testIds as a non-empty array",
        })
    })

    it("returns a client error for an inactive or unknown test", async () => {
        const response = await fetch(`${baseUrl}/recommendation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testIds: ["T19"] }),
        })

        assert.equal(response.status, 400)
        assert.deepEqual(await response.json(), {
            message: "One or more test IDs are invalid or inactive",
        })
    })

    it("returns a client error for an unknown test ID", async () => {
        const response = await fetch(`${baseUrl}/recommendation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testIds: ["T999"] }),
        })

        assert.equal(response.status, 400)
        assert.deepEqual(await response.json(), {
            message: "One or more test IDs are invalid or inactive",
        })
    })
})
