import { test, expect } from "@playwright/test";

test.describe("Catálogo de vehículos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/vehicles");
  });

  test("muestra el título del catálogo", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Catálogo de vehículos" })).toBeVisible();
  });

  test("muestra vehículos en la cuadrícula", async ({ page }) => {
    const cards = page.locator("a[href^='/vehicles/']");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("muestra el panel de filtros", async ({ page }) => {
    // Use heading role to avoid matching 'Limpiar filtros' button
    await expect(page.getByRole("heading", { name: "Filtros" })).toBeVisible();
    await expect(page.getByPlaceholder("Marca o modelo...")).toBeVisible();
    await expect(page.getByText("Ciudad / Oficina")).toBeVisible();
    await expect(page.getByText("Categoría")).toBeVisible();
  });

  test("el filtro de búsqueda por texto funciona", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Marca o modelo...");
    await searchInput.fill("BMW");
    await searchInput.press("Enter");

    await page.waitForURL(/search=BMW/);
    const cards = page.locator("a[href^='/vehicles/']");
    await expect(cards.first()).toBeVisible();

    const brandTexts = await page.locator("h3.font-semibold").allTextContents();
    const allMatchBMW = brandTexts.every((t) => t.toLowerCase().includes("bmw"));
    expect(allMatchBMW).toBe(true);
  });

  test("la búsqueda sin resultados muestra el mensaje vacío", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Marca o modelo...");
    await searchInput.fill("MarcaInexistente123");
    await searchInput.press("Enter");
    await expect(page.getByText("No se encontraron vehículos")).toBeVisible({ timeout: 8000 });
  });

  test("el botón limpiar filtros resetea los parámetros", async ({ page }) => {
    await page.goto("/vehicles?search=BMW&category=SUV");
    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await expect(page).toHaveURL("/vehicles");
  });

  test("el clic en una tarjeta navega al detalle con información correcta", async ({ page }) => {
    const firstCard = page.locator("a[href^='/vehicles/']").first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await expect(page).toHaveURL(href!);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Combustible")).toBeVisible();
    await expect(page.getByText("Transmisión")).toBeVisible();
    await expect(page.getByText("Precio por día")).toBeVisible();
  });
});
