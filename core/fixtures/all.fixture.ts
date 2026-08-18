import { mergeTests } from '@playwright/test';
import { test as apiTest } from './api.fixture';
import { test as pageTest } from './page.fixture';

export const test = mergeTests(apiTest, pageTest);
export { expect } from '@playwright/test';
