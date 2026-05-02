import { test, expect } from '@playwright/test';

test.describe('Marketing Pages', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PulseOps/);
    await expect(page.locator('h1')).toContainText('Reliability');
  });

  test('should navigate to pricing', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Pricing');
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.locator('h1')).toContainText('Pricing');
  });

  test('should load about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText('About');
  });
});

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sign in');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/\/register/);
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // We expect some error message or attempt tracking to trigger
    await expect(page.locator('text=Invalid')).toBeVisible();
  });
});
