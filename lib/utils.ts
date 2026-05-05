import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(date));
}

export function diffInDays(start: Date, end: Date) {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}
