import Script from "next/script";
import { ThemeProvider } from "@/app/context/ThemeContext";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8496834951038637"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-TH7S06BTWS"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TH7S06BTWS');
        `}
      </Script>

      {/* Google Translate */}
      <div
        id="google_translate_element"
        className="fixed top-4 right-4 z-[9999]"
      ></div>

      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'ur,hi,ar,fr,de,es,zh-CN',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_element'
            );
          }
        `}
      </Script>

      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
