// GTM dataLayer utility – PestShield Landing Page
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
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

export function trackFormSubmit(packageName: string, price: number, orderId: string): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_submit',
    package_name: packageName,
    price,
    order_id: orderId,
    currency: 'VND',
  });
}

// Normalize VN phone → E.164 (+84xxxxxxxxx) rồi SHA-256 hash cho Enhanced Conversions
async function hashPhone(raw: string): Promise<string> {
  // Chuẩn hoá: bỏ ký tự không phải số, đổi đầu 0 → +84
  const digits = raw.replace(/\D/g, '');
  const e164 = digits.startsWith('0') ? '+84' + digits.slice(1) : '+' + digits;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(e164));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// CONVERSION_ID và CONVERSION_LABEL lấy từ Google Ads → Goals → Conversions
const CONVERSION_ID    = 'AW-XXXXXXXXX';      // ← thay bằng ID thực
const CONVERSION_LABEL = 'XXXXXXXXXXXX';       // ← thay bằng Label thực

export async function trackPurchase(phone: string): Promise<void> {
  const hashedPhone = await hashPhone(phone);
  window.gtag('event', 'conversion', {
    send_to: `${CONVERSION_ID}/${CONVERSION_LABEL}`,
    user_data: {
      sha256_phone_number: hashedPhone,
    },
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
