import React, { useState, useRef } from 'react';
import { X, Sparkles, Heart, Camera, Download, Share2, Check } from 'lucide-react';

interface MemoryCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhotoUrl: string;
}

export const MemoryCreatorModal: React.FC<MemoryCreatorModalProps> = ({
  isOpen,
  onClose,
  defaultPhotoUrl,
}) => {
  const [title, setTitle] = useState<string>('Khoảnh khắc ngọt ngào');
  const [date, setDate] = useState<string>('17.10.2026');
  const [note, setNote] = useState<string>('Nơi những nụ cười và kỷ niệm được lưu giữ vẹn nguyên theo năm tháng.');
  const [photoUrl, setPhotoUrl] = useState<string>(defaultPhotoUrl);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintOrSave = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] text-[#3D291D] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DEC8] my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8B5A3C]/10 text-[#8B5A3C] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-serif-display font-semibold text-[#3D291D]">
                Lưu giữ kỷ niệm của bạn (Save Your Memory)
              </h2>
              <p className="text-xs text-[#8C7A6B]">
                Tạo tấm ảnh Polaroid kỷ niệm mang phong cách Samory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng kỷ niệm"
            className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#8C7A6B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-column layout: Form & Polaroid Preview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                Tiêu đề kỷ niệm
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={45}
                placeholder="Ví dụ: Lần đầu hẹn hò, Chuyến đi Đà Lạt..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBA] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]/30 text-[#3D291D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                Ngày tháng / Địa điểm
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                maxLength={30}
                placeholder="Ví dụ: Tháng 10 năm 2026 · Hà Nội"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBA] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]/30 text-[#3D291D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                Lời nhắn nhủ / Cảm xúc
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={120}
                placeholder="Một vài dòng suy nghĩ chân thành..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCBA] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]/30 text-[#3D291D] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                Ảnh kỷ niệm
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#8B5A3C] bg-[#8B5A3C]/5 hover:bg-[#8B5A3C]/10 text-[#8B5A3C] flex items-center justify-center gap-2 text-xs font-medium transition-colors"
              >
                <Camera className="w-4 h-4" />
                Thay đổi hình ảnh kỷ niệm
              </button>
            </div>
          </div>

          {/* Right: Polaroid Card Preview */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-2 self-start">
              Thẻ Polaroid Samory
            </span>

            <div
              ref={cardRef}
              className="w-full max-w-[270px] bg-white p-3.5 pb-6 rounded-lg shadow-xl border border-stone-200/90 transform rotate-1 hover:rotate-0 transition-transform duration-300"
            >
              {/* Photo Area */}
              <div className="w-full aspect-square bg-stone-100 rounded overflow-hidden relative border border-stone-200/60 shadow-inner">
                <img
                  src={photoUrl}
                  alt="Polaroid Memory"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover sepia-[0.15] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-amber-900/10 pointer-events-none mix-blend-multiply" />
              </div>

              {/* Polaroid Bottom Inscription */}
              <div className="mt-3.5 text-center px-1">
                <h3 className="font-editorial text-lg font-bold text-[#3D291D] leading-tight tracking-wide">
                  {title || 'Samory Memory'}
                </h3>
                <p className="text-[11px] font-modern-sans text-[#7D6A5A] mt-0.5 tracking-wider uppercase">
                  {date || 'Vĩnh viễn'}
                </p>
                <p className="text-xs font-editorial italic text-[#594435] mt-1.5 line-clamp-2 px-1">
                  "{note}"
                </p>

                {/* Subtle Samory Brandmark on Polaroid */}
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[#8B5A3C]">
                  <Heart className="w-2.5 h-2.5 fill-[#8B5A3C]" />
                  <span className="text-[10px] tracking-[0.25em] font-cinzel font-semibold uppercase">
                    SAMORY
                  </span>
                  <Heart className="w-2.5 h-2.5 fill-[#8B5A3C]" />
                </div>
              </div>
            </div>

            {/* Actions for Card */}
            <div className="flex items-center gap-2 mt-4 w-full max-w-[270px]">
              <button
                onClick={handlePrintOrSave}
                className="flex-1 py-2 px-3 rounded-xl bg-[#8B5A3C] text-white hover:bg-[#73472C] text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Lưu ảnh thẻ
              </button>
              <button
                onClick={handleCopyLink}
                className="py-2 px-3 rounded-xl border border-[#D8CCBA] bg-white hover:bg-[#F3EDE2] text-[#3D291D] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                title="Chia sẻ đường dẫn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8DEC8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-[#7D6A5A] hover:text-[#3D291D] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
