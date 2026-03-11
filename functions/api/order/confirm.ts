// PagesFunction types – will be resolved by @cloudflare/workers-types at deploy time
type PagesFunction<E = Record<string, unknown>> = (
  ctx: { request: Request; env: E; params: Record<string, string> }
) => Response | Promise<Response>;

interface Env {
  PANCAKE_API_KEY: string;
  PANCAKE_SHOP_ID: string;
  PANCAKE_WAREHOUSE_ID: string;
}

interface ConfirmPayload {
  orderId: string;
  combo: 'combo1' | 'combo2' | 'combo3';
  name: string;
  phone: string;
  address: string;
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
    const body: ConfirmPayload = await request.json();
    const { orderId, combo, name, phone, address } = body;

    if (!orderId || orderId === 'N/A') {
      return json({ ok: false, message: 'Thiếu mã đơn hàng' }, 400, corsOrigin);
    }
    if (!combo || !name?.trim() || !phone?.trim() || !address?.trim()) {
      return json({ ok: false, message: 'Thiếu thông tin đơn hàng' }, 400, corsOrigin);
    }

    const comboInfo = COMBO_MAP[combo];
    if (!comboInfo) {
      return json({ ok: false, message: 'Combo không hợp lệ' }, 400, corsOrigin);
    }

    await confirmPancakeOrder(
      env.PANCAKE_API_KEY,
      env.PANCAKE_SHOP_ID,
      env.PANCAKE_WAREHOUSE_ID,
      orderId,
      comboInfo,
      { name: name.trim(), phone: phone.trim(), address: address.trim() },
    );

    return json({ ok: true, message: 'Đặt hàng thành công!' }, 200, corsOrigin);
  } catch (err) {
    console.error('[order/confirm] error:', err);
    return json({ ok: false, message: 'Lỗi hệ thống, vui lòng thử lại sau' }, 500, corsOrigin);
  }
};

// ─── Pancake POS ──────────────────────────────────────────────────────────────
// PUT /shops/{shopId}/orders/{orderId} – cập nhật status lên 1 = Đã xác nhận
// Pancake yêu cầu gửi full body giống như khi tạo đơn
async function confirmPancakeOrder(
  apiKey: string,
  shopId: string,
  warehouseId: string,
  orderId: string,
  comboInfo: { label: string; price: number; productId: string; variationId: string },
  order: { name: string; phone: string; address: string },
) {
  const url = `https://pos.pancake.vn/api/v1/shops/${shopId}/orders/${orderId}?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shop_id: Number(shopId),
      status: 1, // Đã xác nhận (Confirmed)
      bill_full_name: order.name,
      bill_phone_number: order.phone,
      warehouse_id: warehouseId,
      received_at_shop: false,
      is_free_shipping: false,
      shipping_fee: 0,
      cash: comboInfo.price,
      note: `[Landing page] ${comboInfo.label}`,
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
    throw new Error(`Pancake confirm API ${response.status}: ${errText}`);
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function json(data: unknown, status = 200, origin = 'https://thuocdietmoinhatban.com') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
}
