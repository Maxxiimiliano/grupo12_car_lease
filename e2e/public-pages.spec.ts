import { test, expect } from "@playwright/test";

test.describe("Páginas públicas", () => {
  test("la página de oficinas muestra las oficinas con contacto", async ({ page }) => {
    await page.goto("/offices");
    await expect(page.getByRole("heading", { name: "Nuestras oficinas" })).toBeVisible();

    await expect(page.getByText("CarLease Madrid")).toBeVisible();
    await expect(page.getByText("CarLease Barcelona")).toBeVisible();
    await expect(page.getByText("CarLease Valencia")).toBeVisible();
    await expect(page.getByText("madrid@carlease.es")).toBeVisible();
  });

  test("la página de oficinas muestra los mapas embebidos", async ({ page }) => {
    await page.goto("/offices");
    // Wait for the page content to fully render
    await expect(page.getByText("CarLease Madrid")).toBeVisible();
    const iframes = page.locator("iframe");
    await expect(iframes.first()).toBeVisible({ timeout: 8000 });
    const count = await iframes.count();
    expect(count).toBeGreaterThan(0);
  });

  test("la página de venta carga correctamente", async ({ page }) => {
    await page.goto("/sale");
    await expect(page.getByRole("heading", { name: "Vehículos en venta" })).toBeVisible();
  });

  test("la página de venta muestra vehículos en venta del seed", async ({ page }) => {
    await page.goto("/sale");
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
    await expect(page.getByRole("heading", { name: "Solicitar visita" })).toBeVisible();
    await expect(page.getByPlaceholder("Tu nombre")).toBeVisible();
  });
});

test.describe("Rutas protegidas", () => {
  test("mis reservas redirige a sign-in si no hay sesión", async ({ page }) => {
    await page.goto("/my-reservations");
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
    // Scope to the header nav to avoid matching mobile nav or hero CTAs
    const nav = page.getByRole("banner");
    await expect(nav.getByRole("link", { name: "Vehículos", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "En venta", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Oficinas", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Mis reservas", exact: true })).toBeVisible();
  });
});
