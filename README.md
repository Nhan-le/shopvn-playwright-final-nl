# ShopVN Playwright Final Assignment

Playwright + TypeScript end-to-end tests for `https://testing.platformforge.dev`.

## Required scenarios

- Scenario 2: add one product, verify cart badge, Cart page and quantity.
- Scenario 5: checkout with valid receiver information using COD.
- Scenario 6: update Full Name in the UI and restore the original name through the API.

## Framework structure

```text
PLAYWRIGHT/
├── core/
│   ├── api/
│   │   └── ApiClient.ts
│   └── fixtures/
│       ├── api.fixture.ts
│       ├── page.fixture.ts
│       └── all.fixture.ts
├── data/
│   └── test-data.json
├── pages/
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── ProfilePage.ts
│   └── OrdersPage.ts
├── tests/
│   ├── 01-login-blank.spec.ts
│   ├── 02-add-single-product.spec.ts
│   ├── 03-add-product-twice.spec.ts
│   ├── 04-remove-cart.spec.ts
│   ├── 05-checkout-cod.spec.ts
│   ├── 06-update-profile.spec.ts
│   └── 07-orders-api.spec.ts
├── .github/workflows/playwright.yml
├── package.json
├── playwright.config.ts
├── tsconfig.json
```

## Framework requirements covered

- Playwright + TypeScript
- Page Object Model
- Core fixtures for Page Objects and API client
- JSON data-driven test data
- Explicit `beforeEach` / `afterEach` hooks
- API setup and cleanup
- Independent test setup
- Allure reporter
- GitHub Actions

## Fixture design

- `page.fixture.ts` creates reusable Page Object fixtures.
- `api.fixture.ts` wraps Playwright's built-in isolated `request` fixture in `ApiClient`.
- `all.fixture.ts` merges the Page and API fixtures so tests import one `test` object.
- Setup/cleanup remains explicit in test hooks so the course requirement is visible and easy to explain.

## Commands

```bash
npm install
npx playwright install chromium
npm test
```

Run only the required scenarios:

```bash
npm run test:required
```

Generate Allure Report after a test run:

```bash
npm run report:generate
npm run report:open
```

## Notes

- Product IDs and prices are resolved at runtime from `GET /api/products`.
- Cart state is cleared with `PUT /api/cart` before/after cart-related tests.
- Scenario 5 captures the order created by the UI and deletes that exact order via API.
- Scenario 6 restores the original profile name via API in `afterEach`.
- Scenario 7 seeds one exact order via API and deletes only that order in cleanup.
- Tests run with one worker because all scenarios use the same fixed course account and modify shared server-side cart/profile/order state.
