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

// Event chuyển đổi (cta_click, select_package, form_start, purchase) chỉ cần
// bắn 1 lần/phiên cho mục đích chạy ads — tránh đếm trùng khi user click/focus lại nhiều lần.
const firedOnce = new Set<string>();

export function trackCTAClick(buttonText: string, section: string): void {
  if (firedOnce.has('cta_click')) return;
  firedOnce.add('cta_click');
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_click',
    button_text: buttonText,
    section,
  });
}

export function trackSelectPackage(packageName: string, price: number): void {
  if (firedOnce.has('select_package')) return;
  firedOnce.add('select_package');
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'select_package',
    package_name: packageName,
    price,
    currency: 'VND',
  });
}

export function trackFormStart(): void {
  if (firedOnce.has('form_start')) return;
  firedOnce.add('form_start');
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'form_start' });
}

export function trackPurchase(phone: string): void {
  if (firedOnce.has('purchase')) return;
  firedOnce.add('purchase');
  window.dataLayer = window.dataLayer || [];
  const rawPhone = phone.replace(/[\s.\-()]/g, '').replace(/^0/, '+84');
  window.dataLayer.push({
    event: 'purchase',
    user_data: { phone_number: rawPhone },
  });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 100): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'scroll_depth',
    scroll_percent: percent,
  });
}

export function trackViewPricing(): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'view_pricing' });
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
