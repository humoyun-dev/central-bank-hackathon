interface FormatMoneyOptions {
  currencyDisplay?: "symbol" | "narrowSymbol" | "code"
  compact?: boolean
}

export function formatMoney(
  amountMinor: number,
  currencyCode: string,
  options: FormatMoneyOptions = {},
) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: options.currencyDisplay ?? "symbol",
    notation: options.compact ? "compact" : "standard",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(amountMinor / 100)
}
