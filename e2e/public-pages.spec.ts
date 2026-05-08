import { test, expect } from "@playwright/test";

test.describe("Páginas públicas", () => {
  test("la página de oficinas muestra las oficinas con contacto", async ({ page }) => {
    await page.goto("/offices");
    await expect(page.getByRole("heading", { name: "Nuestras oficinas" })).toBeVisible();

    // Should show at least one office
    await expect(page.getByText("CarLease Madrid")).toBeVisible();
    await expect(page.getByText("CarLease Barcelona")).toBeVisible();
    await expect(page.getByText("CarLease Valencia")).toBeVisible();

    // Each office should show contact info
    await expect(page.getByText("madrid@carlease.es")).toBeVisible();
  });

  test("la página de oficinas muestra los mapas embebidos", async ({ page }) => {
    await page.goto("/offices");
    const iframes = page.locator("iframe[title*='Mapa']");
    const count = await iframes.count();
    expect(count).toBeGreaterThan(0);
  });

  test("la página de venta carga correctamente", async ({ page }) => {
    await page.goto("/sale");
    await expect(page.getByRole("heading", { name: "Vehículos en venta" })).toBeVisible();
    // Either shows vehicles or the empty state
    const hasVehicles = await page.locator("a[href^='/sale/']").count();
    const hasEmptyState = await page.getByText("No hay vehículos en venta").count();
    expect(hasVehicles + hasEmptyState).toBeGreaterThan(0);
  });

  test("la página de venta muestra vehículos en venta del seed", async ({ page }) => {
    await page.goto("/sale");
    // Seed has 5 forSale vehicles
    const cards = page.locator("a[href^='/sale/']");
    await expect(cards.first()).toBeVisible({ timeout: 8000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("el detalle de venta muestra la información y formulario de visita", async ({ page }) => {
    await page.goto("/sale");
    const firstCard = page.locator("a[href^='/sale/']").first();
    await firstCard.click();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Precio de venta")).toBeVisible();
    await expect(page.getByText("Solicitar visita")).toBeVisible();
    await expect(page.getByPlaceholder("Tu nombre")).toBeVisible();
  });
});

test.describe("Rutas protegidas", () => {
  test("mis reservas redirige a sign-in si no hay sesión", async ({ page }) => {
    await page.goto("/my-reservations");
    // Clerk redirects unauthenticated users to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });

  test("el panel de admin redirige a sign-in si no hay sesión", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/sign-in/);
  });
});

test.describe("Navbar", () => {
  test("la navegación principal está completa", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Vehículos" })).toBeVisible();
    await expect(page.getByRole("link", { name: "En venta" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Oficinas" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Mis reservas" })).toBeVisible();
  });
});
