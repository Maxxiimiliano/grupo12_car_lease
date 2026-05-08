import { test, expect } from "@playwright/test";

test.describe("Página de inicio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("muestra el título principal", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Reserva tu vehículo");
  });

  test("muestra las estadísticas en la barra de stats", async ({ page }) => {
    const statsStrip = page.locator("text=vehículos disponibles");
    await expect(statsStrip).toBeVisible();
    await expect(page.locator("text=ciudades")).toBeVisible();
    await expect(page.locator("text=Desde")).toBeVisible();
  });

  test("muestra la sección de vehículos más valorados", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Más valorados" })).toBeVisible();
    // Should show at least one vehicle card
    const vehicleCards = page.locator("a[href^='/vehicles/']");
    await expect(vehicleCards.first()).toBeVisible();
  });

  test("muestra la sección de características", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "¿Por qué CarLease?" })).toBeVisible();
    await expect(page.getByText("Pago seguro")).toBeVisible();
    await expect(page.getByText("Valoraciones reales")).toBeVisible();
  });

  test("el botón 'Ver vehículos' navega al catálogo", async ({ page }) => {
    await page.getByRole("link", { name: /Ver vehículos/i }).first().click();
    await expect(page).toHaveURL("/vehicles");
  });

  test("el botón 'Ver nuestras oficinas' navega a oficinas", async ({ page }) => {
    await page.getByRole("link", { name: /Ver nuestras oficinas/i }).click();
    await expect(page).toHaveURL("/offices");
  });

  test("el logo CarLease navega al inicio", async ({ page }) => {
    await page.goto("/vehicles");
    await page.getByRole("link", { name: "CarLease" }).click();
    await expect(page).toHaveURL("/");
  });
});
