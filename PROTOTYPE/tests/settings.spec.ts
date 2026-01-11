import { test, expect } from '@playwright/test';

test('settings saves and removes API key', async ({ page }) => {
  await page.goto('http://localhost:3000/settings.html');

  await page.getByLabel('API key input').fill('testkey-1234');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.locator('#key-status')).toContainText('Key set:');

  const stored = await page.evaluate(() => localStorage.getItem('opencode_api_key'));
  expect(stored).toBe('testkey-1234');

  await page.getByRole('button', { name: 'Remove Key' }).click();
  const storedAfter = await page.evaluate(() => localStorage.getItem('opencode_api_key'));
  expect(storedAfter).toBeNull();
});