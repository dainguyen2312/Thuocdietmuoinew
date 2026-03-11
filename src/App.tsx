/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  Phone, 
  ShoppingCart, 
  Star,
  Package,
  Leaf,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  XCircle,
  MapPin,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Combo name helper ────────────────────────────────────────────────────────

// ─── Success Modal ────────────────────────────────────────────────────────────
// Combo name mapping
const getComboName = (comboId: string): string => {
  const comboMap: { [key: string]: string } = {
    combo1: 'Gói Nhà Nhỏ (3 lọ)',
    combo2: 'Gói Gia Đình (6 lọ)',
    combo3: 'Gói Nhà Lớn (9 lọ)',
  };
  return comboMap[comboId] || 'Combo không xác định';
};

const COMBO_SUCCESS_DETAILS: Record<string, {
  emoji: string;
  name: string;
  quantity: string;
  price: string;
  originalPrice?: string;
  savings?: string;
}> = {
  combo1: {
    emoji: '🏠',
    name: 'Gói Nhà Nhỏ',
    quantity: '3 lọ · phù hợp nhà ≤50m²',
    price: '249.000đ',
  },
  combo2: {
    emoji: '👨‍👩‍👧',
    name: 'Gói Gia Đình',
    quantity: '6 lọ · phù hợp nhà 50–100m²',
    price: '328.000đ',
    originalPrice: '498.000đ',
    savings: 'Tiết kiệm 170.000đ',
  },
  combo3: {
    emoji: '🏢',
    name: 'Gói Nhà Lớn',
    quantity: '9 lọ · phù hợp nhà >100m²',
    price: '497.000đ',
    originalPrice: '747.000đ',
    savings: 'Tiết kiệm 250.000đ',
  },
};

