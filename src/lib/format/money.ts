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

export function formatSignedMoney(
  amountMinor: number,
  currencyCode: string,
  options: FormatMoneyOptions = {},
) {
  const absoluteValue = formatMoney(Math.abs(amountMinor), currencyCode, options)

  if (amountMinor > 0) {
    return `+${absoluteValue}`
  }

  if (amountMinor < 0) {
    return `-${absoluteValue}`
  }

  return absoluteValue
}

export function parseMoneyToMinor(rawValue: string) {
  const normalized = rawValue.replace(/,/g, "").trim()

  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) {
    throw new Error("Enter a valid amount with up to two decimal places.")
  }

  const [wholePart = "0", decimalPart = ""] = normalized.split(".")
  const wholeMinor = Number.parseInt(wholePart, 10) * 100
  const decimalMinor = Number.parseInt(decimalPart.padEnd(2, "0"), 10)

  return wholeMinor + decimalMinor
}

export function isValidMoneyInput(rawValue: string) {
  return /^\d+(\.\d{0,2})?$/.test(rawValue.replace(/,/g, "").trim())
}
