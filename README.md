# Labwise

Labwise helps you find the lowest-cost combination of lab tests and packages.

## Run the app

Requires Node.js 22 and npm.

Start the backend:

```bash
cd Backend
npm install
node server.js
```

In another terminal, start the frontend:

```bash
cd Frontend
npm install
npm run dev
```

## Run tests

From `Backend`, run:

```bash
npm test
```

AI was used to help write the test code. It reads each request and expected
result from `Backend/data/lab-catalog.json` and checks the recommendation
service output against it.

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
- Add more tests for recommendation edge cases.
- Add catalog search, pagination, and clearer retry/loading states for larger
  catalogs or API failures.
