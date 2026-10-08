# Renewal Compass

[Read the formatted product documents](https://mvahedi2020.github.io/Renewal-Compass/docs/index.html).

Compare a customer’s feature request with the team’s available time and the needs of other customers. Choose a response and record its conditions before making a commitment. All records in this demo are fictional.

**Try it:** Compare the custom dashboard with the shared export and temporary workaround, then review the conditions of your choice. [Open the demo](https://mvahedi2020.github.io/Renewal-Compass/) · [Follow the walkthrough](docs/product/Sample_Walkthrough.md).

**Product decision:** provisionally support a reusable review export plus an operating bridge, while preserving a shared accessibility milestone. Reject the custom dashboard at baseline because it exceeds available package capacity by six days. The bridge-only alternative offers a smaller recoverable scope.

Product tradeoff: a reusable package protects the shared milestone but still consumes the full available eight days. The next investment depends on actual workflow overlap, operating burden and agreed commitment conditions. See the [case study](docs/product/Case_Study.md) for the proposed comparison and investment criteria.

## Reviewer route

[Interactive demo](https://mvahedi2020.github.io/Renewal-Compass/) · [Case study](docs/product/Case_Study.md) · [Exact walkthrough](docs/product/Sample_Walkthrough.md)

Start with the account brief, compare the three calculable packages, then preview a conditional decision. Confirm, refresh, inspect exact history, withdraw and restore an earlier scope for another review. Try the custom package at baseline to see a meaningful blocked option and bridge-only recovery.

[Product brief](docs/product/Product_Brief.md) · [PRD and S069–S076 mapping](docs/product/PRD.md) · [Fictional sample/state contract](docs/product/Sample_Contract.md) · [Decisions and risks](docs/product/Decisions_and_Risks.md) · [Validation/release ledger](docs/product/Validation.md)

All records, dates and capacity figures are invented. No employer contract, customer name/value, achieved retained revenue, outreach, legal/compliance claim or endorsement appears. A recorded decision is conditional review, never a delivery promise. Mo owns Product / Program Management direction; AI assists implementation and verification. No human research has been conducted.

## Local setup and checks

Use Node 24 and the locked dependencies. From this repository:

```sh
nvm use
npm ci
npx playwright install chromium
npm run lint
npm run typecheck
npm run test
npm run build
npm run audit
npm run test:e2e
npm run preview
```

The preview is at `http://127.0.0.1:4193/Renewal-Compass/`. Port 4193 is fixed and strict. Production browser tests own and stop their preview server. Build includes all product documents. The GitHub workflow **Verify and publish demo** runs software gates and publishes the static build via Pages.

The app has no server, login, telemetry, external integration, live AI or runtime configuration. CSP and referrer policy constrain the static experience. The runtime guard rejects non-Node-24 builds and custom VITE settings; the tracked-file guard rejects generated/runtime/environment files. Draft edits remain in memory until a reviewed decision is confirmed. Local schema/reference/history checks preserve invalid bytes and reject conflicting writes; unavailable persistence is explained. Export is self-contained reviewed JSON, not an import or agreement.
