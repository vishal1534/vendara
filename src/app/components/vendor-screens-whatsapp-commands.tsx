import { Phone, MessageCircle, Building2, Settings } from "lucide-react";

// WhatsApp Frame (no PhoneFrame wrapper - that's added by App.tsx)
function WhatsAppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white relative overflow-hidden" style={{ height: '852px', minHeight: '852px' }}>
      <div className="bg-[#075e54] text-white px-4 py-3 pt-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <div className="font-semibold">Vendara</div>
            <div className="text-xs opacity-80">Tap for info</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Phone className="w-5 h-5" />
          <Settings className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-[#ece5dd] p-4 pb-20 overflow-y-auto" style={{ height: 'calc(852px - 76px)' }}>
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-2 flex items-center gap-2">
        <input type="text" placeholder="Type a message" className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm" disabled />
        <div className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// WhatsApp Bubble
function WBubble({ sent = false, children, time = "10:00 AM" }: { sent?: boolean; children: React.ReactNode; time?: string }) {
  return (
    <div className={`flex ${sent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${sent ? 'bg-[#dcf8c6]' : 'bg-white border border-gray-300'}`}>
        {children}
        <div className="text-[11px] text-gray-600 text-right mt-1">{time}</div>
      </div>
    </div>
  );
}

// 16B - Check Active Orders (WhatsApp)
export function VendorScreen16B() {
  return (
    <WhatsAppFrame>
      <WBubble time="4:30 PM">
        <div className="text-sm font-semibold">ORDERS</div>
      </WBubble>
      <WBubble sent time="4:30 PM">
        <div className="text-sm font-semibold mb-2">📦 Active Orders (2)</div>
        <div className="bg-blue-50 border border-blue-300 rounded p-2 mt-2 text-sm">
          <div className="font-semibold">#1247 - READY</div>
          <div className="text-gray-700 text-xs mt-1">UltraTech 50kg • 8 bags</div>
          <div className="text-gray-700 text-xs">Tomorrow 12-3 PM</div>
          <div className="text-blue-700 font-semibold text-xs mt-1">Payout: ₹2,880</div>
        </div>
        <div className="bg-blue-50 border border-blue-300 rounded p-2 mt-2 text-sm">
          <div className="font-semibold">#1246 - IN PROGRESS</div>
          <div className="text-gray-700 text-xs mt-1">ACC 50kg • 3 bags</div>
          <div className="text-gray-700 text-xs">Today 3-6 PM</div>
          <div className="text-blue-700 font-semibold text-xs mt-1">Payout: ₹1,080</div>
        </div>
      </WBubble>
      <WBubble sent time="4:30 PM">
        <div className="text-sm">Total Active: ₹3,960</div>
      </WBubble>
    </WhatsAppFrame>
  );
}

// 16C - Check Pending Payout (WhatsApp)
export function VendorScreen16C() {
  return (
    <WhatsAppFrame>
      <WBubble time="5:15 PM">
        <div className="text-sm font-semibold">PENDING</div>
      </WBubble>
      <WBubble sent time="5:15 PM">
        <div className="text-sm font-semibold mb-2">💰 Pending Payout</div>
        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mt-2">
          <div className="text-2xl font-bold text-yellow-700 mb-1">₹12,400</div>
          <div className="text-xs text-gray-700 mt-2">📅 Next Settlement: Jan 12, 2026 (Friday)</div>
          <div className="text-xs text-gray-700 mt-1">2 orders pending settlement</div>
        </div>
      </WBubble>
      <WBubble sent time="5:15 PM">
        <div className="text-sm text-gray-600">Orders in this settlement:</div>
        <div className="text-sm mt-1">• #1247 - ₹2,880</div>
        <div className="text-sm">• #1246 - ₹1,080</div>
      </WBubble>
    </WhatsAppFrame>
  );
}

// 16D - Check Balance/Earnings (WhatsApp)
export function VendorScreen16D() {
  return (
    <WhatsAppFrame>
      <WBubble time="6:00 PM">
        <div className="text-sm font-semibold">BALANCE</div>
      </WBubble>
      <WBubble sent time="6:00 PM">
        <div className="text-sm font-semibold mb-2">📊 Earnings Summary</div>
        <div className="bg-gray-100 border border-gray-300 rounded p-2 mt-2 text-sm">
          <div className="flex justify-between py-1 border-b border-gray-300">
            <span className="text-gray-600">This Month</span>
            <span className="font-semibold">₹45,680</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-300">
            <span className="text-gray-600">Pending Payout</span>
            <span className="font-semibold text-yellow-600">₹12,400</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Total Earned</span>
            <span className="font-semibold text-green-600">₹1,24,560</span>
          </div>
        </div>
      </WBubble>
      <WBubble sent time="6:00 PM">
        <div className="text-sm text-gray-600">Last Settlement: Jan 5 - ₹33,280 ✓</div>
        <div className="text-sm text-gray-600 mt-1">Next Settlement: Jan 12, 2026</div>
      </WBubble>
    </WhatsAppFrame>
  );
}

// 16E - Help Commands (WhatsApp)
export function VendorScreen16E() {
  return (
    <WhatsAppFrame>
      <WBubble time="3:00 PM">
        <div className="text-sm font-semibold">HELP</div>
      </WBubble>
      <WBubble sent time="3:00 PM">
        <div className="text-sm font-semibold mb-2">📱 Available Commands</div>
        <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-2 text-sm space-y-2">
          <div>
            <div className="font-semibold">ORDERS</div>
            <div className="text-xs text-gray-600">View your active orders</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">PENDING</div>
            <div className="text-xs text-gray-600">Check pending payout amount</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">BALANCE</div>
            <div className="text-xs text-gray-600">See earnings summary</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">AVAILABLE / UNAVAILABLE</div>
            <div className="text-xs text-gray-600">Toggle order availability</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">CATALOG</div>
            <div className="text-xs text-gray-600">Update your catalog items</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">ACCEPT / REJECT</div>
            <div className="text-xs text-gray-600">Respond to order offers</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">DONE</div>
            <div className="text-xs text-gray-600">Mark delivery complete</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">HELP</div>
            <div className="text-xs text-gray-600">Show this command list</div>
          </div>
        </div>
      </WBubble>
      <WBubble sent time="3:00 PM">
        <div className="text-xs text-gray-600">💻 For detailed reports & payout history, login to the Vendor Portal</div>
      </WBubble>
    </WhatsAppFrame>
  );
}
