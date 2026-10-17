import React, { useRef } from 'react';
import { X, Image as ImageIcon, Sliders, Upload, Check, Sparkles } from 'lucide-react';

export interface BackgroundConfig {
  sourceType: 'logo_art' | 'memory_photo' | 'custom';
  customUrl?: string;
  blurAmount: number; // in px: 0, 4, 8, 14
  overlayOpacity: number; // 0.1 to 0.6
  enableBreathing: boolean;
}

interface BackgroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackgroundConfig;
  onChange: (updated: Partial<BackgroundConfig>) => void;
  logoArtUrl: string;
  memoryPhotoUrl: string;
}

export const BackgroundSettingsModal: React.FC<BackgroundSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  logoArtUrl,
  memoryPhotoUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            sourceType: 'custom',
            customUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF7F2] text-[#3D291D] rounded-3xl p-6 shadow-2xl border border-[#E8DEC8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#8B5A3C]" />
            <h2 className="text-lg font-serif-display font-semibold text-[#3D291D]">
              Tuỳ chỉnh hình nền & hiệu ứng mờ
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng tuỳ chỉnh"
            className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#8C7A6B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-6">
          {/* Preset Images */}
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-[#8C7A6B] mb-2.5">
              Chọn hình nền
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Logo Card Illustration */}
              <button
                onClick={() => onChange({ sourceType: 'logo_art' })}
                className={`relative rounded-2xl overflow-hidden border-2 p-1 text-left transition-all ${
                  config.sourceType === 'logo_art'
                    ? 'border-[#8B5A3C] shadow-md ring-2 ring-[#8B5A3C]/20'
                    : 'border-[#E8DEC8] hover:border-[#C4B29E]'
                }`}
              >
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-[#F0EBE1]">
                  <img
                    src={logoArtUrl}
                    alt="Samory Logo Art"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {config.sourceType === 'logo_art' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8B5A3C] text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="p-1.5 text-center">
                  <span className="text-xs font-medium text-[#3D291D] flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8B5A3C]" /> Tranh Samory
                  </span>
                </div>
              </button>

              {/* Photo Memory Backdrop */}
              <button
                onClick={() => onChange({ sourceType: 'memory_photo' })}
                className={`relative rounded-2xl overflow-hidden border-2 p-1 text-left transition-all ${
                  config.sourceType === 'memory_photo'
                    ? 'border-[#8B5A3C] shadow-md ring-2 ring-[#8B5A3C]/20'
                    : 'border-[#E8DEC8] hover:border-[#C4B29E]'
                }`}
              >
                <div className="relative h-24 w-full rounded-xl overflow-hidden bg-[#F0EBE1]">
                  <img
                    src={memoryPhotoUrl}
                    alt="Samory Memory Photos"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {config.sourceType === 'memory_photo' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8B5A3C] text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="p-1.5 text-center">
                  <span className="text-xs font-medium text-[#3D291D] flex items-center justify-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#8B5A3C]" /> Ảnh Polaroid cổ điển
                  </span>
                </div>
              </button>
            </div>

            {/* Custom upload button */}
            <div className="mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-2.5 px-4 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-medium transition-colors ${
                  config.sourceType === 'custom'
                    ? 'border-[#8B5A3C] bg-[#8B5A3C]/10 text-[#8B5A3C]'
                    : 'border-[#C4B29E] hover:bg-[#F3EDE2] text-[#6E5846]'
                }`}
              >
                <Upload className="w-4 h-4" />
                {config.sourceType === 'custom' ? 'Đang dùng ảnh tải lên của bạn (Đổi ảnh)' : 'Tải ảnh cá nhân từ thiết bị của bạn'}
              </button>
            </div>
          </div>

          {/* Blur Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-[#8C7A6B]">
                Mức độ làm mờ nền (Blur Effect)
              </label>
              <span className="text-xs font-mono text-[#8B5A3C] font-medium">
                {config.blurAmount === 0 ? 'Không làm mờ' : `${config.blurAmount}px`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Tắt', val: 0 },
                { label: 'Nhẹ', val: 4 },
                { label: 'Vừa', val: 8 },
                { label: 'Sâu', val: 14 },
              ].map((b) => (
                <button
                  key={b.val}
                  onClick={() => onChange({ blurAmount: b.val })}
                  className={`py-2 text-xs rounded-xl font-medium transition-all ${
                    config.blurAmount === b.val
                      ? 'bg-[#8B5A3C] text-white shadow-sm'
                      : 'bg-[#EFE8DA] hover:bg-[#E5DCCB] text-[#5C4533]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Tone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-[#8C7A6B]">
                Độ ấm & che phủ nhẹ (Scrim Overlay)
              </label>
              <span className="text-xs font-mono text-[#8B5A3C] font-medium">
                {Math.round(config.overlayOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.55"
              step="0.05"
              value={config.overlayOpacity}
              onChange={(e) => onChange({ overlayOpacity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#E2D6C3] rounded-lg appearance-none cursor-pointer accent-[#8B5A3C]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8DEC8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-medium text-white bg-[#8B5A3C] hover:bg-[#73472C] rounded-xl shadow-md transition-colors"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
