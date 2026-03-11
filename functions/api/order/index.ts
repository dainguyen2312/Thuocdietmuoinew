// PagesFunction types – will be resolved by @cloudflare/workers-types at deploy time
type PagesFunction<E = Record<string, unknown>> = (
  ctx: { request: Request; env: E; params: Record<string, string> }
) => Response | Promise<Response>;

interface Env {
  PANCAKE_API_KEY: string;
  PANCAKE_SHOP_ID: string;
  PANCAKE_WAREHOUSE_ID: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

interface OrderPayload {
  combo: 'combo1' | 'combo2' | 'combo3';
  name: string;
  phone: string;
  address: string;
  utm_source?: string;
  utm_campaign?: string;
}

const COMBO_MAP = {
  combo1: { label: 'Gói Nhà Nhỏ – 3 lọ',  price: 249000, productId: 'bc9e9d6e-41d3-4906-8241-d7430e3f6fd9', variationId: 'a1243c18-98fe-46cb-bd6c-fa47af46bfca' },
  combo2: { label: 'Gói Gia Đình – 6 lọ', price: 328000, productId: 'a6f4ce4b-b1e9-4319-9ace-9e532e3996d4', variationId: '71fbaf11-5f98-45c7-addf-71abb75185cb' },
  combo3: { label: 'Gói Nhà Lớn – 9 lọ',  price: 497000, productId: '8739cd47-861a-4e19-a9a3-a1688eb2ba6f', variationId: 'fb1e921a-f66b-491a-bd3b-148721ed919b' },
} as const;

const ALLOWED_ORIGINS = new Set([
  'https://thuocdietmoinhatban.com',
  'https://www.thuocdietmoinhatban.com',
]);

function getCorsOrigin(request: Request): string {
  const origin = request.headers.get('Origin') ?? '';
  return ALLOWED_ORIGINS.has(origin) ? origin : 'https://thuocdietmoinhatban.com';
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async ({ request }) =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': getCorsOrigin(request),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const corsOrigin = getCorsOrigin(request);
  try {
    const body: OrderPayload = await request.json();
    const { combo, name, phone, address, utm_source, utm_campaign } = body;

    // Server-side validation
    if (!combo || !name?.trim() || !phone?.trim() || !address?.trim()) {
      return json({ ok: false, message: 'Thiếu thông tin bắt buộc' }, 400, corsOrigin);
    }
    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return json({ ok: false, message: 'Số điện thoại phải đủ 10 số' }, 400, corsOrigin);
    }

    const comboInfo = COMBO_MAP[combo];
    if (!comboInfo) {
      return json({ ok: false, message: 'Combo không hợp lệ' }, 400, corsOrigin);
    }

    const utm = {
      source:   (utm_source   ?? '').slice(0, 50),
      campaign: (utm_campaign ?? '').slice(0, 100),
    };

    const orderData = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      comboInfo,
      utm,
    };

    // Run Pancake + Telegram in parallel
    const [pancakeResult] = await Promise.all([
      submitToPancake(env.PANCAKE_API_KEY, env.PANCAKE_SHOP_ID, env.PANCAKE_WAREHOUSE_ID, comboInfo, orderData),
      notifyTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, orderData),
    ]);

    return json({ ok: true, message: 'Tạo đơn thành công!', orderId: pancakeResult.orderId }, 200, corsOrigin);
  } catch (err) {
    console.error('[order] error:', err);
    return json({ ok: false, message: 'Lỗi hệ thống, vui lòng thử lại sau' }, 500, corsOrigin);
  }
};

// ─── Pancake POS ──────────────────────────────────────────────────────────────
// Auth: ?api_key= query param (không phải Bearer header)
// status: 0 = Mới (New) – user chưa xác nhận
async function submitToPancake(
  apiKey: string,
  shopId: string,
  warehouseId: string,
  comboInfo: { label: string; price: number; productId: string; variationId: string },
  order: { name: string; phone: string; address: string; utm: { source: string; campaign: string } },
) {
  const url = `https://pos.pancake.vn/api/v1/shops/${shopId}/orders?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shop_id: Number(shopId),
      status: 0, // Mới (New) – sẽ update lên 1 (Đã xác nhận) sau khi user confirm
      bill_full_name: order.name,
      bill_phone_number: order.phone,
      warehouse_id: warehouseId,
      received_at_shop: false,
      is_free_shipping: false,
      shipping_fee: 0,
      cash: comboInfo.price,
      note: order.utm.source
        ? `[${order.utm.source}] ${comboInfo.label}${order.utm.campaign ? ` / ${order.utm.campaign}` : ''}`
        : `[Landing page] ${comboInfo.label}`,
      shipping_address: {
        full_name: order.name,
        phone_number: order.phone,
        address: order.address,
        full_address: order.address,
        country_code: '84',
      },
      items: [
        {
          product_id: comboInfo.productId,
          variation_id: comboInfo.variationId,
          quantity: 1,
          variation_info: {
            name: comboInfo.label,
            retail_price: comboInfo.price,
          },
          discount_each_product: 0,
          is_bonus_product: false,
          is_discount_percent: false,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Pancake API ${response.status}: ${errText}`);
  }

  const data: any = await response.json();
  return { orderId: data?.id ?? data?.data?.id ?? 'N/A' };
}

// ─── Telegram ─────────────────────────────────────────────────────────────────
async function notifyTelegram(
  token: string,
  chatId: string,
  order: { name: string; phone: string; address: string; comboInfo: { label: string; price: number }; utm: { source: string; campaign: string } },
) {
  const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const priceStr = order.comboInfo.price.toLocaleString('vi-VN') + 'đ';
  const utmLine = order.utm.source
    ? `📢 <b>Nguồn:</b> ${escapeHtml(order.utm.source)}${order.utm.campaign ? ` / ${escapeHtml(order.utm.campaign)}` : ''}\n`
    : '';

  const text =
    `🛒 <b>ĐƠN HÀNG MỚI – SAMURAI</b>\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Khách:</b> ${escapeHtml(order.name)}\n` +
    `📞 <b>SĐT:</b> <code>${escapeHtml(order.phone)}</code>\n` +
    `📍 <b>Địa chỉ:</b> ${escapeHtml(order.address)}\n` +
    `📦 <b>Combo:</b> ${order.comboInfo.label}\n` +
    `💰 <b>Giá COD:</b> ${priceStr}\n` +
    utmLine +
    `━━━━━━━━━━━━━━━━\n` +
    `⏰ ${now}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!res.ok) {
    // Log but don't fail the order if Telegram is down
    console.warn('[telegram] notify failed:', await res.text());
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function json(data: unknown, status = 200, origin = 'https://thuocdietmoinhatban.com') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
