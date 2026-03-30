// GTM dataLayer utility – PestShield Landing Page
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function initGTM(): void {
  window.dataLayer = window.dataLayer || [];
}

export function trackPageView(): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_title: document.title,
    page_url: window.location.href,
  });
}

export function trackCTAClick(buttonText: string, section: string): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_click',
    button_text: buttonText,
    section,
  });
}

export function trackSelectPackage(packageName: string, price: number): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'select_package',
    package_name: packageName,
    price,
    currency: 'VND',
  });
}

export function trackFormStart(): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'form_start' });
}

export function trackPurchase(phone: string): void {
  window.dataLayer = window.dataLayer || [];
  const rawPhone = phone.replace(/[\s.\-()]/g, '').replace(/^0/, '+84');
  window.dataLayer.push({
    event: 'purchase',
    user_data: { phone_number: rawPhone },
  });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 90): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'scroll_depth',
    scroll_percent: percent,
  });
}

export function trackBotDetection(): void {
  window.dataLayer = window.dataLayer || [];
  const isLikelyBot =
    !navigator.cookieEnabled ||
    !window.localStorage ||
    navigator.webdriver === true ||
    /bot|crawl|spider|headless/i.test(navigator.userAgent);

  window.dataLayer.push({
    event: 'bot_detection',
    is_bot: isLikelyBot,
    user_agent: navigator.userAgent,
  });
}
