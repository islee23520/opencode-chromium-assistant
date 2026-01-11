import { test, expect } from '@playwright/test';

test('streaming response shows streaming messages', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html?open=true');
  // Trigger streaming
  await page.evaluate(() => { (window as any)._opencode?.streamPrompt?.('Hello stream'); });
  // Wait for one of the streaming messages from mock server
  const selector = '.messages .bubble.assistant';
  await page.waitForSelector(selector, { timeout: 5000 });
  const text = await page.locator(selector).first().innerText();
  expect(text.length).toBeGreaterThan(0);
  // Confirm that a known fragment appears somewhere in messages
  await expect(page.locator('.messages')).toContainText('This is a streaming response from the mock server.');
});