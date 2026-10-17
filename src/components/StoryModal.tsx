import React from 'react';
import { X, Sparkles, Heart, Clock, Compass } from 'lucide-react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] text-[#3D291D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DEC8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#8B5A3C] fill-[#8B5A3C]/20" />
            <h2 className="text-xl font-serif-display font-semibold text-[#3D291D]">
              Câu chuyện SAMORY
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng câu chuyện"
            className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#8C7A6B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#594435]">
          <p className="font-editorial text-lg italic text-[#3D291D]">
            "Thời gian có thể trôi qua rất nhanh, nhưng những ký ức chân thành sẽ mãi ở lại trong trái tim."
          </p>

          <p>
            <strong>SAMORY</strong> được lấy cảm hứng từ mong muốn giữ lại những lát cắt ngọt ngào nhất của cuộc sống: một chuyến đi cùng người thương, một nụ cười ấm áp của người thân yêu, hay đơn giản chỉ là một buổi chiều bình yên bên tách trà.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-[#F0EBE1] border border-[#E2D8C6]">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B5A3C] mb-1">
                <Clock className="w-3.5 h-3.5" /> Bền Vững Với Thời Gian
              </div>
              <p className="text-xs text-[#7D6A5A]">
                Từng tấm ảnh Polaroid được chăm chút như một báu vật vô giá.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#F0EBE1] border border-[#E2D8C6]">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B5A3C] mb-1">
                <Compass className="w-3.5 h-3.5" /> Phong Cách Thanh Lịch
              </div>
              <p className="text-xs text-[#7D6A5A]">
                Sự kết hợp tinh tế giữa nghệ thuật cổ điển và tối giản đương đại.
              </p>
            </div>
          </div>

          <p className="pt-2 text-xs text-[#8C7A6B]">
            Hãy nhắm mắt lại, lắng nghe tiếng nhạc êm dịu và cùng SAMORY nâng niu từng ký ức quý giá của bạn.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8DEC8] flex items-center justify-between">
          <span className="text-xs tracking-[0.2em] font-cinzel text-[#8B5A3C] uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Save Your Memory
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-white bg-[#8B5A3C] hover:bg-[#73472C] rounded-xl shadow transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
