import { X, CreditCard, Settings, Palette, Keyboard, LogOut } from 'lucide-react';

export function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-[380px] rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#F5F3EF]"
        >
          <X className="size-4" />
        </button>

        {/* Profile Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] text-white">
            <span className="text-xl font-semibold">H</span>
          </div>
          <div>
            <h2 className="font-semibold text-[#1A1A1A]">Hirdesh</h2>
            <p className="text-sm text-[#6B6B6B]">hirdesh@example.com</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-4 border-t border-black/10" />

        {/* Menu Items */}
        <div className="space-y-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-[#1A1A1A] transition-colors hover:bg-[#F5F3EF]">
            <CreditCard className="size-4 text-[#6B6B6B]" />
            <span>My Plan (Free)</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-[#1A1A1A] transition-colors hover:bg-[#F5F3EF]">
            <Settings className="size-4 text-[#6B6B6B]" />
            <span>Settings</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-[#1A1A1A] transition-colors hover:bg-[#F5F3EF]">
            <Palette className="size-4 text-[#6B6B6B]" />
            <span>Appearance</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-[#1A1A1A] transition-colors hover:bg-[#F5F3EF]">
            <Keyboard className="size-4 text-[#6B6B6B]" />
            <span>Keyboard Shortcuts</span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-black/10" />

        {/* Logout */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
          <LogOut className="size-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
