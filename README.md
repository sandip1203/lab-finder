# Labwise
Labwise is a lab-test catalog and recommendation app. Browse tests and packages,
add tests to your selection, and compare package combinations with individual
test prices to find the lowest-cost option.

## Requirements
- Node.js 22
- npm

## Run the app

Install dependencies and start the backend:

```bash
cd Backend
npm install
node server.js
```

The Express API starts at `http://localhost:3000`.

In a second terminal, install dependencies and start the frontend:

```bash
cd Frontend
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). The Next.js app forwards
API requests to `http://localhost:3000` by default. To use another backend
address, set `LAB_BACKEND_URL` before starting the frontend.

## Run backend tests

From the `Backend` directory, run:

```bash
npm test
```

The tests start the Express app on an available local port and compare the
recommendation endpoint's response against every request/expected-response
example in `Backend/data/lab-catalog.json`. They also cover empty, inactive, and
unknown test IDs.

## How the recommendation works

The frontend keeps the selected test IDs in shared state so the recommendation
panel stays visible while browsing the Tests and Packages tabs. When you request
a recommendation, it sends those IDs to `POST /recommendation`.

The backend:

1. Validates that the request contains a non-empty list of active test IDs and
   removes duplicate IDs.
2. Considers only active packages.
3. Evaluates each possible combination of packages. For each combination, it
   adds the prices of uncovered requested tests individually.
4. Chooses the combination with the lowest  total and returns the
   selected packages or individual tests, extra tests included by packages,
   the individual-purchase total, and savings.



## What I would improve with more time

- Replace exhaustive package-subset enumeration with a more scalable optimizer
  (for example, dynamic programming or branch-and-bound) as the catalog grows.
- Validate catalog data at startup, including prices, package test IDs, and
  duplicate or missing identifiers.
- Add focused unit tests for recommendation edge cases such as ties, duplicate
  package contents, and unknown prices, in addition to the API example tests.
- Add catalog search, pagination, and clearer retry/loading states for larger
  catalogs or API failures.

