import { ContractItem, ContractResDto, RateType } from "@/types/contracts.types";


export const NL_EURO = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(price: number) {
  return NL_EURO.format(price);
}


export const tarifDict: Record<RateType, string> = {
  daily: "Tarief per dag",
  hourly: "Tarief per uur",
  minute: "Tarief per minuut",
  weekly: "Tarief per week",
  monthly: "Tarief per maand",
};

export function rateString(item: ContractResDto | ContractItem | any) {
  const priceFrequency = item.price_frequency as RateType;
  return tarifDict[priceFrequency];
}

export function getRate(item: ContractResDto | ContractItem | any) {
  const rate = item.price;

  return rate ? formatPrice(rate) : "No rate set";
}