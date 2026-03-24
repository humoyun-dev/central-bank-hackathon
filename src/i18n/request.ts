import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale, resolveLocale } from "@/i18n/config"

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (locale && !isSupportedLocale(locale)) {
    notFound();
  }

  const resolvedLocale = resolveLocale(locale);

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default
  };
});