const SuccessModal = ({ customerName, onClose, selectedCombo }: { customerName: string; onClose: () => void; selectedCombo?: string }) => {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      key="success-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      {/* Wrapper cho phép scroll khi modal cao hơn màn hình */}
      <div className="flex min-h-full items-center justify-center p-4">
      <motion.div
        key="success-modal-card"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh]"
      >
        {/* Header xanh */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 pt-6 pb-5 text-center flex-shrink-0">
          <div className="w-16 h-16 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white/40">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
            ĐẶT HÀNG THÀNH CÔNG!
          </h2>
          {customerName && (
            <p className="text-green-100 text-sm font-medium mt-1">Cảm ơn <strong className="text-white">{customerName}</strong> đã tin tưởng Samurai 🙏</p>
          )}
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5 space-y-3 overflow-y-auto flex-1">

          {/* Combo info */}
          {selectedCombo && (() => {
            const detail = COMBO_SUCCESS_DETAILS[selectedCombo];
            if (!detail) return null;
            return (
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">✅ Sản phẩm đã đặt</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl leading-none flex-shrink-0">{detail.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-xl leading-tight">{detail.name}</p>
                    <p className="text-slate-500 text-sm mt-1">{detail.quantity}</p>
                  </div>
                </div>
                <div className="border-t border-green-200 pt-3 flex items-end justify-between">
                  <div>
                    <p className="text-slate-500 text-sm mb-0.5">Thành tiền</p>
                    <p className="text-2xl font-black text-green-700 leading-none">{detail.price}</p>
                    {detail.originalPrice && (
                      <p className="text-slate-400 text-sm mt-0.5 line-through">{detail.originalPrice}</p>
                    )}
                  </div>
                  {detail.savings && (
                    <span className="bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-full">
                      🎉 {detail.savings}
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Thông báo 24h */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4 flex gap-3 items-start">
            <span className="text-2xl leading-none flex-shrink-0 mt-0.5">⏰</span>
            <div>
              <p className="font-black text-slate-800 text-lg leading-snug">
                Nhân viên gọi xác nhận trong <span className="text-amber-600">24 giờ</span>
              </p>
              <p className="text-slate-600 text-base mt-1 leading-snug">
                Kèm thông báo thời gian giao hàng cụ thể đến tận nhà bạn.
              </p>
            </div>
          </div>

          {/* Chú ý điện thoại */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-center">
            <span className="text-2xl leading-none flex-shrink-0">📵</span>
            <p className="font-bold text-red-700 text-base leading-snug">
              Vui lòng <span className="underline decoration-dotted">chú ý điện thoại</span> để không bỏ lỡ cuộc gọi xác nhận đơn hàng
            </p>
          </div>

          {/* Nút Đóng - Primary (Nổi bật) */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black text-xl hover:from-slate-900 hover:to-slate-950 active:scale-95 transition-all shadow-lg shadow-slate-800/30"
          >
            Đóng
          </button>

          {/* Zalo Support - Secondary (Nhỏ, không nổi bật) */}
          <div className="text-center pt-0.5">
            <p className="text-slate-500 text-sm mb-1.5">Cần hỗ trợ?</p>
            <a
              href="https://zalo.me/0842717266"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-slate-600 font-semibold text-base"
            >
              💬 Nhắn Zalo hỗ trợ
            </a>
            <p className="text-slate-500 text-sm mt-1.5">T2 - T7: 8h30 - 16h30</p>
          </div>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Confirm Order Modal ──────────────────────────────────────────────────────
const ConfirmOrderModal = ({
  data,
  onConfirm,
  onEdit,
}: {
  data: any;
  onConfirm: () => void;
  onEdit: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const comboLabel: Record<string, string> = {
    combo1: '🏠 Gói Nhà Nhỏ – 3 lọ – 249.000đ',
    combo2: '👨‍👩‍👧 Gói Gia Đình – 6 lọ – 328.000đ',
    combo3: '🏢 Gói Nhà Lớn – 9 lọ – 497.000đ',
  };

  return (
    <motion.div
      key="confirm-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.60)' }}
    >
      <motion.div
        key="confirm-card"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full sm:max-w-sm sm:mx-4 sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-white border-b-2 border-emerald-100 px-5 pt-5 pb-4 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-emerald-200">
            <svg className="w-6 h-6" style={{ color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black leading-tight" style={{ color: '#059669' }}>Xác nhận đặt hàng</h2>
          <p className="text-slate-500 text-base mt-1.5 font-medium leading-snug">Đơn sẽ được xử lý ngay sau khi bạn xác nhận</p>
        </div>

        {/* Body */}
        <div className="px-4 pt-4 pb-5 space-y-3">

          {/* Phone – nổi bật nhất */}
          <div className="bg-emerald-50 border-2 rounded-2xl px-4 py-4 text-center" style={{ borderColor: '#6EE7B7' }}>
            <p className="text-base font-bold uppercase tracking-wide mb-2" style={{ color: '#059669' }}>Số điện thoại nhận cuộc gọi</p>
            <p className="text-5xl font-black text-slate-900 tracking-wide tabular-nums leading-none">{data.phone}</p>
          </div>

          {/* Cảnh báo nhân viên gọi lại – riêng, nổi bật */}
          <div className="rounded-2xl border-2 px-4 py-3.5 text-center" style={{ borderColor: '#D4B17A', backgroundColor: '#FDF8F0' }}>
            <p className="text-base font-black leading-snug" style={{ color: '#92400e' }}>
              📞 Nhân viên sẽ gọi xác nhận trước khi gửi hàng.
            </p>
            <p className="text-sm font-bold mt-1 leading-snug" style={{ color: '#b45309' }}>
              Vui lòng nghe máy để đơn được giao sớm nhất.
            </p>
          </div>

          {/* Name + Address + Combo */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 space-y-3 text-base">
            <div className="flex gap-2.5">
              <span className="text-slate-600 w-20 flex-shrink-0 font-medium">Họ tên</span>
              <span className="font-bold text-slate-800 flex-1">{data.name}</span>
            </div>
            <div className="flex gap-2.5">
              <span className="text-slate-600 w-20 flex-shrink-0 font-medium">Địa chỉ</span>
              <span className="font-semibold text-slate-700 flex-1 leading-snug">{data.address}</span>
            </div>
            <div className="flex gap-2.5">
              <span className="text-slate-600 w-20 flex-shrink-0 font-medium">Sản phẩm</span>
              <span className="font-bold text-slate-800 flex-1">{comboLabel[data.combo] ?? data.combo}</span>
            </div>
          </div>

          {/* Nhắc chưa gửi */}
          <p className="text-center text-base font-black leading-snug" style={{ color: '#EA580C' }}>⚠️ Bấm xác nhận để hoàn tất đơn hàng</p>

          {/* Buttons */}
          <button
            onClick={onConfirm}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-2xl hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-7 h-7 flex-shrink-0" />
            Xác nhận đặt hàng
          </button>

          <button
            onClick={onEdit}
            className="w-full py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-bold text-xl hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Sửa lại thông tin
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PolicyModal = ({ type, onClose }: { type: string, onClose: () => void }) => {
  const content: any = {
    privacy: {
      title: "Chính sách bảo mật thông tin",
      body: (
        <div className="space-y-4 text-sm text-slate-600">
          <p>Chào mừng bạn đến với Samurai Japan. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn.</p>
          <h5 className="font-bold text-slate-900">1. Thu thập thông tin</h5>
          <p>Chúng tôi thu thập thông tin cá nhân (tên, số điện thoại, địa chỉ) chỉ nhằm mục đích xử lý đơn hàng và hỗ trợ khách hàng.</p>
          <h5 className="font-bold text-slate-900">2. Công nghệ theo dõi</h5>
          <p>Trang web sử dụng Google Tag Manager, GA4 và Meta Pixel để phân tích hành vi người dùng và tối ưu hóa quảng cáo. Dữ liệu này là ẩn danh và không chứa thông tin nhận dạng cá nhân trực tiếp.</p>
          <h5 className="font-bold text-slate-900">3. Bảo mật</h5>
          <p>Thông tin của bạn được lưu trữ an toàn và không bao giờ được chia sẻ với bên thứ ba cho mục đích thương mại.</p>
        </div>
      )
    },
    terms: {
      title: "Điều khoản dịch vụ",
      body: (
        <div className="space-y-4 text-sm text-slate-600">
          <p>Bằng việc đặt hàng tại website, bạn đồng ý với các điều khoản sau:</p>
          <h5 className="font-bold text-slate-900">1. Đặt hàng</h5>
          <p>Thông tin đặt hàng phải chính xác để đảm bảo việc giao hàng không bị gián đoạn.</p>
          <h5 className="font-bold text-slate-900">2. Hiệu quả sản phẩm</h5>
          <p>Hiệu quả của thuốc Samurai phụ thuộc vào việc sử dụng đúng hướng dẫn kỹ thuật. Chúng tôi cam kết cung cấp sản phẩm chính hãng với nồng độ hoạt chất tiêu chuẩn Nhật Bản để đạt kết quả tối ưu nhất khi được sử dụng đúng cách.</p>
          <h5 className="font-bold text-slate-900">3. Trách nhiệm người dùng</h5>
          <p>Người dùng cần đọc kỹ hướng dẫn sử dụng và tuân thủ các quy tắc an toàn sinh học được in trên bao bì.</p>
        </div>
      )
    },
    warranty: {
      title: "Cam kết Chất lượng & Đổi trả",
      body: (
        <div className="space-y-4 text-sm text-slate-600">
          <h5 className="font-bold text-slate-900">1. Cam kết chất lượng</h5>
          <p>Chúng tôi cam kết sản phẩm Samurai là hàng chính hãng công nghệ Nhật Bản, đạt tiêu chuẩn kiểm định nghiêm ngặt. Hiệu quả diệt mối đã được chứng minh qua hàng ngàn khách hàng trên toàn quốc.</p>
          <h5 className="font-bold text-slate-900">2. Chính sách đổi trả</h5>
          <ul className="list-disc pl-5 space-y-2">
            <li>Hỗ trợ đổi mới 100% nếu sản phẩm bị lỗi do nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển.</li>
            <li>Khách hàng được kiểm tra hàng trước khi thanh toán để đảm bảo quyền lợi tuyệt đối.</li>
          </ul>
          <h5 className="font-bold text-slate-900">3. Hỗ trợ kỹ thuật</h5>
          <p>Đội ngũ chuyên gia luôn sẵn sàng hướng dẫn bạn cách xịt thuốc sao cho đạt hiệu quả diệt tận gốc cao nhất. Chúng tôi đồng hành cùng bạn cho đến khi tổ mối bị tiêu diệt hoàn toàn.</p>
        </div>
      )
    },
    shipping: {
      title: "Chính sách vận chuyển",
      body: (
        <div className="space-y-4 text-sm text-slate-600">
          <h5 className="font-bold text-slate-900">1. Thời gian giao hàng</h5>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Nội thành TP. HCM:</strong> 2 - 3 ngày làm việc kể từ khi xác nhận đơn hàng thành công.</li>
            <li><strong>Các tỉnh thành khác:</strong> 3 - 5 ngày làm việc tùy vào khu vực địa lý.</li>
          </ul>
          <h5 className="font-bold text-slate-900">2. Phí vận chuyển</h5>
          <p>Chúng tôi áp dụng chính sách <strong>Miễn phí vận chuyển (Free Ship)</strong> cho tất cả các đơn hàng trên toàn quốc.</p>
          <h5 className="font-bold text-slate-900">3. Theo dõi đơn hàng</h5>
          <p>Sau khi gửi hàng, nhân viên tư vấn sẽ liên hệ thông báo mã vận đơn để bạn tiện theo dõi hành trình đơn hàng.</p>
        </div>
      )
    }
  };

  const modalData = content[type];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[24px] md:rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden flex flex-col mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 relative">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 uppercase tracking-tight pr-8">{modalData.title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors absolute right-4 top-4 md:static">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto">
          {modalData.body}
        </div>
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 text-center">
          <button onClick={onClose} className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-sm">ĐÃ HIỂU</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Testimonials data (defined once, reused for mobile & desktop) ──
const REVIEWS = [
  { name: "Bác Hùng",  age: 62, loc: "Hà Nội",    combo: "Combo Gia Đình",  avatar: "/hungmin.webp",  rating: 5, photo: "/xm1min.webp", photoSmall: "/xm1minnew.webp", text: "Nhà tôi dùng nhiều loại rồi mối vẫn cứ đục. Từ ngày rải Samurai vào khe gỗ thấy im hẳn, hiệu quả rõ sau 5 ngày. Rất hài lòng!" },
  { name: "Cô Lan",    age: 55, loc: "TP. HCM",   combo: "Combo Gia Đình",  avatar: "/colanmin.webp",   rating: 4, photo: "/xm2min.webp", photoSmall: "/xm2minnew.webp", text: "Không mùi hôi như mấy loại ngoài chợ, nhà có cháu nhỏ nên tôi yên tâm. Cách dùng đơn giản, phụ nữ như tôi tự làm được." },
  { name: "Anh Tuấn",  age: 45, loc: "Đà Nẵng",  combo: "Combo Nhà Nhỏ", avatar: "/anhtuanmin.webp",  rating: 5, photo: "/nhanhang3min.webp", text: "Giao hàng nhanh, đóng gói cẩn thận. Mua combo 6 lọ dùng cho cả nhà và biếu ông bà nội. Hiệu quả rõ rệt sau 1 tuần." },
  { name: "Bác Minh",  age: 58, loc: "Cần Thơ",   combo: "Combo Nhà Lớn",  avatar: "/bacminhmin.webp",  rating: 4, photo: "/xm4min.webp", text: "Nhà gỗ cũ mối ăn nhiều năm, tôi đặt bột Samurai vào các khe tủ và chân cầu thang. Sau 1 tuần không còn thấy mối bò ra nữa." },
  { name: "Cô Hoa",    age: 51, loc: "Hải Phòng", combo: "Combo Gia Đình",  avatar: "/cohoamin.webp",   rating: 5, photo: "/xm5min.webp", text: "Sợ nhất là thuốc độc hại cho cháu nội, nhưng loại này an toàn thật, không mùi. Rắc bột vào xong sinh hoạt bình thường, không cần tránh mặt." },
  { name: "Chú Thành", age: 64, loc: "Bình Dương",combo: "Combo Gia Đình",  avatar: "/chuthanhmin.webp", rating: 4, photo: "/xm6min.webp", photoSmall: "/xm6minnew.webp", text: "Trước hay gọi thợ mỗi lần mấy triệu mà mối vẫn quay lại. Dùng Samurai tự xử lý được, tiết kiệm hơn nhiều mà hiệu quả hơn hẳn." },
  { name: "Chị Nga",   age: 47, loc: "Đồng Nai",  combo: "Combo Nhà Nhỏ", avatar: "/chingamin.webp",   rating: 5, photo: "/xm7min.webp", text: "Nhà có 2 con mèo nên lo lắng lắm. Sử dụng Samurai thấy an toàn hoàn toàn, mèo không bị gì. Mối trong tủ quần áo giảm hẳn sau vài ngày." },
  { name: "Bác Sơn",   age: 60, loc: "Quảng Nam", combo: "Combo Nhà Lớn",  avatar: "/bacsonmin.webp",   rating: 4, photo: "/xm8min.webp", text: "Mối trong tường nhà khó xử lý lắm. Tôi rải bột vào các vết nứt và đường mối đi qua. Khoảng 10 ngày sau không còn thấy đường mối nữa." },
  { name: "Cô Mai",    age: 53, loc: "Vũng Tàu",  combo: "Combo Gia Đình",  avatar: "/comaimin.webp",   rating: 5, photo: "/nhanhang4min.webp", text: "Mua về dùng thấy hiệu quả nên biếu thêm cho hàng xóm. Ai cũng khen dễ dùng và hiệu quả. Giá cả phải chăng, freeship tận nhà." },
];

// ── FAQ data (accordion) ──
const FAQS = [
  {
    q: "Thuốc Samurai dạng gì? Dùng có khó không?",
    a: "Bột khô, mở nắp là rắc được.\nKhông cần pha chế hay dụng cụ.\nAi cũng tự làm được tại nhà.\nTiết kiệm tiền so với gọi thợ.",
  },
  {
    q: "Sau khi rắc thuốc xong thì làm gì tiếp?",
    a: "Chờ 3 - 7 ngày mối mắc bệnh lây lan cho cả tổ và mối chúa.\nQuét dọn xong – không mùi.\nĐơn giản, không phức tạp.",
  },
  {
    q: "Giao hàng mất bao lâu? Có tốn phí ship không?",
    a: "Giao 3–5 ngày, toàn quốc.\nMiễn phí giao hàng 100%, không tốn phí.\nĐặt hôm nay, nhà bạn sớm sạch.",
  },
  {
    q: "Tôi được kiểm tra hàng trước khi trả tiền không?",
    a: "Có, mở hộp kiểm tra trước.\nChỉ trả tiền khi hài lòng.\nCOD – kiểm tra trước thanh toán.",
  },
  {
    q: "Thuốc có an toàn cho trẻ nhỏ và thú cưng không?",
    a: "Tiêu chuẩn Nhật Bản, an toàn sử dụng.\nKhông mùi, không độc hại.\nGia đình sinh hoạt bình thường.\nTrẻ em & thú cưng không bị ảnh hưởng.",
  },
  {
    q: "Một lọ dùng được bao nhiêu? Nhà tôi cần mấy lọ?",
    a: "1 lọ (7g) = 1–2 điểm mối.\nCombo rẻ hơn 50% lẻ.\nChọn Combo Gia Đình tiết kiệm.",
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [selectedCombo, setSelectedCombo] = useState('combo2');
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [stockRemaining, setStockRemaining] = useState(8);
  const [countdownToMidnight, setCountdownToMidnight] = useState('');
  const [midnightCountdownSecs, setMidnightCountdownSecs] = useState(0);
  const [upsellApplied, setUpsellApplied] = useState(false);
  // Capture UTM params – fallback sessionStorage phòng redirect drop UTM (www ↔ non-www)
  const _rawSource   = new URLSearchParams(window.location.search).get('utm_source')   ?? '';
  const _rawCampaign = new URLSearchParams(window.location.search).get('utm_campaign') ?? '';
  const _utmSource   = _rawSource   || sessionStorage.getItem('utm_source')   || '';
  const _utmCampaign = _rawCampaign || sessionStorage.getItem('utm_campaign') || '';
  if (_utmSource)   sessionStorage.setItem('utm_source',   _utmSource);
  if (_utmCampaign) sessionStorage.setItem('utm_campaign', _utmCampaign);
  const utmRef = useRef({ source: _utmSource, campaign: _utmCampaign });
  const nameStepRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Tồn kho Gói Gia Đình – tự giảm theo giờ Việt Nam (UTC+7), hết lúc 12h đêm
  useEffect(() => {
    const calcStock = () => {
      const nowUTC = new Date();
      const vnHour = (nowUTC.getUTCHours() + 7) % 24;
      const vnMinute = nowUTC.getUTCMinutes();
      const vnTotalMins = vnHour * 60 + vnMinute;
      // 8 suất, giảm dần theo khung giờ
      let stock = 8;
      if (vnTotalMins >= 6 * 60)  stock = 7;
      if (vnTotalMins >= 9 * 60)  stock = 5;
      if (vnTotalMins >= 12 * 60) stock = 4;
      if (vnTotalMins >= 15 * 60) stock = 3;
      if (vnTotalMins >= 17 * 60) stock = 2;
      if (vnTotalMins >= 20 * 60) stock = 1;
      setStockRemaining(stock);
      // Đếm ngược đến 12h đêm VN (hiển thị dạng chữ)
      const minsLeft = 24 * 60 - vnTotalMins;
      const hLeft = Math.floor(minsLeft / 60);
      const mLeft = minsLeft % 60;
      setCountdownToMidnight(`${hLeft}h${mLeft < 10 ? '0' : ''}${mLeft}p`);
    };
    calcStock();
    const id = setInterval(calcStock, 60_000);
    return () => clearInterval(id);
  }, []);

  // Countdown đến 12h đêm VN – đếm từng giây cho form CTA
  useEffect(() => {
    const calcSecs = () => {
      const nowUTC = new Date();
      const midnight = new Date(nowUTC);
      midnight.setUTCHours(17, 0, 0, 0); // 17:00 UTC = 00:00 VN
      if (nowUTC.getUTCHours() >= 17) {
        midnight.setUTCDate(midnight.getUTCDate() + 1);
      }
      const diff = Math.max(0, Math.floor((midnight.getTime() - nowUTC.getTime()) / 1000));
      setMidnightCountdownSecs(diff);
    };
    calcSecs();
    const id = setInterval(calcSecs, 1000);
    return () => clearInterval(id);
  }, []);

  const formatMidnight = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0'),
    };
  };

  // Handle floating CTA visibility based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const pricingSection = document.getElementById('pricing');
      if (!pricingSection) return;

      const pricingRect = pricingSection.getBoundingClientRect();
      // Show button when pricing section is below viewport (user hasn't reached it yet)
      const shouldShow = pricingRect.top > window.innerHeight;
      setShowFloatingCTA(shouldShow);
    };

    // Call once on mount to initialize
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = async (data: any) => {

    // Tạo đơn ngay với trạng thái Mới (status: 0) trước khi hiện modal
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, utm_source: utmRef.current.source, utm_campaign: utmRef.current.campaign }),
      });
      const result = await res.json();
      if (result.ok) {
        setPendingOrderData(data);
        setPendingOrderId(result.orderId);
        setSubmitStatus('idle');
        setShowConfirmModal(true);
      } else {
        setSubmitError(result.message || 'Lỗi không xác định, vui lòng thử lại.');
        setSubmitStatus('error');
      }
    } catch {
      setSubmitError('Không thể kết nối, vui lòng kiểm tra mạng và thử lại.');
      setSubmitStatus('error');
    }
  };

  const handleConfirmOrder = async () => {
    if (!pendingOrderData || !pendingOrderId) return;
    setShowConfirmModal(false);
    const data = pendingOrderData;
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      // Xác nhận đơn – update Pancake POS lên trạng thái Đã xác nhận (status: 1)
      const res = await fetch('/api/order/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: pendingOrderId,
          combo: data.combo,
          name: data.name,
          phone: data.phone,
          address: data.address,
        }),
      });
      const result = await res.json();
      if (result.ok) {
        setSubmitStatus('success');
        setOrderCustomerName(data.name || '');
        setShowSuccessModal(true);
      } else {
        setSubmitError(result.message || 'Lỗi không xác định, vui lòng thử lại.');
        setSubmitStatus('error');
      }
    } catch {
      setSubmitError('Không thể kết nối, vui lòng kiểm tra mạng và thử lại.');
      setSubmitStatus('error');
    }
  };

  const scrollToOrder = () => {
    document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToOrderWithCombo = (comboValue: string) => {
    setSelectedCombo(comboValue);
    setValue('combo', comboValue);
    setTimeout(() => {
      document.getElementById('combo-step')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToComparison = () => {
    document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Testimonials carousel (mobile auto-scroll) ──
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const isPausedRef = useRef(false);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current || !carouselRef.current) return;
      const next = (activeIndexRef.current + 1) % REVIEWS.length;
      activeIndexRef.current = next;
      setActiveDot(next);
      const container = carouselRef.current;
      const cardWidth = container.scrollWidth / REVIEWS.length;
      container.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Touch: pause while finger down, resume immediately on lift (manual swipe still works)
  const handleCarouselTouchStart = () => { isPausedRef.current = true; };
  const handleCarouselTouchEnd = () => { isPausedRef.current = false; };

  // Sync dots when user manually scrolls
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.scrollWidth / REVIEWS.length;
    const index = Math.round(container.scrollLeft / cardWidth);
    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveDot(index);
    }
  };

  // < > buttons: jump + pause permanently (no resume)
  const jumpToReview = (i: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.scrollWidth / REVIEWS.length;
    container.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    activeIndexRef.current = i;
    setActiveDot(i);
    isPausedRef.current = true; // permanent stop
  };

  // Social Proof Notifications
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const notifications = [
    { name: "Anh Thanh", loc: "Hà Nội", combo: "Gói Gia Đình (6 lọ)", time: "5 phút trước" },
    { name: "Chị Lan", loc: "TP. Hồ Chí Minh", combo: "Gói Nhà Nhỏ (3 lọ)", time: "15 phút trước" },
    { name: "Bác Hùng", loc: "Đà Nẵng", combo: "Gói Nhà Lớn (9 lọ)", time: "30 phút trước" },
    { name: "Cô Mai", loc: "Hải Phòng", combo: "Gói Gia Đình (6 lọ)", time: "45 phút trước" },
    { name: "Anh Tuấn", loc: "Cần Thơ", combo: "Gói Nhà Nhỏ (3 lọ)", time: "1 giờ trước" },
    { name: "Chị Hoa", loc: "Bình Dương", combo: "Gói Gia Đình (6 lọ)", time: "20 phút trước" },
    { name: "Bác Nam", loc: "Đồng Nai", combo: "Gói Nhà Lớn (9 lọ)", time: "40 phút trước" },
    { name: "Chị Phượng", loc: "Nghệ An", combo: "Gói Nhà Nhỏ (3 lọ)", time: "10 phút trước" },
    { name: "Chú Bình", loc: "Quảng Nam", combo: "Gói Gia Đình (6 lọ)", time: "35 phút trước" },
    { name: "Bà Liên", loc: "Vũng Tàu", combo: "Gói Nhà Lớn (9 lọ)", time: "50 phút trước" },
    { name: "Anh Dũng", loc: "Huế", combo: "Gói Nhà Nhỏ (3 lọ)", time: "25 phút trước" },
    { name: "Chị Thảo", loc: "Long An", combo: "Gói Gia Đình (6 lọ)", time: "1 giờ trước" },
  ];

  useEffect(() => {
    const showRandomNotification = () => {
      const randomIdx = Math.floor(Math.random() * notifications.length);
      setCurrentNotification(notifications[randomIdx]);

      // Show notification for 6 seconds (not too crowded)
      setTimeout(() => {
        setCurrentNotification(null);
      }, 6000);
    };

    // Initial delay: 4 seconds
    const initialTimeout = setTimeout(showRandomNotification, 4000);

    // Repeat every 22 seconds (not too frequent)
    const interval = setInterval(() => {
      showRandomNotification();
    }, 22000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal
            customerName={orderCustomerName}
            selectedCombo={selectedCombo}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Confirm Order Modal */}
      <AnimatePresence>
        {showConfirmModal && pendingOrderData && (
          <ConfirmOrderModal
            data={pendingOrderData}
            onConfirm={handleConfirmOrder}
            onEdit={() => setShowConfirmModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Policy Modals */}
      <AnimatePresence>
        {activeModal && <PolicyModal type={activeModal} onClose={() => setActiveModal(null)} />}
      </AnimatePresence>

      {/* Social Proof Popup */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[52px] md:top-auto md:bottom-8 left-4 z-[60] bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2.5 flex items-center gap-2.5 max-w-[252px] md:max-w-[300px]"
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 leading-tight truncate">
                {currentNotification.name} · {currentNotification.loc} · {currentNotification.time}
              </p>
              <p className="text-sm font-bold text-emerald-700 leading-snug">
                {currentNotification.combo}
              </p>
            </div>
            <button onClick={() => setCurrentNotification(null)} className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-2 -mr-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 md:h-16">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-1.5 md:gap-2 hover:opacity-75 transition-opacity">
              <img src="/pslogo.webp" alt="PestShield Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-lg cursor-pointer" width={40} height={40} loading="eager" />
              <span className="text-base md:text-xl font-bold tracking-tighter text-slate-900 cursor-pointer leading-tight">Thuốc Xịt Muỗi <span className="text-emerald-600">PestShield</span></span>
            </button>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase tracking-wider">
              <button onClick={() => document.getElementById('how-samurai')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">Ưu điểm</button>
              <button onClick={() => document.getElementById('usage-guide')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">Cách Sử Dụng</button>
              <button onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">So Sánh Chi Phí</button>
              <button onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">Phản hồi</button>
              <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">Câu Hỏi</button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
              >
                ĐẶT HÀNG NGAY
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 flex items-center justify-center min-w-[44px] min-h-[44px]">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-200 fixed top-16 left-0 right-0 z-40 shadow-xl"
          >
            <div className="px-4 pt-1 pb-4 space-y-0">
              <button onClick={() => { document.getElementById('how-samurai')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3.5 text-base font-medium border-b border-slate-100">Ưu điểm vượt trội</button>
              <button onClick={() => { document.getElementById('usage-guide')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3.5 text-base font-medium border-b border-slate-100">Cách Sử Dụng</button>
              <button onClick={() => { document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3.5 text-base font-medium border-b border-slate-100">So Sánh Chi Phí</button>
              <button onClick={() => { document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3.5 text-base font-medium border-b border-slate-100">Khách hàng nói gì?</button>
              <button onClick={() => { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3.5 text-base font-medium border-b border-slate-100">Câu Hỏi Thường Gặp</button>
              <button
                onClick={() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}
                className="w-full mt-3 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg"
              >
                ĐẶT HÀNG NGAY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-6 pb-8 lg:pt-24 lg:pb-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Text Block */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left order-1 lg:order-1"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold mb-5 bg-emerald-50 border-emerald-400 text-emerald-800">
                  <span className="flex h-2 w-2 rounded-full animate-pulse bg-emerald-500"></span>
                  Chiết xuất thiên nhiên — an toàn cho trẻ em &amp; thú cưng
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.2] mb-3 tracking-tight">
                  Xịt Hoài Vẫn Còn Muỗi?<br />
                  <span className="text-emerald-600">1 Lần Xịt — Sạch 6 Tháng.</span>
                </h1>
                {/* Hero Image chỉ hiện dưới tiêu đề trên mobile, ẩn trên desktop */}
                <div className="block lg:hidden mb-6">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-[40px] blur-3xl" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}></div>
                    <img
                      src="/heromobile.webp"
                      srcSet="/heromobile.webp 400w, /heroimgdesktop.webp 1024w"
                      sizes="(max-width: 640px) 100vw, 384px"
                      alt="Thuốc Xịt Muỗi PestShield"
                      className="relative rounded-3xl shadow-2xl border-4 border-white object-cover w-full max-w-sm mx-auto aspect-square"
                      style={{objectPosition: 'center center'}}
                      loading="eager"
                      fetchPriority="high"
                      width={1024}
                      height={1024}
                    />
                    {/* Badge trên – góc trên trái */}
                    <div className="absolute top-3 left-3 bg-white px-3 py-2 rounded-2xl shadow-xl border-l-4 border-emerald-500 z-10">
                      <p className="font-black text-sm leading-tight text-emerald-700">🛡️ Thiên Nhiên 100%</p>
                      <p className="font-medium text-xs text-slate-500 leading-tight">An toàn cho trẻ em &amp; thú cưng</p>
                    </div>
                    {/* Badge dưới – góc dưới phải */}
                    <div className="absolute bottom-3 right-3 bg-orange-500 px-3 py-2 rounded-2xl shadow-xl z-10">
                      <p className="text-white font-black text-sm leading-tight">⚡ Hiệu Lực 6 Tháng</p>
                      <p className="text-yellow-100 font-medium text-xs leading-tight">Xịt 1 lần — không làm lại</p>
                    </div>
                  </div>
                </div>
                {/* Main Subtitle */}
                <p className="text-base sm:text-lg font-semibold text-slate-800 mb-5 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Muỗi, gián, kiến, ruồi — 1 chai xử lý hết, an toàn cho cả nhà.
                </p>

                {/* Benefits List */}
                <div className="flex flex-col gap-2.5 max-w-md mx-auto lg:mx-0 mb-6">
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">Tiếp xúc bị tiêu diệt ngay - Không cần xịt trúng</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">Xịt 1 lần — hiệu lực 6 tháng, không làm lại</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">Sinh học, không mùi — an toàn cả nhà</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">Tiết kiệm hơn dịch vụ &amp; nhang xịt thường</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-10 justify-center lg:justify-start">
                  <button
                    onClick={scrollToOrder}
                    className="group flex items-center justify-center gap-3 bg-orange-500 text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-orange-600 transition-all shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
                  >
                    <ShoppingCart className="w-6 h-6 flex-shrink-0" />
                    <span className="block leading-snug text-left">
                      <span className="block text-xl font-black tracking-tight">Đặt Combo 2 Chai — Bảo Vệ Cả Năm</span>
                      <small className="block text-sm font-medium text-yellow-100 mt-0.5">Tiết kiệm 120.000đ · Xịt 1 lần · Không lo 6 tháng</small>
                    </span>
                    <ChevronRight className="w-6 h-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-3 px-4 py-2 justify-center">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <img
                          key={i}
                          src={`/customers/${i}min.webp`}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white shadow-md object-cover object-top flex-shrink-0"
                          alt={`Khách hàng ${i}`}
                          loading="eager"
                          width={44}
                          height={44}
                          draggable={false}
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-sm font-bold text-slate-600">14,800+ gia đình đã tin dùng</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Hero Image Block - chỉ hiện trên desktop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative mt-8 lg:mt-0 order-3 lg:order-2 hidden lg:block"
              >
                <div className="absolute -inset-4 rounded-[40px] blur-3xl" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}></div>
                <img
                  src="/heroimgdesktop.webp"
                  srcSet="/heromobile.webp 400w, /heroimgdesktop.webp 1024w"
                  sizes="(max-width: 1024px) 400px, 512px"
                  alt="Thuốc Xịt Muỗi PestShield"
                  className="relative rounded-3xl shadow-2xl border-4 border-white object-cover w-full max-w-lg mx-auto aspect-square"
                  style={{objectPosition: 'center center'}}
                  loading="eager"
                  fetchPriority="high"
                  width={1024}
                  height={1024}
                />
                {/* Badge trên – góc trên trái */}
                <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-2xl shadow-xl border-l-4 border-emerald-500 z-10">
                  <p className="font-black text-base leading-tight text-emerald-700">🛡️ Thiên Nhiên 100%</p>
                  <p className="font-medium text-sm text-slate-500 leading-tight">An toàn cho trẻ em &amp; thú cưng</p>
                </div>
                {/* Badge dưới – góc dưới phải */}
                <div className="absolute bottom-4 right-4 bg-orange-500 px-4 py-3 rounded-2xl shadow-xl z-10">
                  <p className="text-white font-black text-base leading-tight">⚡ Hiệu Lực 6 Tháng</p>
                  <p className="text-yellow-100 font-medium text-sm leading-tight">Xịt 1 lần — không làm lại</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section id="benefits" className="py-10 md:py-20 bg-emerald-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Muỗi, Gián, Kiến Trong Nhà — Tưởng Nhỏ, Hậu Quả Không Nhỏ</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {[
                {
                  title: "Xịt hoài không hết — tốn tiền không thấy đâu",
                  line1: "Chai xịt thường, nhang muỗi, dịch vụ phun —",
                  line2: "mua đi mua lại mà Muỗi và côn trùng vẫn quay lại sau vài ngày.",
                  img: "/card1.webp", imgW: 1377, imgH: 769,
                  highlight: false
                },
                {
                  title: "Muỗi đốt ban đêm — cả nhà mất ngủ, lo bệnh",
                  line1: "Sốt xuất huyết, virus zika — muỗi là nguồn",
                  line2: "lây chính. Một đêm bị đốt là một đêm không yên.",
                  img: "/muoidotbedesktop.webp", imgW: 771, imgH: 461,
                  highlight: true
                },
                {
                  title: "Gián, kiến bò vào bếp — mất vệ sinh, khó chịu",
                  line1: "Thức ăn bị nhiễm, trẻ con bò sàn —",
                  line2: "không xử lý tận gốc thì không bao giờ hết hẳn.",
                  img: "/giantubepdesktop.webp", imgW: 1001, imgH: 501,
                  highlight: false
                }
              ].map((item, idx) => (
                <div key={idx} className={`rounded-2xl overflow-hidden shadow-md border group hover:shadow-xl transition-all flex flex-col h-full ${
                  item.highlight
                    ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-400 ring-offset-2'
                    : 'bg-white border-slate-100'
                }`}>
                  <div className="overflow-hidden aspect-video">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 will-change-transform" loading="lazy" decoding="async" width={item.imgW} height={item.imgH} />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    {item.highlight && (
                      <span className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-1 rounded-full w-fit">Quan trọng nhất</span>
                    )}
                    <h3 className={`text-lg md:text-xl font-bold mb-3 flex items-start gap-2 ${item.highlight ? 'text-orange-700' : ''}`}>
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.highlight ? 'text-orange-600' : 'text-orange-400'}`} />
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed flex-grow">
                      {item.line1}<br />{item.line2}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center mt-10 text-base md:text-lg font-semibold text-slate-700 max-w-2xl mx-auto">
              Xử lý đúng cách từ đầu — tiết kiệm tiền, bảo vệ sức khoẻ cả nhà.
            </p>
            <div className="flex flex-col items-center mt-6 gap-2">
              <button
                onClick={scrollToPricing}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base md:text-lg px-7 py-3 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all duration-200"
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-yellow-300" />
                Xử Lý Ngay Hôm Nay
              </button>
              <span className="text-xs text-slate-500 font-medium">Giao hàng toàn quốc · Dùng được ngay · Không cần thợ</span>
            </div>
          </div>
        </section>

        {/* Why Samurai Section */}
        <section id="how-samurai" className="py-12 md:py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div className="hidden lg:block order-1 relative">
                <div className="absolute -inset-4 bg-emerald-100 rounded-[40px] blur-2xl opacity-50"></div>
                <div className="relative rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                  <img
                    src="/baovetoanbo.webp"
                    alt="Thuốc xịt muỗi PestShield – bảo vệ toàn bộ không gian sống"
                    className="w-full h-auto block"
                    loading="lazy"
                    width={1501}
                    height={1501}
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 lg:mb-8 text-center lg:text-left">Tại Sao Xịt 1 Lần Mà Hiệu Lực 6 Tháng?</h2>

                {/* Mobile Image - Product Showcase */}
                <div className="lg:hidden mb-6 relative">
                  <div className="absolute -inset-3 bg-emerald-100 rounded-3xl blur-2xl opacity-40"></div>
                  <div className="relative rounded-3xl shadow-xl w-full max-w-sm mx-auto overflow-hidden">
                    <img
                      src="/baovetoanbo.webp"
                      alt="Thuốc xịt muỗi PestShield – bảo vệ toàn bộ không gian sống"
                      className="w-full h-auto block"
                      loading="lazy"
                      width={1501}
                      height={1501}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                  {[
                    {
                      icon: <Zap className="w-6 h-6 text-yellow-500" />,
                      title: "Không xịt trúng — vẫn hiệu quả",
                      desc: "Xịt vào góc nhà, chân tường, cửa ra vào.\nMuỗi và côn trùng bò qua vùng xịt là tê liệt.\nKhông cần rượt theo từng con."
                    },
                    {
                      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
                      title: "Bám dính 6 tháng — không bay hơi như chai thường",
                      desc: "Hoạt chất bám chắc vào bề mặt, không bốc hơi,\nkhông cần xịt lại. Mưa không trôi, quạt không bay."
                    },
                    {
                      icon: <Leaf className="w-6 h-6 text-emerald-500" />,
                      title: "Thiên nhiên — không mùi sau 30 phút",
                      desc: "Chiết xuất thực vật, khô hoàn toàn sau 30 phút.\nKhông độc, không mùi — trẻ bò sàn, thú cưng ở nhà bình thường."
                    }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                        <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5 w-full lg:w-auto">
                  <span className="text-2xl">💡</span>
                  <p className="text-emerald-800 font-bold text-base md:text-lg leading-snug">
                    Không phải xịt mạnh hơn —<br className="sm:hidden" /> mà <span className="text-emerald-600 underline underline-offset-4 decoration-emerald-400">xịt đúng cách hơn</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="comparison" className="py-12 md:py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2">Chi phí & Kết quả thực tế</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">
                Cùng xử lý mối –{' '}
                <span className="text-emerald-600">kết quả khác nhau hoàn toàn</span>
              </h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Nhiều gia đình đã tốn 3–5 triệu/năm nhưng mối vẫn tái phát.<br className="block sm:hidden mb-2" />
                <br className="hidden sm:block" />
                Xem so sánh thực tế trước khi quyết định.
              </p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-5 font-bold bg-slate-900 text-white text-base w-[22%]">So sánh</th>
                    <th className="p-5 font-black text-center bg-emerald-700 text-white text-base w-[26%] relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-yellow-400 text-emerald-800 text-xs px-2 py-0.5 font-bold uppercase -rotate-45 translate-x-4 translate-y-2">✓ Nên chọn</div>
                      🛡️ SAMURAI
                      <div className="text-white/70 font-normal text-xs mt-1">Từ 249.000đ</div>
                    </th>
                    <th className="p-5 font-bold text-center bg-orange-900/90 text-orange-100 text-base w-[26%]">
                      🔧 Thuê dịch vụ
                      <div className="text-orange-300/80 font-normal text-xs mt-1">2–5 triệu/lần</div>
                    </th>
                    <th className="p-5 font-bold text-center bg-slate-700 text-slate-200 text-base w-[26%]">
                      🧪 Các loại khác
                      <div className="text-slate-400 font-normal text-xs mt-1">300k+</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Chi phí ban đầu",
                      samurai: "249.000đ – 1 lọ",
                      service: "2.000.000–5.000.000đ",
                      normal: "300k+",
                    },
                    {
                      label: "Mối có tái phát?",
                      samurai: "Rất hiếm – diệt tận tổ chúa",
                      service: "Tái phát sau 6–12 tháng",
                      normal: "Tái phát trong vài tuần",
                    },
                    {
                      label: "Chi phí tích lũy 3 năm",
                      samurai: "~249.000đ",
                      service: "6.000.000–15.000.000đ",
                      normal: "1.500.000–3.000.000đ",
                      highlight: true,
                    },
                    {
                      label: "Thời gian chờ đợi",
                      samurai: "Dùng ngay khi nhận hàng",
                      service: "Đặt lịch, chờ 3–7 ngày",
                      normal: "Dùng được ngay",
                    },
                    {
                      label: "Ảnh hưởng sinh hoạt",
                      samurai: "Không mùi – sinh hoạt bình thường",
                      service: "Phải dọn đồ, tránh mặt 2–4 giờ",
                      normal: "Mùi hóa chất khó chịu",
                    },
                  ].map((row, i) => (
                    <tr key={i} className={cn("border-b border-slate-100 last:border-0 text-sm", row.highlight && "bg-yellow-50/40")}>
                      <td className="p-5 font-bold text-slate-700 bg-slate-50/60">{row.label}</td>
                      <td className="p-5 bg-emerald-50 border-x-2 border-emerald-100 text-center">
                        <div className="flex items-center justify-center gap-2 font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          {row.samurai}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-2 text-orange-700 italic">
                          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          {row.service}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-500 italic">
                          <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          {row.normal}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desktop Bottom CTA */}
            <div className="hidden md:flex items-center justify-between mt-6 bg-white rounded-2xl px-8 py-5 shadow-sm border border-slate-100 gap-6">
              <div>
                <p className="text-slate-500 text-sm mb-0.5">Tiết kiệm lên đến</p>
                <p className="text-emerald-600 font-black text-2xl leading-tight">10–15 triệu đồng</p>
                <p className="text-slate-500 text-sm">so với thuê dịch vụ trong 3 năm</p>
              </div>
              <div className="w-px h-14 bg-slate-100"></div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Miễn phí vận chuyển toàn quốc
              </div>
              <div className="w-px h-14 bg-slate-100"></div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Miễn phí đổi trả
              </div>
              <button onClick={scrollToPricing} className="ml-auto bg-orange-500 text-white font-black text-base px-8 py-4 rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all whitespace-nowrap flex-shrink-0">
                ĐẶT MUA NGAY – 249.000Đ
              </button>
            </div>

            {/* Mobile Optimised View – đọc hiểu trong 3s */}
            <div className="md:hidden space-y-4">

              {/* Hook: số tiết kiệm to – đập vào mắt đầu tiên */}
              <div className="bg-emerald-700 rounded-2xl py-5 px-4 text-center shadow-lg shadow-emerald-900/30">
                <p className="text-white/80 text-base mb-1 font-medium">Dùng Samurai – tiết kiệm được</p>
                <p className="text-yellow-300 font-black text-5xl leading-none tracking-tight">10–15 triệu</p>
                <p className="text-white/60 text-sm mt-1.5">so với thuê dịch vụ trong 3 năm<br /><span className="text-white/50 text-xs">(chưa tính chi phí sửa chữa hỏng hóc)</span></p>
              </div>

              {/* Bảng compact 3 cột – tất cả 5 điểm trong 1 card */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">

                {/* Header cột */}
                <div className="grid grid-cols-[88px_1fr_1fr]">
                  <div className="bg-slate-800 p-3" />
                  <div className="bg-emerald-600 py-3 px-2 text-center border-l border-emerald-500">
                    <p className="text-white font-black text-sm leading-tight">🛡️ SAMURAI</p>
                    <p className="text-emerald-100 text-xs mt-0.5">Từ 249.000đ</p>
                  </div>
                  <div className="bg-slate-600 py-3 px-2 text-center border-l border-slate-500">
                    <p className="text-slate-100 font-bold text-sm leading-tight">🔧 Cách khác</p>
                    <p className="text-slate-300 text-xs mt-0.5">2–5 triệu/lần</p>
                  </div>
                </div>

                {/* Các hàng so sánh */}
                {[
                  { icon: "💸", label: "Chi phí", samurai: "249.000đ", bad: "2–5 triệu" },
                  { icon: "🔁", label: "Tái phát?", samurai: "Rất hiếm", bad: "Sau vài tháng" },
                  { icon: "📅", label: "Chi phí 3 năm", samurai: "~249.000đ", bad: "6–15 triệu", highlight: true },
                  { icon: "⏰", label: "Chờ đợi", samurai: "Dùng ngay", bad: "3 ~ 10 ngày+" },
                  { icon: "🏠", label: "Ảnh hưởng", samurai: "An toàn", bad: "Hóa chất" },
                ].map((row, i) => (
                  <div key={i} className={cn("grid grid-cols-[88px_1fr_1fr] border-t border-slate-100", row.highlight ? "bg-yellow-50" : i % 2 === 0 ? "bg-white" : "bg-slate-50/40")}>
                    {/* Nhãn */}
                    <div className="p-3 flex flex-col justify-center bg-slate-50 border-r border-slate-100">
                      <span className="text-lg leading-none mb-1">{row.icon}</span>
                      <span className="text-[11px] font-bold text-slate-600 leading-tight">{row.label}</span>
                    </div>
                    {/* Samurai */}
                    <div className={cn("p-3 flex flex-col items-center justify-center border-r border-slate-100", row.highlight ? "bg-emerald-50" : "bg-emerald-50/30")}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1 flex-shrink-0" />
                      <p className={cn("font-black text-center leading-tight", row.highlight ? "text-emerald-700 text-sm" : "text-emerald-800 text-sm")}>{row.samurai}</p>
                    </div>
                    {/* Cách khác */}
                    <div className="p-3 flex flex-col items-center justify-center">
                      <XCircle className="w-4 h-4 text-orange-400 mb-1 flex-shrink-0" />
                      <p className="text-sm text-slate-500 italic text-center leading-tight">{row.bad}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={scrollToPricing}
                className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all"
              >
                ĐẶT MUA SAMURAI – 249.000Đ
              </button>
              <div className="flex justify-center gap-6 text-slate-600 text-sm pb-2">
                <span>✓ Miễn phí giao hàng</span>
                <span>✓ Miễn phí đổi trả</span>
              </div>

            </div>

          </div>
        </section>

        {/* 3-Step Guide */}
        <section id="usage-guide" className="py-10 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2">Cách sử dụng</p>
              <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight">3 Bước tự xử lý Mối tại nhà</h2>
              <p className="text-slate-500 text-base">Không cần kinh nghiệm – không cần dụng cụ chuyên dụng</p>
            </div>

            {/* Illustration image */}
            <div className="mb-8 md:mb-12 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-100">
              <img
                src="/sdsamuraimin.webp"
                alt="Cách tự xử lý mối tại nhà bằng Samurai Nhật Bản"
                className="w-full h-auto block"
                loading="lazy"
                width={1024}
                height={683}
              />
            </div>

            {/* Steps - Mobile: vertical / Desktop: horizontal */}
            <div className="flex flex-col md:flex-row md:items-stretch gap-0 md:gap-0">
              {[
                {
                  num: "1",
                  time: "2 phút",
                  title: "Xác định vị trí",
                  desc: "Tìm khe gỗ, chân tủ, chân cửa hoặc nơi thấy mối xuất hiện.",
                  icon: "🔍",
                },
                {
                  num: "2",
                  time: "5 phút",
                  title: "Mở nắp – rải bột",
                  desc: "Mở nắp lọ, rải bột Samurai trực tiếp vào vị trí mối hoạt động. Không cần khoan đục.",
                  icon: "📦",
                },
                {
                  num: "3",
                  time: "3–7 ngày",
                  title: "Để yên – dọn sạch",
                  desc: "Mối tiếp xúc sẽ mang hoạt chất vào tổ và lây cho cả đàn. Sau vài ngày dọn sạch khu vực là hoàn tất.",
                  icon: "✅",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex md:flex-col md:flex-1 relative">

                  {/* Mobile: horizontal number + content */}
                  <div className="flex md:hidden items-start gap-4 pb-8 relative">
                    {/* Left: number + line */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-100">
                        {item.num}
                      </div>
                      {idx < 2 && <div className="w-0.5 flex-1 bg-emerald-100 mt-2 min-h-[2rem]"></div>}
                    </div>
                    {/* Right: content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.time}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Desktop: vertical card */}
                  <div className="hidden md:flex flex-col items-center text-center flex-1 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-100 mb-4">
                      {item.num}
                    </div>
                    <span className="text-2xl mb-3">{item.icon}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">{item.time}</span>
                    <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Desktop arrow between steps */}
                  {idx < 2 && (
                    <div className="hidden md:flex items-center justify-center flex-shrink-0 mt-8">
                      <ChevronRight className="w-6 h-6 text-emerald-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom note + CTA */}
            <div className="mt-6 md:mt-10 bg-slate-50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <span className="font-bold text-slate-800">Mẹo:</span> Để hiệu quả tốt nhất, rải vào buổi tối khi mối hoạt động nhiều. Không cần dọn ngay – để bột tiếp xúc với mối càng lâu càng tốt.
                </p>
              </div>
              <button onClick={scrollToPricing} className="flex-shrink-0 bg-orange-500 text-white font-black text-sm px-6 py-3 rounded-xl hover:bg-orange-600 transition-all whitespace-nowrap shadow-md shadow-orange-100">
                ĐẶT MUA NGAY
              </button>
            </div>

          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-10 md:py-14 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-8 md:mb-10">
              <p className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">📦 Giao hàng toàn quốc · COD tận nơi</p>
              <h2 className="text-2xl md:text-4xl font-black mb-2 leading-tight">Đặt Hàng Ngay</h2>
              <p className="text-amber-300 text-xl md:text-2xl font-bold mb-3">Giao Tận Nhà – Thanh Toán Khi Nhận Hàng</p>
              <p className="text-slate-400 text-sm md:text-base">Miễn phí giao hàng toàn quốc · Kiểm tra hàng trước khi thanh toán · Miễn phí đổi trả</p>
            </div>

            {/* Cards grid */}
            <div className="flex flex-col md:grid md:grid-cols-3 md:items-stretch gap-4 md:gap-4">

              {/* ── GÓI GIA ĐÌNH HERO – mobile: top, desktop: middle ── */}
              <div className="order-first md:order-2 relative flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                  <span className="bg-amber-400 text-slate-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    🏆 Phổ biến nhất – Nên chọn
                  </span>
                </div>
                <div className="bg-gradient-to-b from-emerald-700 to-teal-900 rounded-2xl p-5 md:p-6 border-2 border-amber-400 shadow-xl shadow-emerald-950/70 mt-5 flex flex-col flex-1">

                  {/* Title */}
                  <div className="mb-1">
                    <h3 className="text-xl font-black text-white tracking-tight">GÓI GIA ĐÌNH</h3>
                    {/* Badge tồn kho động – giảm dần theo giờ VN */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 bg-red-500/25 text-white text-xs font-black px-2.5 py-1 rounded-md border border-red-400/50">
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        🔥 Còn {stockRemaining} suất hôm nay
                      </span>
                      <span className="text-amber-300/80 text-[11px] font-semibold whitespace-nowrap">
                        ⏰ Hết lúc 12h đêm{countdownToMidnight ? ` (còn ${countdownToMidnight})` : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-emerald-200 text-sm mb-1 font-medium">6 lọ Samurai · Nhà 50–100m²</p>
                  <p className="text-emerald-300/80 text-xs mb-4">Xử lý 7–10 vị trí mối · Đủ cho cả nhà</p>

                  {/* Price block */}
                  <div className="bg-black/25 rounded-xl px-4 py-3 mb-4">
                    <p className="text-emerald-300 text-xs mb-1">Giá gốc: <span className="line-through text-emerald-400">498.000đ</span></p>
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-4xl font-black text-white">328.000đ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-red-900 text-xs font-black px-2 py-0.5 rounded">TIẾT KIỆM 170K</span>
                      <span className="text-amber-300 text-xs font-bold">Số lượng có hạn</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {[
                      { text: "6 lọ Samurai Nhật Bản chính hãng", star: true },
                      { text: "Xử lý được 7–10 vị trí mối" },
                      { text: "Đủ dùng cả nhà + biếu người thân" },
                      { text: "Miễn phí giao hàng toàn quốc" },
                      { text: "Kiểm tra hàng trước khi nhận" },
                    ].map((item, i) => (
                      <li key={i} className={cn("flex items-center gap-2.5", item.star ? "text-sm font-black text-amber-300" : "text-sm text-white/80")}>
                        <CheckCircle2 className={cn("flex-shrink-0", item.star ? "w-4 h-4 text-amber-300" : "w-4 h-4 text-white/40")} />
                        {item.text}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => scrollToOrderWithCombo('combo2')}
                    className="w-full py-4 rounded-xl bg-amber-400 text-slate-900 font-black text-lg hover:bg-amber-300 transition-all active:scale-95 shadow-md"
                  >
                    CHỌN GÓI NÀY – 328.000Đ
                  </button>
                  <p className="text-center text-emerald-300/70 text-xs mt-2 font-semibold">
                    ⚠️ Chỉ còn <span className="text-amber-300 font-black">{stockRemaining} suất</span> – Hết giá này lúc 12h đêm nay
                  </p>
                </div>
              </div>

              {/* ── GÓI NHÀ NHỎ – mobile: 2nd, desktop: left ── */}
              <div className="order-2 md:order-1 flex flex-col">
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col flex-1">
                  <h3 className="text-lg font-black text-slate-100 mb-0.5">GÓI NHÀ NHỎ</h3>
                  <p className="text-slate-300 text-sm mb-1 font-medium">3 lọ Samurai · Nhà ≤ 50m²</p>
                  <p className="text-slate-500 text-xs mb-4">Xử lý 2–3 vị trí mối · Dùng thử, nhà ít mối mới có mối.</p>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-white">249.000đ</span>
                  </div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {[
                      "3 lọ Samurai Nhật Bản",
                      "Xử lý 2–3 vị trí mối",
                      "Phù hợp nhà nhỏ ≤ 50m²",
                      "Miễn phí giao hàng",
                      "Kiểm tra hàng trước khi nhận",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollToOrderWithCombo('combo1')}
                    className="w-full py-3.5 rounded-xl bg-slate-700 text-slate-200 font-bold text-base hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    CHỌN GÓI NÀY
                  </button>
                </div>
              </div>

              {/* ── GÓI NHÀ LỚN – mobile: 3rd, desktop: right ── */}
              <div className="order-3 md:order-3 flex flex-col">
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col flex-1">
                  <h3 className="text-lg font-black text-slate-100 mb-0.5">GÓI NHÀ LỚN</h3>
                  <p className="text-slate-300 text-sm mb-1 font-medium">9 lọ Samurai · Nhà &gt; 100m²</p>
                  <p className="text-slate-500 text-xs mb-4">Xử lý 15–20 vị trí · Nhà lớn, nhiều tầng, nhiều tổ mối lâu năm</p>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-white">497.000đ</span>
                  </div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {[
                      "9 lọ Samurai Nhật Bản",
                      "Xử lý 15–20 vị trí mối",
                      "Nhà lớn, nhiều tầng, nhiều tổ mối",
                      "Miễn phí giao hàng",
                      "Kiểm tra hàng trước khi nhận",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollToOrderWithCombo('combo3')}
                    className="w-full py-3.5 rounded-xl bg-slate-700 text-slate-200 font-bold text-base hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    CHỌN GÓI NÀY
                  </button>
                </div>
              </div>

            </div>

            {/* Trust bar */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center pt-2">
              {[
                { icon: "🚚", text: "Miễn phí giao hàng" },
                { icon: "🔍", text: "Kiểm tra hàng trước khi nhận" },
                { icon: "🔄", text: "Miễn phí đổi trả" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 bg-slate-800/50 rounded-xl py-2.5 px-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-slate-400 text-xs leading-tight">{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-10 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-6 md:mb-8 px-4">
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-1.5">Đánh giá thực tế</p>
              <h2 className="text-xl md:text-3xl font-black mb-2 uppercase tracking-tight">Khách Hàng Nói Gì Về Samurai?</h2>
              <div className="flex justify-center gap-0.5 text-amber-400 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-500 text-base font-medium">12.400+ khách hàng đã tin dùng Samurai trên toàn quốc</p>
            </div>

            {/* ── MOBILE: Auto-scroll carousel ── */}
            <div
              ref={carouselRef}
              onTouchStart={handleCarouselTouchStart}
              onTouchEnd={handleCarouselTouchEnd}
              onScroll={handleCarouselScroll}
              className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              {REVIEWS.map((t, i) => (
                <div key={i} className="snap-start flex-shrink-0 w-[82vw] max-w-[310px] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  {/* Customer photo – square slot (1:1), replace photo: null → "url" when ready */}
                  {t.photo ? (
                    <img src={t.photo} alt="Ảnh thực tế khách hàng dùng bột diệt mối Samurai tại nhà" className="w-full aspect-square object-cover object-center" loading="lazy" width={800} height={800} srcSet={t.photoSmall ? `${t.photoSmall} 400w, ${t.photo} 800w` : undefined} sizes="(max-width: 640px) 82vw, 310px" />
                  ) : (
                    <div className="w-full aspect-square bg-slate-100" />
                  )}
                  <div className="p-3.5">
                    {/* Avatar + Name + Stars */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow flex-shrink-0" loading="lazy" width={32} height={32} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-sm leading-tight truncate">{t.name} ({t.age} tuổi)</p>
                        <p className="text-slate-500 text-xs">{t.loc}</p>
                      </div>
                      <div className="flex gap-0.5 text-amber-400 flex-shrink-0">
                        {Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-2.5 italic">"{t.text}"</p>
                    <span className="inline-block text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded-full border border-emerald-100">{t.combo}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls: prev · dots · next */}
            <div className="md:hidden flex items-center justify-center gap-2 mt-3">
              {/* Prev */}
              <button
                onClick={() => jumpToReview((activeDot - 1 + REVIEWS.length) % REVIEWS.length)}
                className="w-8 h-8 rounded-full bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0"
                aria-label="Review trước"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>

              {/* Dots */}
              <div className="flex items-center">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => jumpToReview(i)}
                    className="p-2 flex items-center justify-center"
                    aria-label={`Đánh giá ${i + 1}`}
                  >
                    <span className={cn(
                      "block rounded-full transition-all duration-300",
                      i === activeDot ? "w-5 h-1.5 bg-emerald-500" : "w-1.5 h-1.5 bg-slate-300"
                    )} />
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => jumpToReview((activeDot + 1) % REVIEWS.length)}
                className="w-8 h-8 rounded-full bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0"
                aria-label="Review tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* ── DESKTOP: Compact 3-col × 2-row (6 reviews) ── */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 px-4 sm:px-6 lg:px-8 mt-2">
              {REVIEWS.slice(0, 6).map((t, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  {/* Customer photo – 100px slot, crops square image to landscape banner */}
                  {t.photo ? (
                    <img src={t.photo} alt="Ảnh thực tế khách hàng dùng bột diệt mối Samurai tại nhà" className="w-full h-[100px] object-cover object-center" loading="lazy" width={800} height={800} srcSet={t.photoSmall ? `${t.photoSmall} 400w, ${t.photo} 800w` : undefined} sizes="(max-width: 640px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-[100px] bg-slate-100" />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow flex-shrink-0" loading="lazy" width={32} height={32} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{t.name} ({t.age} tuổi)</p>
                        <p className="text-slate-500 text-xs">{t.loc}</p>
                      </div>
                      <div className="flex gap-0.5 text-amber-400 flex-shrink-0">
                        {Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic flex-1 mb-3">"{t.text}"</p>
                    <span className="inline-block text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100 self-start">{t.combo}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 md:py-20 bg-teal-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-2">Giải đáp thắc mắc</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Câu hỏi thường gặp</h2>
            </div>
            <div className="space-y-2.5">
              {FAQS.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "bg-white rounded-2xl border transition-all duration-200 overflow-hidden",
                    openFaq === idx ? "border-emerald-200 shadow-md" : "border-slate-200 shadow-sm"
                  )}
                >
                  <button
                    onClick={() => { setOpenFaq(openFaq === idx ? null : idx); }}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className={cn(
                      "font-bold text-base leading-snug transition-colors",
                      openFaq === idx ? "text-emerald-700" : "text-slate-800"
                    )}>
                      {item.q}
                    </span>
                    <span className={cn(
                      "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200",
                      openFaq === idx ? "bg-emerald-100" : "bg-slate-100"
                    )}>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-all duration-200",
                        openFaq === idx ? "text-emerald-600 rotate-90" : "text-slate-400 rotate-0"
                      )} />
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5">
                      <div className="border-t border-slate-100 pt-4">
                        <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">{item.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Form Section */}
        <section id="order-section" className="py-8 md:py-14 bg-gradient-to-b from-emerald-50 to-teal-50 border-t-4 border-emerald-600">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-3">
                🎁 TIẾT KIỆM 170.000Đ – CHỈ HÔM NAY
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-2">
                Đặt Hàng Ngay – Giao Tận Nhà
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                ⚠️ <strong className="text-slate-800">Nhân viên gọi lại SỚM NHẤT</strong> – Vui lòng cung cấp <strong className="text-emerald-600">số điện thoại chính xác</strong>
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">

              {/* Trust bar */}
              <div className="bg-green-600 px-6 py-3 flex items-center justify-center gap-3 text-white text-sm font-bold">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>Xem hàng trước – Trả tiền sau – Miễn phí vận chuyển</span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-7 space-y-5">

                {/* Product Image */}
                <div className="flex justify-center my-2">
                  <img
                    src="/samuraingangmin.webp"
                    alt="Samurai Diệt Mối - Combo 3 Lọ, Combo 6 Lọ, Combo 9 Lọ"
                    className="w-full max-w-xs md:max-w-md h-auto rounded-2xl shadow-xl border border-slate-100"
                    loading="lazy"
                    width={1376}
                    height={768}
                  />
                </div>

                {/* Bước 1: Combo – compact 3-col selector */}
                <div id="combo-step">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Bước 1 — Chọn gói</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'combo1', emoji: '🏠', name: 'GÓI NHÀ NHỎ', sub: '3 lọ · ≤50m²', price: '249.000đ' },
                      { value: 'combo2', emoji: '👨‍👩‍👧', name: 'GÓI GIA ĐÌNH', sub: '6 lọ · 50–100m²', price: '328.000đ', recommended: true },
                      { value: 'combo3', emoji: '🏢', name: 'GÓI NHÀ LỚN', sub: '9 lọ · >100m²', price: '497.000đ' },
                    ].map((item) => (
                      <label key={item.value} className={cn(
                        "relative flex flex-col items-center text-center p-3 rounded-2xl border-2 cursor-pointer transition-all select-none",
                        selectedCombo === item.value
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      )}>
                        <input
                          type="radio"
                          {...register("combo", { required: true })}
                          value={item.value}
                          checked={selectedCombo === item.value}
                          onChange={(e) => { setSelectedCombo(e.target.value); setValue('combo', e.target.value); }}
                          className="sr-only"
                        />
                        {item.recommended && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full whitespace-nowrap tracking-wide">
                            NÊN CHỌN
                          </span>
                        )}
                        {selectedCombo === item.value && (
                          <CheckCircle2 className="absolute top-2 right-2 w-3.5 h-3.5 text-emerald-500" />
                        )}
                        <span className="text-xl mb-1">{item.emoji}</span>
                        <span className={cn("text-[11px] font-black leading-tight mb-1", selectedCombo === item.value ? "text-emerald-700" : "text-slate-700")}>
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-500 mb-1.5 leading-tight">{item.sub}</span>
                        <span className={cn("text-sm font-black", selectedCombo === item.value ? "text-emerald-600" : "text-slate-800")}>
                          {item.price}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Upsell nudge – chỉ hiện khi chọn Gói Nhà Nhỏ */}
                  <AnimatePresence>
                    {selectedCombo === 'combo1' && (
                      <motion.div
                        key="upsell-nudge"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.22 }}
                        className="mt-3 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md"
                      >
                        {/* Header */}
                        <div className="bg-amber-400 px-4 py-2 flex items-center gap-2">
                          <span className="text-slate-900 text-sm font-black leading-snug">🔥 Khoan đã!</span>
                          <span className="text-slate-800 text-xs font-bold leading-snug">Chỉ thêm <strong>79.000đ</strong> → nâng lên Gói Gia Đình</span>
                        </div>
                        {/* Body */}
                        <div className="bg-amber-50 px-4 py-3 space-y-2">
                          <ul className="space-y-1.5">
                            {[
                              { icon: '📦', text: 'Gấp đôi số lọ (6 lọ) – xử lý cả nhà, dự phòng mối tái phát' },
                              { icon: '🏠', text: 'Đủ cho nhà 50–100m² – không cần đặt lại lần 2' },
                              { icon: '⚠️', text: `Còn ${stockRemaining} suất giá này – hết hôm nay không mở lại` },
                            ].map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-snug">
                                <span className="text-base leading-none flex-shrink-0 mt-0.5">{r.icon}</span>
                                <span>{r.text}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCombo('combo2');
                              setValue('combo', 'combo2');
                              setUpsellApplied(true);
                            }}
                            className="w-full mt-1 py-2.5 rounded-xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
                          >
                            ✅ Nâng lên Gói Gia Đình – 328.000đ
                          </button>
                          <button
                            type="button"
                            onClick={() => setTimeout(() => nameStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)}
                            className="w-full py-1.5 text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors"
                          >
                            Không, giữ nguyên Gói Nhà Nhỏ
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Badge xanh xác nhận khuyến mãi – hiện khi chọn combo2 hoặc combo3 */}
                  <AnimatePresence>
                    {(selectedCombo === 'combo2' || selectedCombo === 'combo3') && (() => {
                      const savingsMap: Record<string, { saved: string; original: string; current: string }> = {
                        combo2: { saved: '170.000đ', original: '498.000đ', current: '328.000đ' },
                        combo3: { saved: '250.000đ', original: '747.000đ', current: '497.000đ' },
                      };
                      const s = savingsMap[selectedCombo];
                      return (
                        <motion.div
                          key={`savings-${selectedCombo}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 flex items-start gap-2.5 bg-green-50 border border-green-300 rounded-xl px-4 py-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            {upsellApplied && selectedCombo === 'combo2' && (
                              <p className="text-green-800 text-sm font-black leading-snug mb-0.5">✨ Nâng cấp thành công! Quyết định đúng đắn.</p>
                            )}
                            <p className="text-green-800 text-sm font-black leading-snug">Đã áp dụng khuyến mãi – Tiết kiệm {s.saved} 🎉</p>
                            <p className="text-green-700 text-xs mt-0.5">Giá gốc <span className="line-through text-green-500">{s.original}</span> → chỉ còn <span className="font-black">{s.current}</span></p>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* Bước 2: Thông tin */}
                <div className="space-y-4" ref={nameStepRef}>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Bước 2 — Thông tin nhận hàng</p>

                  <div>
                    <label className="block text-base font-bold text-slate-800 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                    <input
                      {...register("name", { required: "Vui lòng nhập họ tên" })}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      autoComplete="name"
                      name="name"

                      className={cn(
                        "w-full px-5 py-4 text-lg rounded-2xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all",
                        errors.name && "border-red-400 bg-red-50"
                      )}
                    />
                    {errors.name && <p className="text-red-500 text-sm font-semibold mt-1.5 flex items-center gap-1">⚠ {(errors.name as any).message}</p>}
                  </div>

                  <div>
                    <label className="block text-base font-bold text-slate-800 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      {...register("phone", { required: "Vui lòng nhập số điện thoại", pattern: { value: /^0(3[2-9]|5[25689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/, message: "Số điện thoại không hợp lệ (vd: 0912 345 678)" } })}
                      placeholder="Ví dụ: 0912 345 678"
                      inputMode="numeric"
                      type="tel"
                      autoComplete="tel"
                      name="phone"
                      className={cn(
                        "w-full px-5 py-4 text-lg rounded-2xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all",
                        errors.phone && "border-red-400 bg-red-50"
                      )}
                    />
                    {errors.phone && <p className="text-red-500 text-sm font-semibold mt-1.5 flex items-center gap-1">⚠ {(errors.phone as any).message}</p>}
                  </div>

                  <div>
                    <label className="block text-base font-bold text-slate-800 mb-2">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
                    <input
                      {...register("address", { required: "Vui lòng nhập địa chỉ nhận hàng" })}
                      placeholder="Số nhà, đường, phường, quận, tỉnh/thành"
                      autoComplete="street-address"
                      name="address"
                      className={cn(
                        "w-full px-5 py-4 text-lg rounded-2xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all",
                        errors.address && "border-red-400 bg-red-50"
                      )}
                    />
                    {errors.address && <p className="text-red-500 text-sm font-semibold mt-1.5 flex items-center gap-1">⚠ {(errors.address as any).message}</p>}
                  </div>
                </div>

                {/* Bước 3: Submit */}
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Bước 3 — Xác nhận</p>

                  {submitStatus === 'success' ? (
                    <div className="w-full py-5 rounded-2xl bg-green-600 text-white font-black text-xl text-center shadow-xl shadow-green-200">
                      ✅ Đặt hàng thành công! Nhân viên sẽ gọi lại sớm nhất.
                    </div>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={submitStatus === 'loading'}
                        className="w-full py-5 rounded-2xl bg-orange-500 text-white font-black text-xl md:text-2xl hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                      >
                        {submitStatus === 'loading' ? (
                          <>
                            <svg className="animate-spin w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                            </svg>
                            Đang gửi đơn hàng...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-7 h-7 flex-shrink-0" />
                            GỬI ĐƠN HÀNG NGAY
                          </>
                        )}
                      </button>
                      {submitStatus === 'error' && (
                        <p className="text-red-600 text-sm font-semibold mt-2 text-center">⚠ {submitError}</p>
                      )}
                    </>
                  )}

                  {submitStatus !== 'success' && (() => {
                    const ct = formatMidnight(midnightCountdownSecs);
                    // Nội dung context-aware theo combo
                    const comboCtx: Record<string, { label: string; sub: string }> = {
                      combo1: {
                        label: 'Giá miễn phí giao hàng hết lúc 12:00 đêm nay',
                        sub: 'Đặt ngay để nhận Miễn Phí Giao Hàng – giao tận nơi, trả tiền khi nhận',
                      },
                      combo2: {
                        label: 'Giá khuyến mãi 328.000đ hết lúc 12:00 đêm nay',
                        sub: 'Sau 12h đêm giá trở về 498.000đ – đang tiết kiệm 170.000đ',
                      },
                      combo3: {
                        label: 'Giá khuyến mãi 497.000đ hết lúc 12:00 đêm nay',
                        sub: 'Sau 12h đêm giá trở về 747.000đ – đang tiết kiệm 250.000đ',
                      },
                    };
                    const ctx = comboCtx[selectedCombo] ?? comboCtx.combo2;
                    return (
                      <div className="mt-4 rounded-xl overflow-hidden border border-orange-200 bg-orange-50">
                        {/* Compact header row */}
                        <div className="bg-orange-500 px-3 py-1.5 flex items-center justify-between gap-2">
                          <span className="text-white text-[11px] font-bold flex items-center gap-1.5 leading-tight">
                            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-200 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-100"></span>
                            </span>
                            ⏰ {ctx.label}
                          </span>
                          <span className="bg-white/25 text-white text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                            Còn {stockRemaining} suất
                          </span>
                        </div>
                        {/* Timer compact – 1 hàng ngang */}
                        <div className="px-3 py-2.5 flex items-center justify-between gap-3">
                          <p className="text-orange-800 text-xs leading-snug flex-1">{ctx.sub}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {[{ val: ct.h, label: 'giờ' }, { val: ct.m, label: 'phút' }, { val: ct.s, label: 'giây' }].map((seg, i) => (
                              <React.Fragment key={i}>
                                <div className="flex flex-col items-center">
                                  <div className="bg-red-700 text-white font-black text-base w-10 h-10 rounded-lg flex items-center justify-center tabular-nums tracking-tight shadow-sm">
                                    {seg.val}
                                  </div>
                                  <span className="text-orange-600 text-[11px] font-bold mt-0.5">{seg.label}</span>
                                </div>
                                {i < 2 && <span className="text-red-600 font-black text-base mb-3 select-none">:</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {submitStatus !== 'success' && (
                    <p className="text-center text-slate-500 text-xs mt-2 leading-snug">
                      ✓ Nhân viên gọi lại <strong className="text-slate-700">sớm nhất</strong> · Chú ý để chuông ☎️
                    </p>
                  )}
                </div>

                {/* Trust icons */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  {[
                    { icon: <Package className="w-5 h-5 text-green-600" />, text: 'Miễn phí giao hàng' },
                    { icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, text: 'Kiểm hàng trước khi trả tiền' },
                    { icon: <ShieldCheck className="w-5 h-5 text-green-600" />, text: 'Đổi Trả Miễn Phí' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                      {item.icon}
                      <span className="text-sm font-semibold text-slate-600 leading-tight">{item.text}</span>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { emoji: '🚚', title: 'Giao hàng toàn quốc', sub: 'Nhận hàng rồi mới trả tiền' },
                { emoji: '✅', title: 'Kiểm tra trước khi thanh toán', sub: 'An tâm mua hàng' },
                { emoji: '✅', title: 'Dễ sử dụng tại nhà', sub: 'Không cần gọi thợ' },
                { emoji: '🇯🇵', title: 'Hàng chính hãng Nhật Bản', sub: 'Nhập khẩu trực tiếp công ty' },
              ].map((b, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-start gap-3 shadow-sm">
                  <span className="text-2xl leading-none mt-0.5">{b.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{b.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-4 bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4 shadow-sm">
              <div className="flex -space-x-2 flex-shrink-0">
                {['/customers/1min.webp', '/customers/2min.webp', '/customers/3min.webp', '/customers/4min.webp'].map((img, i) => (
                  <img key={i} src={img} alt={`Khách hàng ${i + 1}`} className="w-10 h-10 rounded-full border-2 border-white object-cover object-center flex-shrink-0" loading="lazy" width={40} height={40} onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm font-bold text-slate-800">Hơn 12.400+ khách hàng đã đặt thành công</p>
                <p className="text-xs text-slate-500">Đánh giá trung bình 4.9/5 ⭐</p>
              </div>
            </div>

            {/* Chứng Nhận Chất Lượng ISO Nhật Bản */}
            <div className="mt-10">
              <h3 className="text-center text-lg sm:text-xl font-extrabold text-slate-800 mb-5 tracking-tight">
                🇯🇵 Chứng Nhận Chất Lượng ISO Nhật Bản
              </h3>
              <div className="flex justify-center px-4">
                <img
                  src="/chungnhanmin.webp"
                  alt="Chứng nhận chất lượng ISO Nhật Bản"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl shadow-lg border border-slate-200 object-contain"
                  loading="lazy"
                  width={480}
                  height={679}
                />
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logovuongsamuraimin.webp" alt="Samurai Japan Logo" className="h-10 w-10 object-contain rounded-lg" loading="lazy" width={40} height={40} />
                <span className="text-xl font-bold tracking-tighter text-white">Thuốc Diệt Mối <span className="text-emerald-400">Nhật Bản</span></span>
              </div>
              <p className="text-sm leading-relaxed">
                Đơn vị phân phối độc quyền thuốc diệt mối sinh học Samurai công nghệ Nhật Bản tại Việt Nam. Bảo vệ ngôi nhà Việt khỏi hiểm họa mối mọt.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Liên hệ</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Kho Tây Nam, Lô 01 - 02 - An Sương, Phường Trung Mỹ Tây, TP Hồ Chí Minh<br /><span className="text-slate-500 text-xs">Tất cả đơn hàng giao tận nơi cho quý khách.</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href="https://zalo.me/0842717266" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Hotline/Zalo: 084 271 7266
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href="mailto:dietmoinhatban@gmail.com" className="hover:text-white transition-colors">
                    dietmoinhatban@gmail.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Chính sách</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors text-left">Chính sách bảo mật thông tin</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors text-left">Điều khoản dịch vụ</button></li>
                <li><button onClick={() => setActiveModal('warranty')} className="hover:text-white transition-colors text-left">Cam kết chất lượng & Đổi trả</button></li>
                <li><button onClick={() => setActiveModal('shipping')} className="hover:text-white transition-colors text-left">Chính sách vận chuyển</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-xs">
            <p>© 2026 - Bản quyền thuộc về Thuốc diệt Mối Nhật Bản</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button – mobile only, show when pricing section is out of viewport */}
      <div className={cn(
        "md:hidden fixed bottom-5 right-4 z-50 transition-all duration-300 ease-in-out",
        showFloatingCTA ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-20 pointer-events-none"
      )}>
        <button
          onClick={() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="flex flex-col items-center gap-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 py-4 rounded-2xl shadow-2xl shadow-orange-900/70 active:scale-95 transition-all font-black text-center min-w-max"
        >
          <span className="text-base leading-tight">👉 Đặt Hàng Ngay</span>
          <span className="text-sm text-amber-300 font-bold">Giá khuyến mãi chỉ từ 249k</span>
        </button>
      </div>

    </div>
  );
}
