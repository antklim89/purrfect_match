import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const priceFormat = Intl.NumberFormat("en-US", {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
	currency: "USD",
	style: "currency",
	currencyDisplay: "symbol",
	useGrouping: false,
});

export function getPrice(args: {
	price: number;
	discount?: number;
	qty?: number;
}): string {
	return priceFormat.format(calculatePrice(args));
}

export function calculatePrice({
	price = 0,
	discount = 0,
	qty = 1,
}: {
	price: number;
	discount?: number;
	qty?: number;
}): number {
	return (price / (1 - discount / 100)) * qty;
}
