// PagesFunction types – will be resolved by @cloudflare/workers-types at deploy time
type PagesFunction<E = Record<string, unknown>> = (
  ctx: { request: Request; env: E; params: Record<string, string> }
) => Response | Promise<Response>;

interface Env {
  PANCAKE_API_KEY: string;
  PANCAKE_SHOP_ID: string;
}

interface ConfirmPayload {
  orderId: string;
}

const ALLOWED_ORIGINS = new Set([
  'https://thuocxitmuoi.com',
  'https://www.thuocxitmuoi.com',
]);

function getCorsOrigin(request: Request): string {
  const origin = request.headers.get('Origin') ?? '';
  return ALLOWED_ORIGINS.has(origin) ? origin : 'https://thuocxitmuoi.com';
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
    const { orderId } = body;

    if (!orderId || orderId === 'N/A') {
      return json({ ok: false, message: 'Thiếu mã đơn hàng' }, 400, corsOrigin);
    }

    await confirmPancakeOrder(env.PANCAKE_API_KEY, env.PANCAKE_SHOP_ID, orderId);

    return json({ ok: true, message: 'Đặt hàng thành công!' }, 200, corsOrigin);
  } catch (err) {
    console.error('[order/confirm] error:', err);
    return json({ ok: false, message: 'Lỗi hệ thống, vui lòng thử lại sau' }, 500, corsOrigin);
  }
};

// ─── Pancake POS ──────────────────────────────────────────────────────────────
// PUT /shops/{shopId}/orders/{orderId} với { status: 1 } = Đã xác nhận
async function confirmPancakeOrder(apiKey: string, shopId: string, orderId: string) {
  const url = `https://pos.pancake.vn/api/v1/shops/${shopId}/orders/${orderId}?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 1 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Pancake confirm API ${response.status}: ${errText}`);
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function json(data: unknown, status = 200, origin = 'https://thuocxitmuoi.com') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
}
