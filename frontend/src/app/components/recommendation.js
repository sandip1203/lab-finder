"use client"

import { useState } from "react"

function formatPrice(price) {
  return price == null ? "Price unavailable" : `฿${price}`
}

export default function Recommendation({ tests, selectedTestIds, onToggleTest }) {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const selectedTests = selectedTestIds
    .map((id) => tests.find((test) => test.id === id))
    .filter(Boolean)

  async function getRecommendation() {
    setLoading(true)
    setError("")
    setRecommendation(null)

    try {
      const response = await fetch("/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testIds: selectedTestIds }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not get a recommendation.")
      }

      setRecommendation(data)
    } catch (requestError) {
      setError(requestError.message || "Could not get a recommendation.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Recommendation</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add tests from the Tests tab. We’ll compare them against available packages.
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Your selected tests</h3>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600">
            {selectedTests.length}
          </span>
        </div>
        {selectedTests.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No tests added yet. Go to Tests and choose the tests you need.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {selectedTests.map((test) => (
              <li className="flex items-center justify-between gap-3 py-3" key={test.id}>
                <div>
                  <p className="text-sm font-medium text-gray-800">{test.name}</p>
                  <p className="text-xs text-gray-500">{test.code} · {formatPrice(test.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleTest(test.id)}
                  className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-red-50 hover:text-red-700"
                  aria-label={`Remove ${test.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={getRecommendation}
        disabled={selectedTestIds.length === 0 || loading}
        className="mt-4 w-full rounded-lg bg-[#257869] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {loading ? "Finding the best option..." : "Get recommendation"}
      </button>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {recommendation && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4" aria-live="polite">
          <h3 className="font-semibold text-green-900">Best option for your tests</h3>
          <ul className="mt-3 divide-y divide-green-100">
            {recommendation.items.map((item) => (
              <li className="flex items-center justify-between gap-3 py-3" key={`${item.type}-${item.id}`}>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs capitalize text-gray-500">{item.type}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-gray-800">
                  {formatPrice(item.price)}
                </span>
              </li>
            ))}
          </ul>
          {recommendation.extraTests.length > 0 && (
            <p className="mt-3 text-sm text-gray-600">
              Extra tests included: {recommendation.extraTests
                .map((id) => tests.find((test) => test.id === id)?.name || id)
                .join(", ")}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-green-200 pt-3">
            <span className="font-semibold text-gray-800">Recommended total</span>
            <span className="text-lg font-bold text-green-900">
              {formatPrice(recommendation.total)}
            </span>
          </div>
          {recommendation.savings != null && recommendation.savings > 0 && (
            <p className="mt-2 text-sm font-medium text-green-800">
              You save {formatPrice(recommendation.savings)} compared with buying individually.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
