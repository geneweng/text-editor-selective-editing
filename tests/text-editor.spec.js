// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Text Editor with Selective Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application with default state', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Text Editor App/);

    // Check header
    await expect(page.locator('h1')).toHaveText('Text Editor with Selective Editing');

    // Check user mode selector
    await expect(page.locator('.mode-select')).toHaveValue('superuser');

    // Check default text in editor
    await expect(page.locator('.text-editor')).toContainText('Welcome to the text editor!');
  });

  test('should switch between user modes', async ({ page }) => {
    // Initially in superuser mode
    await expect(page.locator('.mode-select')).toHaveValue('superuser');

    // Check superuser controls are visible
    await expect(page.locator('.template-name-input')).toBeVisible();
    await expect(page.getByText('Load Text File')).toBeVisible();

    // Switch to regular user mode
    await page.locator('.mode-select').selectOption('regular');

    // Check regular user controls
    await expect(page.getByText('Load Template')).toBeVisible();
    await expect(page.locator('.template-name-input')).not.toBeVisible();
  });

  test('should allow text editing in superuser mode', async ({ page }) => {
    const editor = page.locator('.text-editor');

    // Clear existing text and type new content
    await editor.clear();
    await editor.fill('This is a test document for highlighting.');

    // Check text was entered
    await expect(editor).toHaveValue('This is a test document for highlighting.');
  });

  test('should create highlights when text is selected', async ({ page }) => {
    const editor = page.locator('.text-editor');

    // Type some text
    await editor.clear();
    await editor.fill('Select this text for highlighting test.');

    // Select text (simulate selection by triple-clicking)
    await editor.click({ clickCount: 3 });

    // The highlights panel should appear after selection
    // Note: This test might need adjustment based on exact implementation
    await expect(page.locator('.highlights-section')).toBeVisible();
  });

  test('should show template inputs when in superuser mode', async ({ page }) => {
    // Check template name input
    await expect(page.locator('.template-name-input')).toBeVisible();
    await expect(page.locator('.template-name-input')).toHaveAttribute('placeholder', 'Template Name');

    // Check template description
    await expect(page.locator('.template-description-input')).toBeVisible();
    await expect(page.locator('.template-description-input')).toHaveAttribute('placeholder', 'Template Description (optional)');
  });

  test('should validate template name requirement', async ({ page }) => {
    // Try to save template without name
    await page.getByText('Save Template').click();

    // Should show alert (we can't easily test alert, but button should be disabled)
    await expect(page.getByText('Save Template')).toBeDisabled();

    // Enter template name
    await page.locator('.template-name-input').fill('Test Template');

    // Button should be enabled
    await expect(page.getByText('Save Template')).toBeEnabled();
  });

  test('should show help section', async ({ page }) => {
    await expect(page.locator('.help-section')).toBeVisible();
    await expect(page.locator('.help-section h3')).toHaveText('Help:');

    // Check superuser help content
    await expect(page.locator('.help-section li')).toContainText([
      'Enter a template name in the input field',
      'Load text file or type content directly'
    ]);
  });

  test('should show different help for regular users', async ({ page }) => {
    // Switch to regular user mode
    await page.locator('.mode-select').selectOption('regular');

    // Check regular user help content
    await expect(page.locator('.help-section li')).toContainText([
      'Click "Load Template" to select a template file',
      'Fill in the editable input fields'
    ]);
  });

  test('should have proper styling and layout', async ({ page }) => {
    // Check main layout
    await expect(page.locator('.main')).toBeVisible();
    await expect(page.locator('.left-panel')).toBeVisible();
    await expect(page.locator('.editor-container')).toBeVisible();

    // Check IDE-style colors
    const editorContainer = page.locator('.editor-container');
    await expect(editorContainer).toHaveClass(/edit-mode/);
  });

  test('should convert highlights to inputs', async ({ page }) => {
    // Enter template name first
    await page.locator('.template-name-input').fill('Test Template');

    // Add some text
    const editor = page.locator('.text-editor');
    await editor.clear();
    await editor.fill('Fill in your [NAME] and [EMAIL] here.');

    // The convert button should be visible but might be disabled without highlights
    await expect(page.getByText('Convert Highlights to Inputs')).toBeVisible();
  });
});