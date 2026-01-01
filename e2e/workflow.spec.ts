import { test, expect } from '@playwright/test';

test('Workflow Editor E2E', async ({ page }) => {
  await page.goto('/');

  // Check initial state
  // We need to be specific because 'Start' is also in the textarea content
  await expect(page.locator('.react-flow__node').filter({ hasText: 'Start' })).toBeVisible();
  await expect(page.locator('.react-flow__node').filter({ hasText: 'End' })).toBeVisible();

  // Test Import
  const editor = page.locator('textarea');
  await editor.fill('graph TD\nTestA --> TestB');
  await page.getByRole('button', { name: 'Import' }).click();

  await expect(page.locator('.react-flow__node').filter({ hasText: 'TestA' })).toBeVisible();
  await expect(page.locator('.react-flow__node').filter({ hasText: 'TestB' })).toBeVisible();

  // Test Invalid Syntax
  await editor.fill('graph TD\nA -->'); // Invalid
  await page.getByText('Import').click();
  await expect(page.getByTestId('error-message')).toContainText('Failed to import');

  // Test Autosave (Reload)
  await editor.fill('graph TD\nSavedNode');
  // Use specific selector for Import button to avoid ambiguity with error message if it says "Import"
  await page.getByRole('button', { name: 'Import' }).click();
  await expect(page.locator('.react-flow__node').filter({ hasText: 'SavedNode' })).toBeVisible();

  await page.reload();
  await expect(page.locator('.react-flow__node').filter({ hasText: 'SavedNode' })).toBeVisible();
  await expect(editor).toHaveValue(/SavedNode/);
});
