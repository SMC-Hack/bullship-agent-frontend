export const sanitizeDomainName = (value: string): string => {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "");
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};
