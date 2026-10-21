import Script from 'next/script';

/**
 * Google Analytics 4, loaded only when NEXT_PUBLIC_GA_ID is set.
 *
 * Without the env var nothing renders at all, so the site stays clean and
 * privacy-friendly by default. With it set you can finally see which pages,
 * searches and forms actually produce enquiries.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}