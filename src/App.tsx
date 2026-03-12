/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  initGTM,
  trackPageView,
  trackCTAClick,
  trackSelectPackage,
  trackFormStart,
  trackFormSubmit,
  trackPurchase,
  trackScrollDepth,
  trackBotDetection,
} from './utils/gtm';
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
    combo1: '1 Chai PestShield',
    combo2: 'Combo 2 Chai PestShield',
    combo3: 'Combo 3 Chai PestShield',
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
    name: '1 Chai PestShield',
    quantity: '1 chai 500ml · nhà ≤50m²',
    price: '209.000đ',
  },
  combo2: {
    emoji: '👨‍👩‍👧',
    name: 'Combo 2 Chai PestShield',
    quantity: '2 chai 500ml · nhà 50–100m²',
    price: '298.000đ',
    originalPrice: '418.000đ',
    savings: 'Tiết kiệm 120.000đ',
  },
  combo3: {
    emoji: '🏢',
    name: 'Combo 3 Chai PestShield',
    quantity: '3 chai 500ml · nhà >100m²',
    price: '397.000đ',
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
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <motion.div
        key="success-modal-card"
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh]"
      >
        {/* Header xanh */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 px-5 pt-5 pb-4 text-center flex-shrink-0 rounded-t-3xl sm:rounded-t-3xl">
          <div className="w-14 h-14 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-2.5 border-4 border-white/40">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            ĐẶT HÀNG THÀNH CÔNG!
          </h2>
          {customerName && (
            <p className="text-green-100 text-sm font-medium mt-1">Cảm ơn <strong className="text-white">{customerName}</strong> đã tin tưởng PestShield 🙏</p>
          )}
        </div>

        {/* Body */}
        <div className="px-4 sm:px-5 pt-3.5 pb-5 space-y-2.5 overflow-y-auto flex-1">

          {/* Combo info */}
          {selectedCombo && (() => {
            const detail = COMBO_SUCCESS_DETAILS[selectedCombo];
            if (!detail) return null;
            return (
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-3.5">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">✅ Sản phẩm đã đặt</p>
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-3xl leading-none flex-shrink-0">{detail.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-lg leading-tight">{detail.name}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{detail.quantity}</p>
                  </div>
                </div>
                <div className="border-t border-green-200 pt-2.5 flex items-end justify-between">
                  <div>
                    <p className="text-slate-500 text-xs mb-0.5">Thành tiền</p>
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
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl px-3.5 py-3 flex gap-2.5 items-start">
            <span className="text-xl leading-none flex-shrink-0 mt-0.5">⏰</span>
            <div>
              <p className="font-black text-slate-800 text-base leading-snug">
                Nhân viên gọi xác nhận trong <span className="text-amber-600">24 giờ</span>
              </p>
              <p className="text-slate-600 text-sm mt-0.5 leading-snug">
                Kèm thông báo thời gian giao hàng đến tận nhà bạn.
              </p>
            </div>
          </div>

          {/* Chú ý điện thoại */}
          <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 flex gap-2.5 items-center">
            <span className="text-xl leading-none flex-shrink-0">📵</span>
            <p className="font-bold text-red-700 text-sm leading-snug">
              Vui lòng <span className="underline decoration-dotted">chú ý điện thoại</span> để không bỏ lỡ cuộc gọi xác nhận đơn hàng
            </p>
          </div>

          {/* Nút Đóng - Primary */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black text-lg sm:text-xl hover:from-slate-900 hover:to-slate-950 active:scale-95 transition-all shadow-lg shadow-slate-800/30"
          >
            Đóng
          </button>

          {/* Zalo Support */}
          <div className="text-center pt-0.5">
            <p className="text-slate-500 text-sm mb-1.5">Cần hỗ trợ?</p>
            <a
              href="https://zalo.me/0978380508"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-slate-600 font-semibold text-base"
            >
              💬 Nhắn Zalo hỗ trợ
            </a>
            <p className="text-slate-500 text-xs mt-1.5">T2 - T7: 8h30 - 16h30</p>
          </div>
        </div>
      </motion.div>
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
    combo1: '🏠 1 Chai PestShield – 209.000đ',
    combo2: '👨‍👩‍👧 Combo 2 Chai PestShield – 298.000đ',
    combo3: '🏢 Combo 3 Chai PestShield – 397.000đ',
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
        className="bg-white w-full sm:max-w-md sm:mx-4 sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-white border-b-2 border-emerald-100 px-5 pt-5 pb-4 text-center">
          <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-emerald-200">
            <svg className="w-5 h-5" style={{ color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h2 className="text-xl font-black leading-tight" style={{ color: '#059669' }}>Xác nhận đặt hàng</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium leading-snug">Đơn sẽ được xử lý ngay sau khi bạn xác nhận</p>
        </div>

        {/* Body */}
        <div className="px-4 pt-4 pb-5 space-y-3">

          {/* Phone – nổi bật nhất */}
          <div className="bg-emerald-50 border-2 rounded-2xl px-4 py-3.5 text-center" style={{ borderColor: '#6EE7B7' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#059669' }}>Số điện thoại người nhận hàng</p>
            <p className="text-3xl font-black text-slate-900 tracking-widest tabular-nums leading-none">{data.phone}</p>
          </div>

          {/* Cảnh báo nhân viên gọi lại – riêng, nổi bật */}
          <div className="rounded-2xl border-2 px-4 py-3 text-center" style={{ borderColor: '#D4B17A', backgroundColor: '#FDF8F0' }}>
            <p className="text-sm font-black leading-snug" style={{ color: '#92400e' }}>
              📞 Nhân viên sẽ gọi xác nhận trước khi gửi hàng.
            </p>
            <p className="text-xs font-bold mt-1 leading-snug" style={{ color: '#b45309' }}>
              Vui lòng nghe máy để đơn được giao sớm nhất.
            </p>
          </div>

          {/* Name + Address + Combo */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 space-y-2.5 text-sm">
            <div className="flex gap-2.5 items-baseline">
              <span className="text-slate-500 w-[72px] flex-shrink-0 font-medium">Họ tên</span>
              <span className="font-bold text-slate-800 flex-1 min-w-0">{data.name}</span>
            </div>
            <div className="flex gap-2.5 items-baseline">
              <span className="text-slate-500 w-[72px] flex-shrink-0 font-medium">Địa chỉ</span>
              <span className="font-semibold text-slate-700 flex-1 min-w-0 leading-snug">{data.address}</span>
            </div>
            <div className="flex gap-2.5 items-baseline">
              <span className="text-slate-500 w-[72px] flex-shrink-0 font-medium">Sản phẩm</span>
              <span className="font-bold text-slate-800 flex-1 min-w-0">{comboLabel[data.combo] ?? data.combo}</span>
            </div>
          </div>

          {/* Nhắc chưa gửi */}
          <p className="text-center text-sm font-black leading-snug" style={{ color: '#EA580C' }}>⚠️ Bấm xác nhận để hoàn tất đơn hàng</p>

          {/* Buttons */}
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5 flex-shrink-0" />
            Xác nhận đặt hàng
          </button>

          <button
            onClick={onEdit}
            className="w-full py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-bold text-base hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
          <p>Chào mừng bạn đến với <strong>thuocxitmuoi.com</strong> — website chính thức của sản phẩm xịt muỗi &amp; côn trùng PestShield. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn.</p>
          <h5 className="font-bold text-slate-900">1. Thu thập thông tin</h5>
          <p>Chúng tôi chỉ thu thập thông tin cá nhân (họ tên, số điện thoại, địa chỉ giao hàng) khi bạn đặt hàng, nhằm mục đích xử lý đơn hàng và hỗ trợ sau mua.</p>
          <h5 className="font-bold text-slate-900">2. Sử dụng thông tin</h5>
          <p>Thông tin của bạn chỉ được dùng để xác nhận và giao đơn hàng PestShield. Chúng tôi không bán, trao đổi hay chia sẻ dữ liệu cá nhân cho bất kỳ bên thứ ba nào vì mục đích thương mại.</p>
          <h5 className="font-bold text-slate-900">3. Công nghệ theo dõi</h5>
          <p>Website <strong>thuocxitmuoi.com</strong> sử dụng Google Analytics và Meta Pixel để phân tích hành vi truy cập và tối ưu quảng cáo. Dữ liệu này được thu thập dưới dạng ẩn danh, không chứa thông tin định danh cá nhân trực tiếp.</p>
          <h5 className="font-bold text-slate-900">4. Bảo mật dữ liệu</h5>
          <p>Toàn bộ thông tin khách hàng được lưu trữ trên hệ thống bảo mật. Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ: <strong>lienhe@thuocxitmuoi.com</strong>.</p>
        </div>
      )
    },
    terms: {
      title: "Điều khoản dịch vụ",
      body: (
        <div className="space-y-4 text-sm text-slate-600">
          <p>Bằng việc đặt hàng tại <strong>thuocxitmuoi.com</strong>, bạn xác nhận đã đọc và đồng ý với các điều khoản sau:</p>
          <h5 className="font-bold text-slate-900">1. Thông tin đặt hàng</h5>
          <p>Bạn cam kết cung cấp thông tin chính xác (họ tên, số điện thoại, địa chỉ) để đảm bảo đơn hàng được giao đúng nơi, đúng người.</p>
          <h5 className="font-bold text-slate-900">2. Hiệu quả sản phẩm PestShield</h5>
          <p>PestShield là dung dịch xịt muỗi &amp; côn trùng từ hoạt chất thiên nhiên, hiệu lực bảo vệ lên đến 6 tháng khi sử dụng đúng hướng dẫn. Hiệu quả thực tế phụ thuộc vào điều kiện môi trường và tần suất thông gió của không gian sử dụng.</p>
          <h5 className="font-bold text-slate-900">3. Trách nhiệm người dùng</h5>
          <p>Người dùng cần đọc kỹ hướng dẫn in trên bao bì trước khi dùng, không xịt trực tiếp vào thực phẩm, đồ chơi trẻ em, hoặc nơi nuôi cá/chim cảnh.</p>
          <h5 className="font-bold text-slate-900">4. Giới hạn trách nhiệm</h5>
          <p>Thuocxitmuoi.com không chịu trách nhiệm với các thiệt hại phát sinh do sử dụng sai hướng dẫn hoặc phối hợp với hóa chất khác mà chưa được tư vấn.</p>
        </div>
      )
    },
    warranty: {
      title: "Cam kết Chất lượng & Đổi trả",
      body: (
        <div className="space-y-4 text-sm text-slate-600">
          <h5 className="font-bold text-slate-900">1. Cam kết chất lượng</h5>
          <p><strong>PestShield</strong> là sản phẩm xịt muỗi &amp; côn trùng từ hoạt chất gốc thiên nhiên, được kiểm định về độ an toàn cho người và vật nuôi. Mỗi chai xuất xưởng đều đạt chuẩn nồng độ hoạt chất quy định, đảm bảo hiệu lực bảo vệ đúng như công bố.</p>
          <h5 className="font-bold text-slate-900">2. Chính sách đổi trả</h5>
          <ul className="list-disc pl-5 space-y-2">
            <li>Đổi mới 100% nếu chai bị lỗi, hư hỏng, hoặc rò rỉ do lỗi sản xuất / vận chuyển.</li>
            <li>Khách hàng được kiểm tra hàng thực tế trước khi thanh toán (COD).</li>
            <li>Không hỗ trợ đổi trả nếu sản phẩm đã qua sử dụng và không có lỗi từ nhà sản xuất.</li>
          </ul>
          <h5 className="font-bold text-slate-900">3. Hỗ trợ sau mua</h5>
          <p>Đội ngũ hỗ trợ của Thuocxitmuoi.com luôn sẵn sàng tư vấn cách xịt đúng kỹ thuật để đạt hiệu quả tối đa. Liên hệ Hotline/Zalo <strong>0978 38 05 08</strong> hoặc email <strong>lienhe@thuocxitmuoi.com</strong>.</p>
        </div>
      )
    },
    shipping: {
      title: "Chính sách vận chuyển",
      body: (
        <div className="space-y-4 text-sm text-slate-600">
          <h5 className="font-bold text-slate-900">1. Phạm vi giao hàng</h5>
          <p>Thuocxitmuoi.com giao hàng toàn quốc — tất cả 63 tỉnh thành Việt Nam, thông qua các đơn vị vận chuyển uy tín (GHTK, GHN, J&amp;T).</p>
          <h5 className="font-bold text-slate-900">2. Thời gian giao hàng</h5>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Nội thành TP. HCM:</strong> 1 – 2 ngày làm việc.</li>
            <li><strong>Tỉnh thành khác:</strong> 2 – 4 ngày làm việc tùy khu vực.</li>
          </ul>
          <h5 className="font-bold text-slate-900">3. Phí vận chuyển</h5>
          <p>Áp dụng <strong>Miễn phí vận chuyển (Free Ship)</strong> cho tất cả đơn hàng PestShield trên toàn quốc. Không phụ thu thêm bất kỳ khoản nào.</p>
          <h5 className="font-bold text-slate-900">4. Hình thức thanh toán</h5>
          <p>Thanh toán khi nhận hàng (<strong>COD</strong>) — kiểm tra hàng trước, hài lòng mới trả tiền.</p>
          <h5 className="font-bold text-slate-900">5. Theo dõi đơn hàng</h5>
          <p>Sau khi đơn được gửi đi, nhân viên sẽ nhắn mã vận đơn qua Zalo/SMS để bạn tra cứu trạng thái giao hàng trực tiếp trên app của đơn vị vận chuyển.</p>
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
  { name: "Bác Hùng",  age: 62, loc: "Hà Nội",    combo: "Combo 2 Chai PestShield",  avatar: "/hungmin.webp",  rating: 5, photo: "/rv1.webp", text: "Nhà tôi muỗi, kiến, gián nhiều lắm — nhất là mùa mưa. Xịt PestShield một lần, sáng hôm sau gom được cả mớ. Không ngờ hiệu quả nhanh vậy, hơn mấy loại xịt ngoài chợ xa lắm!" },
  { name: "Cô Lan",    age: 55, loc: "TP. HCM",   combo: "Combo 2 Chai PestShield",  avatar: "/colanmin.webp",   rating: 4, photo: "/rv2.webp", text: "Nhà tôi gián và muỗi nhiều lắm, xịt đủ thứ mà không ăn thua. Từ khi dùng PestShield, xịt xong sáng ra thấy gián nằm la liệt. Không mùi hắc, có cháu nhỏ tôi vẫn yên tâm." },
  { name: "Anh Tuấn",  age: 45, loc: "Đà Nẵng",  combo: "1 Chai PestShield", avatar: "/anhtuanmin.webp",  rating: 5, photo: "/rv3.webp", text: "Giao hàng nhanh, đóng gói cẩn thận. Căn hộ 40m² dùng 1 chai là đủ, muỗi và kiến giảm hẳn sau 1 tuần. Dùng xong tôi giới thiệu ngay cho cả nhóm công ty." },
  { name: "Bác Minh",  age: 58, loc: "Cần Thơ",   combo: "Combo 3 Chai PestShield",  avatar: "/bacminhmin.webp",  rating: 4, photo: "/rv4.webp", text: "Nhà tôi 3 tầng, muỗi nhiều từ kênh rạch. Mua combo 3 chai xịt toàn bộ, hiệu quả kéo dài gần 6 tháng không cần xịt lại. Rất đáng tiền, hơn cả dịch vụ phun ngoài." },
  { name: "Cô Hoa",    age: 51, loc: "Hải Phòng", combo: "Combo 2 Chai PestShield",  avatar: "/cohoamin.webp",   rating: 5, photo: "/rv5.webp", text: "Nhà tôi gần vườn cây, tối là muỗi ngoài bay vào ào ào. Xịt PestShield 1 cái, sáng ra quét được cả mớ — nhiều không ngờ! Từ đó tối ngủ không cần đóng kín cửa nữa." },
  { name: "Chú Thành", age: 64, loc: "Bình Dương",combo: "Combo 2 Chai PestShield",  avatar: "/chuthanhmin.webp", rating: 4, photo: "/rv6.webp", text: "Xịt PestShield xong sáng hôm sau gom được cả đống muỗi bị diệt — thấy mà mừng! Trước tốn mấy trăm gọi dịch vụ phun mà chỉ hiệu quả 1–2 tháng. Giờ tự làm được, tiết kiệm hơn nhiều." },
  { name: "Chị Nga",   age: 47, loc: "Đồng Nai",  combo: "1 Chai PestShield", avatar: "/chingamin.webp",   rating: 5, photo: "/rv7.webp", text: "Xịt xong sáng ra gom lại cả mớ muỗi bị diệt, không ngờ nhiều vậy! Nhà có 2 con mèo nên tôi rất cẩn thận, nhưng PestShield an toàn thật — cho mèo vào lại sau 30 phút, không sao cả." },
  { name: "Bác Sơn",   age: 60, loc: "Quảng Nam", combo: "Combo 3 Chai PestShield",  avatar: "/bacsonmin.webp",   rating: 4, photo: "/rv8.webp", text: "Nhà vườn rộng, muỗi từ bụi cây nhiều vô kể. Đặt combo 3 chai xịt cả trong lẫn ngoài hiên. Sau 1 tuần ngồi sân không cần kem chống muỗi nữa — tuyệt vời!" },
  { name: "Cô Mai",    age: 53, loc: "Vũng Tàu",  combo: "Combo 2 Chai PestShield",  avatar: "/comaimin.webp",   rating: 5, photo: "/rv9.webp", text: "Mua về dùng thấy hiệu quả nên đặt thêm biếu hàng xóm. Ai cũng khen PestShield dễ xịt, không cần gọi thợ. Freeship tận nhà, trả tiền khi nhận, rất yên tâm." },
];

// ── FAQ data (accordion) ──
const FAQS = [
  {
    q: "PestShield xịt 1 lần sao hiệu lực được 6 tháng?",
    a: "Hoạt chất PestShield bám chắc vào bề mặt sau khi xịt, không bay hơi, không bị nước trôi.\nMuỗi, gián, kiến bò qua vùng xịt là bị tê liệt ngay — không cần xịt trúng từng con.\nHiệu lực duy trì liên tục suốt 6 tháng mà không cần xịt lại.",
  },
  {
    q: "PestShield có an toàn cho trẻ nhỏ và thú cưng không?",
    a: "Hoàn toàn an toàn. Chiết xuất thực vật thiên nhiên 100%, khô hoàn toàn sau 30 phút, không mùi.\nSau 30 phút xịt, trẻ nhỏ bò sàn, thú cưng đi lại bình thường — không ảnh hưởng gì.",
  },
  {
    q: "PestShield diệt được những loại côn trùng nào?",
    a: "Diệt muỗi, gián, kiến, ruồi, bọ chét và hầu hết côn trùng bò trong nhà.\n1 chai xắt xử lý được tất cả — không cần mua riêng từng loại.",
  },
  {
    q: "Xịt như thế nào? Có cần kinh nghiệm không?",
    a: "Không cần kinh nghiệm. Cầm chai xịt vào chân tường, góc nhà, gầm bếp, cửa ra vào.\nGiữ cách bề mặt 20cm, xịt 1 lượt mỏng là xong.\nRa ngoài 30 phút cho khô, về nhà sinh hoạt bình thường.",
  },
  {
    q: "Giao hàng toàn quốc không? Có mất phí ship không?",
    a: "Giao 63 tỉnh thành toàn quốc, miễn phí ship 100%.\nNội thành TP.HCM 1–2 ngày, tỉnh khác 2–4 ngày.\nCOD — kiểm tra hàng thực tế trước khi trả tiền.",
  },
  {
    q: "PestShield rẻ hơn thuê dịch vụ phun bao nhiêu?",
    a: "Rẻ hơn 10 lần. Chi phí cả năm chỉ 298.000đ (combo 2 chai) thay vì 3–9 triệu nếu thuê dịch vụ phun.\nHiệu quả gấp 20+ lần nhang và chai xịt thường mua ở siêu thị.",
  },
  {
    q: "Nên chọn gói 1 chai hay 2 chai?",
    a: "Gói 1 chai (209.000đ): phù hợp nhà ≤50m² hoặc dùng thử.\nGói 2 chai (298.000đ): phù hợp nhà 50–120m², xịt 1 lần 6 tháng, 2 chai dùng đủ cả năm — được chọn nhiều nhất vì tiết kiệm hơn.",
  },
  {
    q: "Đặt hàng lần đầu, nếu không hài lòng thì sao?",
    a: "Thanh toán COD — bạn kiểm tra hàng tận tay trước khi trả tiền.\nThấy hàng không đúng hoặc bị lỗi, từ chối ngay, không mất đồng nào.\nĐổi mới miễn phí nếu chai bị lỗi từ nhà sản xuất.",
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
  // ── GTM: init + page view + scroll depth + bot detection ──────────────────
  useEffect(() => {
    initGTM();
    trackPageView();

    // Bot detection sau 5 giây
    const botTimer = setTimeout(trackBotDetection, 5000);

    // Scroll depth 25/50/75/90%
    const fired = new Set<number>();
    const thresholds = [25, 50, 75, 90] as const;
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.floor((scrolled / total) * 100);
      for (const t of thresholds) {
        if (!fired.has(t) && pct >= t) {
          fired.add(t);
          trackScrollDepth(t);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(botTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

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
        const comboPrice = { combo1: 209000, combo2: 298000, combo3: 397000 }[data.combo as string] ?? 0;
        trackFormSubmit(getComboName(data.combo), comboPrice, result.orderId ?? '');
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
        const comboPrice = { combo1: 209000, combo2: 298000, combo3: 397000 }[data.combo as string] ?? 0;
        trackPurchase(getComboName(data.combo), comboPrice, pendingOrderId ?? '');
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
    { name: "Anh Thanh", loc: "Hà Nội", combo: "Combo 2 Chai PestShield", time: "5 phút trước" },
    { name: "Chị Lan", loc: "TP. Hồ Chí Minh", combo: "1 Chai PestShield", time: "15 phút trước" },
    { name: "Bác Hùng", loc: "Đà Nẵng", combo: "Combo 3 Chai PestShield", time: "30 phút trước" },
    { name: "Cô Mai", loc: "Hải Phòng", combo: "Combo 2 Chai PestShield", time: "45 phút trước" },
    { name: "Anh Tuấn", loc: "Cần Thơ", combo: "1 Chai PestShield", time: "1 giờ trước" },
    { name: "Chị Hoa", loc: "Bình Dương", combo: "Combo 2 Chai PestShield", time: "20 phút trước" },
    { name: "Bác Nam", loc: "Đồng Nai", combo: "Combo 3 Chai PestShield", time: "40 phút trước" },
    { name: "Chị Phượng", loc: "Nghệ An", combo: "1 Chai PestShield", time: "10 phút trước" },
    { name: "Chú Bình", loc: "Quảng Nam", combo: "Combo 2 Chai PestShield", time: "35 phút trước" },
    { name: "Bà Liên", loc: "Vũng Tàu", combo: "Combo 3 Chai PestShield", time: "50 phút trước" },
    { name: "Anh Dũng", loc: "Huế", combo: "1 Chai PestShield", time: "25 phút trước" },
    { name: "Chị Thảo", loc: "Long An", combo: "Combo 2 Chai PestShield", time: "1 giờ trước" },
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
            className="fixed top-16 md:top-auto md:bottom-8 left-4 z-[60] bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-2.5 flex items-center gap-2.5 max-w-[252px] md:max-w-[300px]"
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
                  <div className="flex flex-col items-center sm:items-start gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => { trackCTAClick('Đặt Combo 2 Chai', 'hero'); scrollToOrder(); }}
                      className="group flex items-center justify-center gap-2.5 bg-orange-500 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 w-full whitespace-nowrap"
                    >
                      <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                      <span className="whitespace-nowrap">Đặt Combo 2 Chai — Bảo Vệ Cả Năm</span>
                      <ChevronRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-sm font-semibold text-slate-600 text-center sm:text-left whitespace-nowrap">✅ Tiết kiệm 120.000đ · 🚚 Giao COD · ⚡ Xịt 1 lần</p>
                  </div>
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
              <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4">Muỗi, Gián, Kiến Trong Nhà — Tưởng Nhỏ, Hậu Quả Không Nhỏ</h2>
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
                  line1: "Sốt xuất huyết, virus zika — muỗi là nguồn lây chính.",
                  line2: "Một đêm bị đốt là một đêm không yên.",
                  mobileBreak: true,
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
                      {item.line1}{item.mobileBreak ? <br className="sm:hidden" /> : <br />}{item.line2}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center mt-10 text-base md:text-lg font-semibold text-slate-700 max-w-2xl mx-auto">
              Xử lý đúng cách từ đầu —<br className="sm:hidden" /> tiết kiệm tiền, bảo vệ sức khoẻ cả nhà.
            </p>
            <div className="flex flex-col items-center mt-6 gap-2">
              <button
                onClick={scrollToPricing}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base md:text-lg px-7 py-3 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all duration-200"
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-yellow-300" />
                Xử Lý Ngay Hôm Nay
              </button>
              <span className="text-xs text-slate-500 font-medium">Giao hàng toàn quốc · Dùng được ngay · Bảo vệ lâu dài</span>
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
                    src="/6thangtuduc.webp"
                    alt="Tại sao PestShield xịt 1 lần hiệu lực 6 tháng – hoạt chất bám dính bề mặt"
                    className="w-full h-auto block"
                    loading="lazy"
                    width={1500}
                    height={1500}
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 lg:mb-4 text-center lg:text-left">Tại Sao Xịt 1 Lần Mà Hiệu Lực 6 Tháng?</h2>
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-5 lg:mb-6 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  14.800+ gia đình đã dùng · Đánh giá 4.9/5
                </div>

                {/* Mobile Image - Product Showcase */}
                <div className="lg:hidden mb-6 relative">
                  <div className="absolute -inset-3 bg-emerald-100 rounded-3xl blur-2xl opacity-40"></div>
                  <div className="relative rounded-3xl shadow-xl w-full max-w-sm mx-auto overflow-hidden">
                    <img
                      src="/6thangtuduc.webp"
                      alt="Tại sao PestShield xịt 1 lần hiệu lực 6 tháng – hoạt chất bám dính bề mặt"
                      className="w-full h-auto block"
                      loading="lazy"
                      width={1500}
                      height={1500}
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
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <p className="text-emerald-800 font-bold text-base md:text-lg leading-snug">
                    Không phải xịt mạnh hơn — mà <span className="text-emerald-600 underline underline-offset-4 decoration-emerald-400">xịt đúng cách hơn</span>.
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
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2">Chi phí & Hiệu quả thực tế</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Cùng Tốn Tiền —{' '}
                <span className="text-emerald-600">Kết Quả Khác Nhau Hoàn Toàn</span>
              </h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Nhiều gia đình tốn 1–2 triệu/năm mà muỗi vẫn còn.<br />
                Xem so sánh trước khi quyết định.
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
                      🛡️ PESTSHIELD
                      <div className="text-white/70 font-normal text-xs mt-1">209.000đ — 1 chai</div>
                    </th>
                    <th className="p-5 font-bold text-center bg-orange-900/90 text-orange-100 text-base w-[26%]">
                      🧑‍🔧 Thuê dịch vụ phun
                      <div className="text-orange-300/80 font-normal text-xs mt-1">500k–1.5tr/lần</div>
                    </th>
                    <th className="p-5 font-bold text-center bg-slate-700 text-slate-200 text-base w-[26%]">
                      🦟 Nhang & chai xịt thường
                      <div className="text-slate-400 font-normal text-xs mt-1">200k/tháng</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Chi phí",
                      samurai: "209.000đ — 1 chai",
                      service: "500k–1.5tr/lần",
                      normal: "200k/tháng",
                    },
                    {
                      label: "Hiệu lực",
                      samurai: "6 tháng/lần xịt",
                      service: "1–2 tháng tái phát",
                      normal: "2–4 giờ hết tác dụng",
                    },
                    {
                      label: "Phải làm lại?",
                      samurai: "Không — xịt 1 lần",
                      service: "Đặt lịch, chờ 3–7 ngày",
                      normal: "Xịt lại mỗi ngày",
                    },
                    {
                      label: "Mùi hóa chất",
                      samurai: "Không mùi",
                      service: "Phải rời nhà 2–4 giờ",
                      normal: "Mùi khó chịu",
                    },
                    {
                      label: "An toàn trẻ em",
                      samurai: "Thiên nhiên 100%",
                      service: "⚠️ Hóa chất công nghiệp",
                      normal: "⚠️ Không khuyến nghị",
                    },
                    {
                      label: "Chi phí 1 năm",
                      samurai: "298.000đ",
                      service: "3–9 triệu",
                      normal: "2.4 triệu",
                      highlight: true,
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

            {/* Desktop Bottom note + CTA */}
            <div className="hidden md:flex flex-col items-center gap-4 mt-8">
              <p className="text-center text-base font-semibold text-slate-700">
                Tiết kiệm hơn 10 lần so với thuê dịch vụ —{' '}
                <span className="text-emerald-600">hiệu quả gấp 20+ lần chai xịt thường.</span>
              </p>
              <button
                onClick={scrollToPricing}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all duration-200"
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-yellow-300" />
                Đặt Ngay — Rẻ Hơn Thuê Dịch Vụ, Dùng Cả Năm
              </button>
              <span className="text-sm text-slate-500 font-medium">298.000đ · 2 chai · Bảo vệ cả nhà suốt 12 tháng+</span>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">

              {/* Hook */}
              <div className="bg-emerald-700 rounded-2xl py-5 px-4 text-center shadow-lg shadow-emerald-900/30">
                <p className="text-white/80 text-sm mb-1 font-medium">Dùng PestShield — tiết kiệm hơn</p>
                <p className="text-yellow-300 font-black text-4xl leading-none tracking-tight">10 lần</p>
                <p className="text-white/70 text-sm mt-1.5">so với thuê dịch vụ phun · hiệu quả gấp 20+ lần nhang xịt</p>
              </div>

              {/* Compact table */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                <div className="grid grid-cols-[90px_1fr_1fr]">
                  <div className="bg-slate-800 p-3" />
                  <div className="bg-emerald-600 py-3 px-2 text-center border-l border-emerald-500">
                    <p className="text-white font-black text-sm leading-tight">🛡️ PESTSHIELD</p>
                    <p className="text-emerald-100 text-xs mt-0.5">209.000đ</p>
                  </div>
                  <div className="bg-slate-600 py-3 px-2 text-center border-l border-slate-500">
                    <p className="text-slate-100 font-bold text-sm leading-tight">🔧 Cách khác</p>
                    <p className="text-slate-300 text-xs mt-0.5">500k–1.5tr</p>
                  </div>
                </div>

                {[
                  { icon: "💸", label: "Chi phí", samurai: "209.000đ", bad: "200k/th–1.5tr" },
                  { icon: "⏱️", label: "Hiệu lực", samurai: "6 tháng", bad: "Vài ngày–tháng" },
                  { icon: "🔁", label: "Làm lại?", samurai: "Không cần", bad: "Liên tục" },
                  { icon: "🌿", label: "An toàn", samurai: "Thiên nhiên", bad: "Hóa chất" },
                  { icon: "💰", label: "1 năm", samurai: "~209.000đ", bad: "2.4–9 triệu", highlight: true },
                ].map((row, i) => (
                  <div key={i} className={cn("grid grid-cols-[90px_1fr_1fr] border-t border-slate-100", row.highlight ? "bg-yellow-50" : i % 2 === 0 ? "bg-white" : "bg-slate-50/40")}>
                    <div className="p-3 flex flex-col justify-center bg-slate-50 border-r border-slate-100">
                      <span className="text-lg leading-none mb-1">{row.icon}</span>
                      <span className="text-[11px] font-bold text-slate-600 leading-tight">{row.label}</span>
                    </div>
                    <div className={cn("p-3 flex flex-col items-center justify-center border-r border-slate-100", row.highlight ? "bg-emerald-50" : "bg-emerald-50/30")}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1 flex-shrink-0" />
                      <p className="font-black text-emerald-800 text-sm text-center leading-tight">{row.samurai}</p>
                    </div>
                    <div className="p-3 flex flex-col items-center justify-center">
                      <XCircle className="w-4 h-4 text-orange-400 mb-1 flex-shrink-0" />
                      <p className="text-sm text-slate-500 italic text-center leading-tight">{row.bad}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm font-semibold text-slate-600 pt-1">
                Tiết kiệm hơn 10 lần — <span className="text-emerald-600">hiệu quả gấp 20+ lần.</span>
              </p>

              {/* Mobile CTA */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <button
                  onClick={scrollToPricing}
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base px-6 py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all duration-200"
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 text-yellow-300" />
                  <span>Đặt Ngay — Rẻ Hơn Thuê Dịch Vụ, Dùng Cả Năm</span>
                </button>
                <span className="text-xs text-slate-500 font-medium text-center">298.000đ · 2 chai · Bảo vệ cả nhà suốt 12 tháng+</span>
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
              <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight">Xịt 5 Phút — Bảo Vệ Cả Nhà 6 Tháng</h2>
              <p className="text-slate-500 text-base">3 bước đơn giản — không cần kinh nghiệm</p>
            </div>

            {/* Illustration image */}
            <div className="mb-8 md:mb-12 max-w-md mx-auto md:max-w-lg rounded-2xl overflow-hidden shadow-md border border-slate-100">
              <img
                src="/cachsudung.webp"
                alt="Cách sử dụng chai xịt muỗi PestShield – 3 bước đơn giản"
                className="w-full h-auto block"
                loading="lazy"
                width={1024}
                height={1024}
              />
            </div>

            {/* Steps - Mobile: vertical / Desktop: horizontal */}
            <div className="flex flex-col md:flex-row md:items-stretch gap-0 md:gap-0">
              {[
                {
                  num: "1",
                  time: "2 phút",
                  title: "Xác định điểm xịt",
                  desc: "Chân tường, góc nhà, gầm bếp, cửa ra vào — nơi Muỗi và côn trùng hay xuất hiện.",
                  icon: "🔍",
                },
                {
                  num: "2",
                  time: "3 phút",
                  title: "Xịt đều vào các điểm",
                  desc: "Giữ chai cách bề mặt 20cm, xịt 1 lượt mỏng. Không cần xịt nhiều.",
                  icon: '💦',
                },
                {
                  num: "3",
                  time: "Xong. Để khô 30 phút",
                  title: "Ra ngoài — về sinh hoạt bình thường",
                  desc: "Ra ngoài 30 phút cho khô. Về nhà sinh hoạt bình thường — hiệu lực giữ nguyên 6 tháng.",
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
                  <span className="font-bold text-slate-800">Mẹo:</span> Xịt vào buổi tối hiệu quả hơn — côn trùng hoạt động nhiều về đêm, tiếp xúc hoạt chất nhanh hơn.
                </p>
              </div>
              <button onClick={scrollToPricing} className="flex-shrink-0 bg-orange-500 text-white font-black text-sm px-6 py-3 rounded-xl hover:bg-orange-600 transition-all whitespace-nowrap shadow-md shadow-orange-100">
                ĐẶT MUA NGAY
              </button>
            </div>

          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-10 md:py-16 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-10 md:mb-12">
              <p className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-3">📦 Giao hàng toàn quốc · COD tận nơi</p>
              <h2 className="text-2xl md:text-4xl font-black mb-3 leading-tight">Chọn Gói Phù Hợp — Xịt 1 Lần, Không Lo Cả Năm</h2>
              <p className="text-slate-400 text-sm md:text-base">Miễn phí giao hàng · Kiểm tra hàng trước khi thanh toán · COD toàn quốc</p>
            </div>

            {/* Cards grid */}
            <div className="flex flex-col md:grid md:grid-cols-3 md:items-stretch gap-4">

              {/* ── COMBO 2 CHAI HERO – mobile: top, desktop: middle ── */}
              <div className="order-first md:order-2 relative flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-slate-900" />
                    ĐƯỢC CHỌN NHIỀU NHẤT
                  </span>
                </div>
                <div className="bg-gradient-to-b from-blue-950 to-slate-900 rounded-2xl p-5 md:p-6 border-2 border-amber-400 shadow-xl shadow-blue-950/70 mt-5 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-white tracking-tight mb-0.5">COMBO 2 CHAI</h3>
                  <p className="text-blue-200 text-sm mb-1 font-medium">Nhà phố · 50–100m²</p>

                  {/* Price block */}
                  <div className="bg-black/30 rounded-xl px-4 py-3 mb-4 mt-2">
                    <p className="text-blue-300 text-xs mb-1">Giá gốc: <span className="line-through text-blue-400">418.000đ</span></p>
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-4xl font-black text-white">298.000đ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded">TIẾT KIỆM 120K</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {[
                      { text: '2 chai PestShield 500ml', star: true },
                      { text: 'Bảo vệ đủ nhà 50–100m²' },
                      { text: 'Dùng 1 năm không mua thêm' },
                      { text: 'Đủ dùng 2 tầng hoặc tặng người thân' },
                      { text: 'Miễn phí giao hàng toàn quốc' },
                      { text: 'Kiểm tra hàng trước khi nhận' },
                    ].map((item, i) => (
                      <li key={i} className={cn('flex items-center gap-2.5', item.star ? 'text-sm font-black text-amber-300' : 'text-sm text-blue-100/80')}>
                        <CheckCircle2 className={cn('flex-shrink-0', item.star ? 'w-4 h-4 text-amber-400' : 'w-4 h-4 text-blue-400/60')} />
                        {item.text}
                      </li>
                    ))}
                  </ul>

                  {/* Urgency strip */}
                  <div className="mb-3 rounded-xl overflow-hidden border border-red-400/40">
                    <div className="bg-red-600 px-3 py-1.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-100"></span>
                        </span>
                        <span className="text-white text-xs font-black uppercase tracking-wide truncate">⚡ Hàng có hạn trong ngày</span>
                      </div>
                      <span className="bg-white text-red-600 text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 shadow-sm">Còn {stockRemaining} suất</span>
                    </div>
                    <div className="bg-red-950/60 px-3 py-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm flex-shrink-0">🔥</span>
                        <p className="text-red-200 text-xs font-semibold leading-snug">Chỉ còn <span className="font-black text-white">{stockRemaining} suất</span> — hết là về giá gốc.</p>
                      </div>
                      {(() => { const t = formatMidnight(midnightCountdownSecs); return (
                        <div className="flex-shrink-0 flex items-center gap-0.5 bg-black/40 rounded-lg px-2 py-1">
                          <span className="font-black text-white text-xs tabular-nums">{t.h}</span>
                          <span className="text-red-300 text-xs font-black">:</span>
                          <span className="font-black text-white text-xs tabular-nums">{t.m}</span>
                          <span className="text-red-300 text-xs font-black">:</span>
                          <span className="font-black text-amber-300 text-xs tabular-nums">{t.s}</span>
                        </div>
                      ); })()}
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToOrderWithCombo('combo2')}
                    className="w-full py-4 rounded-xl bg-amber-400 text-slate-900 font-black text-base md:text-sm lg:text-base hover:bg-amber-300 transition-all active:scale-95 shadow-lg shadow-amber-900/30"
                  >
                    ✔ Chọn Combo 2 — Bảo Vệ Cả Năm
                  </button>
                </div>
              </div>

              {/* ── GÓI NHÀ NHỎ – mobile: 2nd, desktop: left ── */}
              <div className="order-2 md:order-1 flex flex-col">
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col flex-1">
                  <h3 className="text-lg font-black text-slate-100 mb-0.5">1 CHAI PESTSHIELD</h3>
                  <p className="text-slate-300 text-sm mb-1 font-medium">Căn hộ · Nhà ≤ 50m²</p>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-white">209.000đ</span>
                  </div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {[
                      "1 chai PestShield 500ml",
                      "Bảo vệ đủ nhà ≤ 50m²",
                      "Hiệu lực 6 tháng",
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
                    className="w-full py-3.5 rounded-xl bg-white text-slate-800 border-2 border-slate-300 font-black text-base hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-95"
                  >
                    CHỌN GÓI NÀY
                  </button>
                </div>
              </div>

              {/* ── COMBO 3 CHAI – mobile: 3rd, desktop: right ── */}
              <div className="order-3 md:order-3 flex flex-col">
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-lg font-black text-slate-100">COMBO 3 CHAI</h3>
                    <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full whitespace-nowrap">Tiết kiệm nhất</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3 font-medium">Nhà rộng · &gt; 100m²</p>
                  <div className="mb-4">
                    <p className="text-slate-400 text-xs mb-1">Giá gốc: <span className="line-through text-slate-500">627.000đ</span></p>
                    <span className="text-3xl font-black text-white">397.000đ</span>
                    <div className="mt-1.5">
                      <span className="bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded">TIẾT KIỆM 230K</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {[
                      '3 chai PestShield 500ml',
                      'Bảo vệ nhà > 100m² hoặc nhiều tầng',
                      'Mua chung gia đình — chia 3 nhà',
                      'Miễn phí giao hàng toàn quốc',
                      'Kiểm tra hàng trước khi nhận',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollToOrderWithCombo('combo3')}
                    className="w-full py-3.5 rounded-xl bg-slate-600 text-white font-black text-base hover:bg-slate-500 transition-all active:scale-95"
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
              <h2 className="text-xl md:text-3xl font-black mb-2 uppercase tracking-tight">Khách Hàng Nói Gì Về PestShield?</h2>
              <div className="flex justify-center gap-0.5 text-amber-400 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-500 text-base font-medium">14.800+ khách hàng đã tin dùng PestShield trên toàn quốc</p>
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
                    <img src={t.photo} alt="Ảnh thực tế khách hàng dùng PestShield tại nhà" className="w-full aspect-[4/3] object-cover object-top" loading="lazy" width={600} height={450} sizes="(max-width: 640px) 82vw, 310px" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-slate-100" />
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
                    <img src={t.photo} alt="Ảnh thực tế khách hàng dùng PestShield tại nhà" className="w-full h-[180px] object-cover object-top" loading="lazy" width={600} height={450} sizes="33vw" />
                  ) : (
                    <div className="w-full h-[180px] bg-slate-100" />
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
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Câu Hỏi Thường Gặp Về PestShield</h2>
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

            {/* CTA sau FAQ */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                onClick={scrollToOrder}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all"
              >
                <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                Đặt Hàng Ngay — Giao COD Toàn Quốc
              </button>
              <span className="text-xs text-slate-500 font-medium">Miễn phí giao hàng · Kiểm tra hàng trước khi trả tiền</span>
            </div>
          </div>
        </section>

        {/* Order Form Section */}
        <section id="order-section" className="py-8 md:py-14 bg-gradient-to-b from-emerald-50 to-teal-50 border-t-4 border-emerald-600">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-3">
                🎁 TIẾT KIỆM 120.000Đ – CHỈ HÔM NAY
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
              <div className="bg-green-600 px-4 py-3 grid grid-cols-3 gap-1 text-white text-xs font-bold">
                {[
                  { icon: '🔍', text: 'Xem trước khi nhận' },
                  { icon: '💰', text: 'Trả tiền sau' },
                  { icon: '🚚', text: 'Ship miễn phí' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 text-center">
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className="leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-7 space-y-5">

                {/* Product Image */}
                <div className="flex justify-center my-2">
                  <img
                    src="/products2.webp"
                    alt="Chai xịt Muỗi &amp; Côn trùng PestShield - 1 Chai, Combo 2 Chai, Combo 3 Chai"
                    className="w-full max-w-xs md:max-w-md h-auto rounded-2xl shadow-xl border border-slate-100"
                    loading="lazy"
                    width={1376}
                    height={768}
                  />
                </div>

                {/* Bước 1: Combo – compact 3-col selector */}
                <div id="combo-step">
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Bước 1 — Chọn gói</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'combo1', emoji: '🏠', name: '1 CHAI', sub: '1 chai · Nhà ≤50m²', price: '209.000đ' },
                      { value: 'combo2', emoji: '🏡', name: 'COMBO 2 CHAI', sub: '2 chai · Nhà 50–100m²', price: '298.000đ', recommended: true },
                      { value: 'combo3', emoji: '🏢', name: 'COMBO 3 CHAI', sub: '3 chai · Nhà >100m²', price: '397.000đ' },
                    ].map((item) => (
                      <label key={item.value} className={cn(
                        "relative flex flex-col items-center text-center p-3.5 sm:p-3 rounded-2xl border-2 cursor-pointer transition-all select-none",
                        selectedCombo === item.value
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      )}>
                        <input
                          type="radio"
                          {...register("combo", { required: true })}
                          value={item.value}
                          checked={selectedCombo === item.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            const price = { combo1: 209000, combo2: 298000, combo3: 397000 }[val] ?? 0;
                            setSelectedCombo(val);
                            setValue('combo', val);
                            trackSelectPackage(getComboName(val), price);
                          }}
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
                        <span className="text-2xl mb-1">{item.emoji}</span>
                        <span className={cn("text-xs font-black leading-tight mb-1", selectedCombo === item.value ? "text-emerald-700" : "text-slate-700")}>
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-500 mb-1.5 leading-tight">{item.sub}</span>
                        <span className={cn("text-base font-black", selectedCombo === item.value ? "text-emerald-600" : "text-slate-800")}>
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
                        className="mt-3 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg"
                      >
                        {/* Header */}
                        <div className="bg-emerald-500 px-4 py-2.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="text-white text-sm font-black leading-snug">🔥 Khoan đã!</span>
                          <span className="text-emerald-50 text-xs font-bold leading-snug">Chỉ thêm <strong className="text-white">89.000đ</strong> → nâng lên Combo 2 Chai – Bảo vệ cả nhà 1 năm</span>
                        </div>
                        {/* Body */}
                        <div className="bg-emerald-50 px-4 py-3 space-y-2">
                          <ul className="space-y-1.5">
                            {[
                              { icon: '🏡', text: '2 chai – xịt đủ nhà phố 2 tầng hoặc nhà 50–100m², không cần mua thêm' },
                              { icon: '💰', text: 'Tiết kiệm 120.000đ so với mua lẻ – đặt 1 lần dùng cả năm, khỏi lo' },
                              { icon: '⚡', text: `Còn ${stockRemaining} suất giá này hôm nay – hết là về giá gốc` },
                            ].map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-emerald-900 leading-snug">
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
                            className="w-full mt-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
                          >
                            ✅ Lấy Combo 2 Chai – 298.000đ · Tiết kiệm 120k
                          </button>
                          <button
                            type="button"
                            onClick={() => setTimeout(() => nameStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)}
                            className="w-full py-1.5 text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors"
                          >
                            Không, lấy 1 chai thôi
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Badge xanh xác nhận khuyến mãi – hiện khi chọn combo2 hoặc combo3 */}
                  <AnimatePresence>
                    {(selectedCombo === 'combo2' || selectedCombo === 'combo3') && (() => {
                      const savingsMap: Record<string, { saved: string; original: string; current: string }> = {
                        combo2: { saved: '120.000đ', original: '418.000đ', current: '298.000đ' },
                        combo3: { saved: '230.000đ', original: '627.000đ', current: '397.000đ' },
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
                      onFocus={trackFormStart}

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
                        className="w-full py-5 rounded-2xl bg-gradient-to-b from-red-600 to-red-700 text-white font-black text-xl md:text-2xl hover:from-red-700 hover:to-red-800 active:scale-95 transition-all shadow-xl shadow-red-900/40 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
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
                      <p className="text-center text-xs text-slate-500 font-medium mt-1.5">🔍 Kiểm tra hàng trước khi trả tiền · 🔒 Bảo mật thông tin</p>
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
                        label: 'Giá khuyến mãi 298.000đ hết lúc 12:00 đêm nay',
                        sub: 'Sau 12h đêm giá trở về 418.000đ – đang tiết kiệm 120.000đ',
                      },
                      combo3: {
                        label: 'Giá khuyến mãi 397.000đ hết lúc 12:00 đêm nay',
                        sub: 'Sau 12h đêm giá trở về 627.000đ – đang tiết kiệm 230.000đ',
                      },
                    };
                    const ctx = comboCtx[selectedCombo] ?? comboCtx.combo2;
                    return (
                      <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        {/* Compact header row */}
                        <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between gap-2">
                          <span className="text-white text-[11px] font-bold flex items-center gap-1.5 leading-tight">
                            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-300"></span>
                            </span>
                            ⏰ {ctx.label}
                          </span>
                          <span className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                            Còn {stockRemaining} suất
                          </span>
                        </div>
                        {/* Timer compact – 1 hàng ngang */}
                        <div className="px-3 py-2.5 flex items-center justify-between gap-3">
                          <p className="text-slate-600 text-xs leading-snug flex-1">{ctx.sub}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {[{ val: ct.h, label: 'giờ' }, { val: ct.m, label: 'phút' }, { val: ct.s, label: 'giây' }].map((seg, i) => (
                              <React.Fragment key={i}>
                                <div className="flex flex-col items-center">
                                  <div className="bg-slate-900 text-white font-black text-base w-10 h-10 rounded-lg flex items-center justify-center tabular-nums tracking-tight shadow-sm">
                                    {seg.val}
                                  </div>
                                  <span className="text-slate-500 text-[11px] font-bold mt-0.5">{seg.label}</span>
                                </div>
                                {i < 2 && <span className="text-slate-400 font-black text-base mb-3 select-none">:</span>}
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
                { emoji: '🚚', title: 'Freeship toàn quốc', sub: 'Nhận hàng – xem hàng – mới trả tiền' },
                { emoji: '🛡️', title: 'An toàn cho người & thú cưng', sub: 'Không độc hại, không mùi khó chịu' },
                { emoji: '⚡', title: 'Xịt 1 lần, hiệu lực 6 tháng', sub: 'Không cần gọi dịch vụ phun lại' },
                { emoji: '🇪🇺', title: 'Công Nghệ Đức - Tiêu Chuẩn Châu Âu', sub: 'Hoạt chất thiên nhiên chiết xuất từ Hoa Cúc' },
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

            {/* Chứng Nhận An Toàn Hoá Chất Châu Âu */}
            <div className="mt-10">
              <h3 className="text-center text-lg sm:text-xl font-extrabold text-slate-800 mb-5 tracking-tight">
                🇪🇺 Chứng Nhận An Toàn Hoá Chất Châu Âu
              </h3>
              <div className="flex justify-center px-4">
                <img
                  src="/chungnhan.webp"
                  alt="Chứng nhận an toàn hoá chất Châu Âu"
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
                <img src="/pslogo.webp" alt="PestShield Logo" className="h-10 w-10 object-contain rounded-lg" loading="lazy" width={40} height={40} />
                <span className="text-xl font-bold tracking-tighter text-white">Thuốc Xịt Muỗi <span className="text-emerald-400">PestShield</span></span>
              </div>
              <p className="text-sm leading-relaxed">
                Thuocxitmuoi.com — chai xịt muỗi &amp; côn trùng PestShield từ hoạt chất thiên nhiên. Xịt 1 lần, bảo vệ cả nhà suốt 6 tháng. An toàn cho trẻ nhỏ &amp; vật nuôi.
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
                  <a href="https://zalo.me/0978380508" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Hotline/Zalo: 0978 38 05 08
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href="mailto:lienhe@thuocxitmuoi.com" className="hover:text-white transition-colors">
                    lienhe@thuocxitmuoi.com
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
            <p>© 2026 - Bản quyền thuộc về Thuocxitmuoi.com - PestShield</p>
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
          className="flex flex-col items-center gap-0.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-orange-300 active:scale-95 transition-all font-black text-center min-w-max"
        >
          <span className="text-base leading-tight">👉 Đặt Hàng Ngay</span>
          <span className="text-xs text-amber-200 font-bold">⚡ Còn {stockRemaining} suất – Giao COD miễn phí</span>
        </button>
      </div>

    </div>
  );
}
