import { Phone, MessageCircle, Building2, CheckCircle, ShieldCheck, MapPin, AlertCircle, Loader, Package, FileText, Wallet, DollarSign, Bell, Settings, Monitor } from "lucide-react";

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

// 01
export function VendorScreen01() {
  return (<WhatsAppFrame><WBubble time="2:30 PM"><div className="text-sm">Hello! I'm interested in becoming a Vendara vendor for cement supply in Miyapur area.</div></WBubble><WBubble sent time="2:32 PM"><div className="text-sm">Great! Thanks for your interest. We'll get back to you within 24 hours to start the verification process.</div></WBubble><div className="text-center my-4"><div className="bg-white inline-block px-3 py-1 rounded-full border border-gray-300 text-xs">Vendor State: LEAD</div></div></WhatsAppFrame>);
}

// 02
export function VendorScreen02() {
  return (
    <div className="bg-white h-full overflow-y-auto">
      <div className="bg-gray-900 text-white px-4 py-4 pt-16">
        <h1 className="text-xl font-bold">Vendor Verification</h1>
        <p className="text-sm opacity-80 mt-1">In-Person / Video Call</p>
      </div>
      <div className="p-4 pb-24">
        <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-gray-600" />
            <span className="font-bold">Identity Verification</span>
          </div>
          <div className="text-sm text-gray-600 mb-3">Submit any valid government ID</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <span>Aadhaar Card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <span>PAN Card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <span>Driving License</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <span>Voter ID</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-3">
          <div className="font-semibold mb-3">Vendor Details</div>
          <div className="mb-3">
            <label className="text-xs text-gray-600 mb-1 block">Full Name</label>
            <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Vishal Chauhan" readOnly />
          </div>
          <div className="mb-3">
            <label className="text-xs text-gray-600 mb-1 block">Business Name</label>
            <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Chauhan Cement Suppliers" readOnly />
          </div>
          <div className="mb-3">
            <label className="text-xs text-gray-600 mb-1 block">Phone Number</label>
            <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="+91 7906441952" readOnly />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Service Area</label>
            <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Miyapur, Hyderabad" readOnly />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-3">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-blue-900 mb-1">Verification Method</div>
              <div className="text-xs text-blue-800">• In-person meeting at vendor location</div>
              <div className="text-xs text-blue-800">• Video call verification (alternative)</div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mb-4">
          <div className="bg-white inline-block px-3 py-1 rounded-full border border-gray-300">Vendor State: VERIFICATION</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-300">
        <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl">Verify & Continue</button>
      </div>
    </div>
  );
}

// 02B - WhatsApp KYC Verification
export function VendorScreen02B() {
  return (
    <WhatsAppFrame>
      <WBubble sent time="2:35 PM">
        <div className="text-sm font-semibold mb-2">📋 KYC Verification</div>
        <div className="text-sm">Hi Rajesh! Let's complete your verification via WhatsApp.</div>
      </WBubble>
      <WBubble sent time="2:35 PM">
        <div className="text-sm mb-2">Please share a photo of any valid ID:</div>
        <div className="bg-gray-100 border border-gray-300 rounded p-2 mt-2 text-sm">
          <div>✓ Aadhaar Card</div>
          <div>✓ PAN Card</div>
          <div>✓ Driving License</div>
          <div>✓ Voter ID</div>
        </div>
      </WBubble>
      <div className="flex justify-start mb-2">
        <div className="max-w-[80%]">
          <div className="bg-white border border-gray-300 rounded-lg p-2">
            <div className="bg-gray-200 rounded h-32 flex items-center justify-center mb-2">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Aadhaar Card Photo</div>
              </div>
            </div>
            <div className="text-[11px] text-gray-600 text-right">2:38 PM</div>
          </div>
        </div>
      </div>
      <WBubble sent time="2:39 PM">
        <div className="text-sm">✅ Photo received! Verifying...</div>
      </WBubble>
      <WBubble sent time="2:41 PM">
        <div className="text-sm font-semibold mb-2">✅ Verification Complete!</div>
        <div className="bg-green-50 border border-green-300 rounded p-2 mt-2 text-sm">
          <div className="text-gray-700">Name: Vishal Chauhan</div>
          <div className="text-gray-700">ID Type: Aadhaar Card</div>
          <div className="text-green-700 font-semibold mt-1">Status: Verified ✓</div>
        </div>
      </WBubble>
      <div className="text-center my-4">
        <div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Vendor State: VERIFIED ✓</div>
      </div>
    </WhatsAppFrame>
  );
}

// 03
export function VendorScreen03() {
  return (<WhatsAppFrame><WBubble sent time="3:45 PM"><div className="text-sm font-semibold mb-2">📋 Catalog Selection</div><div className="text-sm mb-2">Available Cement Items:</div><div className="text-sm">1. UltraTech Cement 50kg</div><div className="text-sm">2. ACC Cement 50kg</div><div className="text-sm">3. Ambuja Cement 50kg</div><div className="text-sm">4. Shree Cement 50kg</div><div className="text-sm">5. JSW Cement 50kg</div></WBubble><WBubble sent time="3:45 PM"><div className="text-sm">Reply with numbers you can supply</div><div className="text-sm mt-1 text-gray-600">Example: 1, 2, 5</div></WBubble><WBubble time="3:47 PM"><div className="text-sm font-semibold">1, 2, 5</div></WBubble><WBubble sent time="3:48 PM"><div className="text-sm">✅ Catalog Updated!</div><div className="text-sm mt-1">• UltraTech Cement 50kg</div><div className="text-sm">• ACC Cement 50kg</div><div className="text-sm">• JSW Cement 50kg</div></WBubble><div className="text-center my-4"><div className="bg-white inline-block px-3 py-1 rounded-full border border-gray-300 text-xs">Vendor State: CATALOG OPT-IN</div></div></WhatsAppFrame>);
}

// 03B - Update Catalog (Anytime)
export function VendorScreen03B() {
  return (<WhatsAppFrame><div className="text-center my-4"><div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Current Catalog: 3 Items</div></div><WBubble time="5:30 PM"><div className="text-sm font-semibold">CATALOG</div></WBubble><WBubble sent time="5:30 PM"><div className="text-sm font-semibold mb-2">📋 Your Current Catalog</div><div className="bg-green-50 border border-green-300 rounded p-2 mt-2 text-sm"><div>• UltraTech Cement 50kg</div><div>• ACC Cement 50kg</div><div>• JSW Cement 50kg</div></div></WBubble><WBubble sent time="5:30 PM"><div className="text-sm mb-2">Available Items:</div><div className="text-sm">1. UltraTech Cement 50kg ✓</div><div className="text-sm">2. ACC Cement 50kg ✓</div><div className="text-sm">3. Ambuja Cement 50kg</div><div className="text-sm">4. Shree Cement 50kg</div><div className="text-sm">5. JSW Cement 50kg ✓</div></WBubble><WBubble sent time="5:30 PM"><div className="text-sm">Reply with numbers to update</div><div className="text-sm mt-1 text-gray-600">Example: 1, 2, 3, 5</div></WBubble><WBubble time="5:32 PM"><div className="text-sm font-semibold">1, 2, 3, 5</div></WBubble><WBubble sent time="5:32 PM"><div className="text-sm">✅ Catalog Updated!</div><div className="text-sm mt-1">• UltraTech Cement 50kg</div><div className="text-sm">• ACC Cement 50kg</div><div className="text-sm">• Ambuja Cement 50kg</div><div className="text-sm">• JSW Cement 50kg</div></WBubble></WhatsAppFrame>);
}

// 04
export function VendorScreen04() {
  return (<WhatsAppFrame><WBubble sent time="4:15 PM"><div className="text-sm font-semibold mb-2">⚠️ Commercial Terms</div><div className="text-sm mt-1">✓ Fixed pricing (no negotiation)</div><div className="text-sm">✓ Small/micro orders only</div><div className="text-sm">✓ Weekly settlements</div></WBubble><WBubble sent time="4:16 PM"><div className="text-sm">Reply YES to accept these terms</div></WBubble><WBubble time="4:18 PM"><div className="text-sm font-semibold">YES</div></WBubble><div className="text-center my-4"><div className="bg-white inline-block px-3 py-1 rounded-full border border-gray-300 text-xs">COMMERCIAL ACCEPTANCE</div></div></WhatsAppFrame>);
}

// 05
export function VendorScreen05() {
  return (<WhatsAppFrame><WBubble sent time="4:20 PM"><div className="text-sm font-semibold">✅ Profile Activated!</div><div className="text-sm mt-2">Welcome to Vendara, Rajesh!</div></WBubble><WBubble sent time="4:21 PM"><div className="text-sm font-semibold">What's Next?</div><div className="text-sm mt-1">• You'll receive order offers here</div><div className="text-sm">• Reply ACCEPT or REJECT</div><div className="text-sm">• Access portal for payouts</div></WBubble><div className="text-center my-4"><div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Vendor State: ELIGIBLE ✓</div></div></WhatsAppFrame>);
}

// 06
export function VendorScreen06() {
  return (<WhatsAppFrame><div className="text-center my-4"><div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Status: AVAILABLE (Default)</div></div><div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-4"><div className="text-center"><CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" /><div className="font-bold text-lg mb-2">You're Available</div><div className="text-sm text-gray-600 mb-4">Ready to receive order offers</div><div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs text-left"><div className="font-semibold mb-2">ℹ️ How it works:</div><div className="text-gray-600">• You're assumed available by default</div><div className="text-gray-600">• Send UNAVAILABLE to stop receiving offers</div></div></div></div></WhatsAppFrame>);
}

// 07
export function VendorScreen07() {
  return (<WhatsAppFrame><WBubble time="11:30 AM"><div className="text-sm font-semibold">UNAVAILABLE</div></WBubble><WBubble sent time="11:30 AM"><div className="text-sm">✓ You're now UNAVAILABLE.</div><div className="text-sm mt-2">You won't receive order offers.</div></WBubble><div className="text-center my-4"><div className="bg-gray-200 inline-block px-3 py-1 rounded-full border border-gray-400 text-gray-700 text-xs">Status: UNAVAILABLE</div></div><WBubble time="2:15 PM"><div className="text-sm font-semibold">AVAILABLE</div></WBubble><WBubble sent time="2:15 PM"><div className="text-sm">✓ Welcome back! You're now AVAILABLE.</div></WBubble><div className="text-center my-4"><div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Status: AVAILABLE</div></div></WhatsAppFrame>);
}

// 08
export function VendorScreen08() {
  return (<WhatsAppFrame><div className="text-center my-4"><div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Status: AVAILABLE</div></div><div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-4"><div className="text-sm font-semibold mb-3">ℹ️ Availability Commands</div><div className="bg-gray-50 border border-gray-300 rounded p-3 mb-2 text-sm"><div className="font-semibold mb-1">Send: UNAVAILABLE</div><div className="text-gray-600 text-xs">Stop receiving order offers</div></div><div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm"><div className="font-semibold mb-1">Send: AVAILABLE</div><div className="text-gray-600 text-xs">Resume receiving order offers</div></div></div></WhatsAppFrame>);
}

// 09
export function VendorScreen09() {
  return (<WhatsAppFrame><div className="text-center my-2"><div className="bg-blue-100 inline-block px-3 py-1 rounded-full border border-blue-300 text-blue-800 text-xs">New Order Offer!</div></div><WBubble sent time="10:15 AM"><div className="text-sm font-semibold mb-2">🔔 ORDER OFFER #1245</div><div className="bg-gray-100 border border-gray-300 rounded p-2 mt-2 text-sm"><div className="font-semibold">UltraTech Cement 50kg</div><div className="text-gray-600 mt-1">Quantity: 5 bags</div><div className="text-gray-600">Time: Today 12:00-3:00 PM</div></div><div className="bg-green-50 border border-green-300 rounded p-2 mt-2 text-sm"><div className="font-semibold text-green-800">Your Payout: ₹1,800</div></div></WBubble><WBubble sent time="10:15 AM"><div className="text-sm">Reply ACCEPT or REJECT (15 min)</div></WBubble></WhatsAppFrame>);
}

// 10
export function VendorScreen10() {
  return (<WhatsAppFrame><WBubble sent time="10:15 AM"><div className="text-sm">ORDER OFFER #1245 - 5 bags</div></WBubble><WBubble time="10:17 AM"><div className="text-sm font-semibold">ACCEPT</div></WBubble><WBubble sent time="10:17 AM"><div className="text-sm font-semibold">✅ ORDER CONFIRMED #1245</div><div className="bg-green-50 border border-green-300 rounded p-2 mt-2 text-sm"><div className="text-gray-700">📦 5 bags UltraTech</div><div className="text-gray-700">🕐 Today 12:00-3:00 PM</div><div className="text-gray-700">💰 Payout: ₹1,800</div></div></WBubble><div className="text-center my-4"><div className="bg-blue-100 inline-block px-3 py-1 rounded-full border border-blue-300 text-blue-800 text-xs">Vendor State: CONFIRMED</div></div></WhatsAppFrame>);
}

// 11
export function VendorScreen11() {
  return (<WhatsAppFrame><WBubble sent time="11:30 AM"><div className="text-sm">ORDER OFFER #1246</div></WBubble><WBubble time="11:32 AM"><div className="text-sm font-semibold">REJECT</div></WBubble><WBubble sent time="11:32 AM"><div className="text-sm">✓ Order #1246 declined.</div></WBubble><div className="bg-white border-2 border-gray-300 rounded-xl p-4 mt-4"><div className="text-sm font-semibold mb-2">ℹ️ No penalty for honest rejections</div></div></WhatsAppFrame>);
}

// 12
export function VendorScreen12() {
  return (<WhatsAppFrame><WBubble sent time="10:00 AM"><div className="text-sm font-semibold">⏰ READINESS CHECK</div><div className="text-sm mt-2">Order #1245 - 5 bags</div><div className="text-sm">Delivery: Today 12:00-3:00 PM</div></WBubble><WBubble sent time="10:00 AM"><div className="text-sm">Reply READY or DELAY</div></WBubble><WBubble time="10:03 AM"><div className="text-sm font-semibold">READY</div></WBubble><WBubble sent time="10:03 AM"><div className="text-sm">✅ Perfect! Proceed with delivery.</div></WBubble></WhatsAppFrame>);
}

// 13
export function VendorScreen13() {
  return (<WhatsAppFrame><WBubble time="7:15 AM"><div className="text-sm font-semibold">DELAY</div></WBubble><WBubble sent time="7:15 AM"><div className="text-sm">⚠️ Delay noted for Order #1247</div><div className="text-sm mt-2">Our team will contact you shortly.</div></WBubble><div className="text-center my-4"><div className="bg-yellow-100 inline-block px-3 py-1 rounded-full border border-yellow-300 text-yellow-800 text-xs">Escalated to Ops</div></div></WhatsAppFrame>);
}

// 14
export function VendorScreen14() {
  return (<div className="bg-white h-full overflow-y-auto"><div className="bg-blue-600 text-white px-4 py-4 pt-16"><div className="flex items-center justify-between"><div><div className="text-sm opacity-80">Active Order</div><h1 className="text-xl font-bold">#1245</h1></div><div className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold">IN PROGRESS</div></div></div><div className="p-4 pb-24"><div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-3"><div className="font-semibold mb-3">Order Details</div><div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Item</span><span className="font-semibold">UltraTech Cement 50kg</span></div><div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Quantity</span><span className="font-semibold">5 bags</span></div><div className="flex justify-between text-sm"><span className="text-gray-600">Payout</span><span className="font-bold text-lg">₹1,800</span></div></div><div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4"><div className="text-sm">Send <span className="font-bold">DONE</span> via WhatsApp after delivery</div></div></div></div>);
}

// 15
export function VendorScreen15() {
  return (<WhatsAppFrame><WBubble time="2:45 PM"><div className="text-sm font-semibold">DONE</div></WBubble><WBubble sent time="2:45 PM"><div className="text-sm">✅ Order #1245 marked as delivered!</div><div className="text-sm mt-2">Waiting for buyer confirmation...</div></WBubble><div className="text-center my-4"><div className="bg-yellow-100 inline-block px-3 py-1 rounded-full border border-yellow-300 text-yellow-800 text-xs">PENDING BUYER CONFIRMATION</div></div></WhatsAppFrame>);
}

// 16
export function VendorScreen16() {
  return (<WhatsAppFrame><WBubble sent time="Jan 8, 10:00 AM"><div className="text-sm font-semibold">🎉 ORDER COMPLETED #1245</div><div className="text-sm mt-2">Buyer confirmed delivery!</div><div className="bg-green-50 border border-green-300 rounded p-2 mt-2 text-sm"><div className="font-semibold text-green-800">Payment Status:</div><div className="text-gray-700 mt-1">💰 Amount: ₹1,800</div><div className="text-gray-700">📅 Settlement: Next Friday</div></div></WBubble><div className="text-center my-4"><div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Order State: COMPLETED ✓</div></div></WhatsAppFrame>);
}

// 17 - Portal Dashboard (Laptop Frame)
export function VendorScreen17() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6" />
          <div>
            <div className="font-bold text-lg">Vendor Portal</div>
            <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-400">Availability</div>
            <div className="text-sm font-semibold text-green-400">● AVAILABLE</div>
          </div>
          <Bell className="w-5 h-5" />
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Dashboard</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Catalog</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Active Orders</div>
            <div className="text-3xl font-bold text-gray-900">2</div>
            <div className="text-xs text-blue-600 mt-1">● In Progress</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">This Month</div>
            <div className="text-3xl font-bold text-gray-900">28</div>
            <div className="text-xs text-gray-600 mt-1">+12% vs last month</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Pending Payout</div>
            <div className="text-3xl font-bold text-yellow-600">₹12,400</div>
            <div className="text-xs text-gray-600 mt-1">Due Jan 12, 2026</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Total Earned</div>
            <div className="text-3xl font-bold text-green-600">₹1,24,560</div>
            <div className="text-xs text-gray-600 mt-1">Since Nov 2025</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Active Orders */}
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">Active Orders</h2>
              <button className="text-sm text-gray-700 underline">View All</button>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-gray-900">#1246</div>
                    <div className="text-sm text-gray-600">ACC Cement 50kg • 3 bags</div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">IN PROGRESS</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Delivery: Today 3-6 PM</span>
                  <span className="font-bold text-gray-900">₹1,080</span>
                </div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-gray-900">#1247</div>
                    <div className="text-sm text-gray-600">UltraTech Cement 50kg • 8 bags</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">READY</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Delivery: Tomorrow 12-3 PM</span>
                  <span className="font-bold text-gray-900">₹2,880</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Catalog Summary */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
              <h2 className="font-bold text-lg text-gray-900 mb-4">My Catalog</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">UltraTech Cement 50kg</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">ACC Cement 50kg</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">JSW Cement 50kg</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">ACTIVE</span>
                </div>
              </div>
              <button className="w-full mt-3 bg-white border-2 border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Update Catalog
              </button>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 text-sm mb-1">WhatsApp for Day-to-Day</div>
                  <div className="text-xs text-blue-800">Order notifications & confirmations happen on WhatsApp. Use this portal for detailed reports and payouts.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 18 - Order History (Laptop Frame)
export function VendorScreen18() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6" />
          <div className="font-bold text-lg">Order History</div>
        </div>
        <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Catalog</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
            <option>All Orders</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Issues</option>
          </select>
          <select className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>All Time</option>
          </select>
          <button className="ml-auto bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            Export CSV
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-3">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 hover:border-gray-400 cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-bold text-lg text-gray-900">#1247</div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">READY</div>
                </div>
                <div className="text-sm text-gray-600">UltraTech Cement 50kg • 8 bags</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">₹2,880</div>
                <div className="text-xs text-gray-600">Tomorrow 12-3 PM</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600 pt-3 border-t border-gray-200">
              <span>Accepted: Jan 6, 10:15 AM</span>
              <span className="text-blue-600 hover:underline">View Details →</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 hover:border-gray-400 cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-bold text-lg text-gray-900">#1246</div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">IN PROGRESS</div>
                </div>
                <div className="text-sm text-gray-600">ACC Cement 50kg • 3 bags</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">₹1,080</div>
                <div className="text-xs text-gray-600">Today 3-6 PM</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600 pt-3 border-t border-gray-200">
              <span>Accepted: Jan 6, 9:20 AM</span>
              <span className="text-blue-600 hover:underline">View Details →</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 hover:border-gray-400 cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-bold text-lg text-gray-900">#1245</div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">COMPLETED</div>
                </div>
                <div className="text-sm text-gray-600">UltraTech Cement 50kg • 5 bags</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">₹1,800</div>
                <div className="text-xs text-green-600">✓ Settled</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600 pt-3 border-t border-gray-200">
              <span>Completed: Jan 5, 3:45 PM</span>
              <span className="text-blue-600 hover:underline">View Details →</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 hover:border-gray-400 cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-bold text-lg text-gray-900">#1244</div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">COMPLETED</div>
                </div>
                <div className="text-sm text-gray-600">ACC Cement 50kg • 10 bags</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">₹3,600</div>
                <div className="text-xs text-green-600">✓ Settled</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600 pt-3 border-t border-gray-200">
              <span>Completed: Jan 4, 5:20 PM</span>
              <span className="text-blue-600 hover:underline">View Details →</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 hover:border-gray-400 cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-bold text-lg text-gray-900">#1243</div>
                  <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">REJECTED</div>
                </div>
                <div className="text-sm text-gray-600">JSW Cement 50kg • 4 bags</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-400">—</div>
                <div className="text-xs text-gray-600">Not accepted</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600 pt-3 border-t border-gray-200">
              <span>Rejected: Jan 4, 11:15 AM</span>
              <span className="text-blue-600 hover:underline">View Details →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 19 - Order Details (Laptop Frame)
export function VendorScreen19() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" />
          <div>
            <div className="font-bold text-lg">Order #1245</div>
            <div className="text-xs text-gray-400">Completed on Jan 5, 2026</div>
          </div>
        </div>
        <div className="bg-green-600 px-3 py-1 rounded text-xs font-semibold">COMPLETED</div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Catalog</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
        </div>

        <button className="mb-6 text-sm text-gray-700 hover:underline flex items-center gap-1">
          ← Back to Orders
        </button>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Order Info */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-900">Order Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-semibold text-gray-900">#1245</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Item</span>
                  <span className="font-semibold text-gray-900">UltraTech Cement 50kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-semibold text-gray-900">5 bags</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Delivery Window</span>
                  <span className="font-semibold text-gray-900">Jan 5, 12:00-3:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Delivery Address</span>
                  <span className="font-semibold text-gray-900 text-right">Plot 45, Miyapur</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-900">Timeline</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <div className="w-0.5 h-full bg-gray-300"></div>
                  </div>
                  <div className="pb-4">
                    <div className="font-semibold text-sm text-gray-900">Order Offered</div>
                    <div className="text-xs text-gray-600">Jan 5, 10:15 AM</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <div className="w-0.5 h-full bg-gray-300"></div>
                  </div>
                  <div className="pb-4">
                    <div className="font-semibold text-sm text-gray-900">Accepted</div>
                    <div className="text-xs text-gray-600">Jan 5, 10:17 AM</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <div className="w-0.5 h-full bg-gray-300"></div>
                  </div>
                  <div className="pb-4">
                    <div className="font-semibold text-sm text-gray-900">Delivered</div>
                    <div className="text-xs text-gray-600">Jan 5, 2:45 PM</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Completed</div>
                    <div className="text-xs text-gray-600">Jan 5, 3:45 PM</div>
                    <div className="text-xs text-green-600 mt-1">✓ Buyer confirmed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Info */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-900">Payment Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Base Payout</span>
                  <span className="font-semibold text-gray-900">₹1,800</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Deductions</span>
                  <span className="font-semibold text-gray-900">₹0</span>
                </div>
                <div className="flex justify-between py-3 bg-green-50 -mx-4 px-4 mt-3">
                  <span className="font-bold text-gray-900">Total Payout</span>
                  <span className="font-bold text-xl text-green-600">₹1,800</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-900">Settlement Status</h2>
              <div className="space-y-3">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800 text-sm">Settled</span>
                  </div>
                  <div className="text-xs text-gray-700">Paid on Jan 12, 2026</div>
                  <div className="text-xs text-gray-700">Settlement ID: ST-2026-001</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 text-sm mb-1">Need Support?</div>
                  <div className="text-xs text-blue-800 mb-2">For issues with this order, contact us via WhatsApp</div>
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 20 - Payout Ledger (Laptop Frame)
export function VendorScreen20() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <Wallet className="w-6 h-6" />
          <div className="font-bold text-lg">Payout Ledger</div>
        </div>
        <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Orders</button>
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Catalog</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Pending Payout</div>
            <div className="text-2xl font-bold text-yellow-600">₹12,400</div>
            <div className="text-xs text-gray-600 mt-1">2 orders</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">This Month</div>
            <div className="text-2xl font-bold text-gray-900">₹45,680</div>
            <div className="text-xs text-gray-600 mt-1">28 orders</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Last Settled</div>
            <div className="text-2xl font-bold text-green-600">₹33,280</div>
            <div className="text-xs text-gray-600 mt-1">Jan 5, 2026</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Total Earned</div>
            <div className="text-2xl font-bold text-gray-900">₹1,24,560</div>
            <div className="text-xs text-gray-600 mt-1">Since Nov 2025</div>
          </div>
        </div>

        {/* Settlement Schedule */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-blue-900 text-sm mb-1">Next Settlement: Jan 12, 2026</div>
              <div className="text-xs text-blue-800">Weekly settlements every Friday. Funds are transferred to your bank account within 24 hours.</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">₹12,400</div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">Transaction History</h2>
            <div className="flex gap-2">
              <select className="bg-white border-2 border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700">
                <option>All Transactions</option>
                <option>Pending</option>
                <option>Settled</option>
              </select>
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                Export CSV
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <div>Order ID</div>
              <div>Item</div>
              <div>Quantity</div>
              <div>Amount</div>
              <div>Status</div>
              <div className="text-right">Settlement Date</div>
            </div>

            {/* Transaction Rows */}
            <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <div className="font-semibold text-gray-900">#1247</div>
              <div className="text-gray-700">UltraTech 50kg</div>
              <div className="text-gray-700">8 bags</div>
              <div className="font-semibold text-gray-900">₹2,880</div>
              <div><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">PENDING</span></div>
              <div className="text-right text-gray-600">Jan 12, 2026</div>
            </div>

            <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <div className="font-semibold text-gray-900">#1246</div>
              <div className="text-gray-700">ACC 50kg</div>
              <div className="text-gray-700">3 bags</div>
              <div className="font-semibold text-gray-900">₹1,080</div>
              <div><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">PENDING</span></div>
              <div className="text-right text-gray-600">Jan 12, 2026</div>
            </div>

            <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <div className="font-semibold text-gray-900">#1245</div>
              <div className="text-gray-700">UltraTech 50kg</div>
              <div className="text-gray-700">5 bags</div>
              <div className="font-semibold text-gray-900">₹1,800</div>
              <div><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">SETTLED</span></div>
              <div className="text-right text-gray-600">Jan 5, 2026</div>
            </div>

            <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <div className="font-semibold text-gray-900">#1244</div>
              <div className="text-gray-700">ACC 50kg</div>
              <div className="text-gray-700">10 bags</div>
              <div className="font-semibold text-gray-900">₹3,600</div>
              <div><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">SETTLED</span></div>
              <div className="text-right text-gray-600">Jan 5, 2026</div>
            </div>

            <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <div className="font-semibold text-gray-900">#1242</div>
              <div className="text-gray-700">JSW 50kg</div>
              <div className="text-gray-700">7 bags</div>
              <div className="font-semibold text-gray-900">₹2,520</div>
              <div><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">SETTLED</span></div>
              <div className="text-right text-gray-600">Jan 5, 2026</div>
            </div>

            <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <div className="font-semibold text-gray-900">#1241</div>
              <div className="text-gray-700">UltraTech 50kg</div>
              <div className="text-gray-700">12 bags</div>
              <div className="font-semibold text-gray-900">₹4,320</div>
              <div><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">SETTLED</span></div>
              <div className="text-right text-gray-600">Dec 29, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 21 - Settlement Summary (Laptop Frame)
export function VendorScreen21() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6" />
          <div className="font-bold text-lg">Settlement Summary</div>
        </div>
        <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Orders</button>
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Catalog</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
              <div className="mb-4">
                <h2 className="font-bold text-lg text-gray-900 mb-1">Next Settlement</h2>
                <p className="text-sm text-gray-600">Friday, Jan 12, 2026</p>
              </div>
              <div className="text-4xl font-bold text-yellow-600 mb-4">₹12,400</div>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm">
                <div className="font-semibold text-yellow-900 mb-1">2 Orders Pending</div>
                <div className="text-yellow-800">Will be transferred to your bank within 24 hours</div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Bank Account</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Account Holder</span>
                  <span className="font-semibold text-gray-900">Vishal Chauhan</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-semibold text-gray-900">HDFC Bank</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-semibold text-gray-900">****1234</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">IFSC Code</span>
                  <span className="font-semibold text-gray-900">HDFC0001234</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Update Bank Details
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Settlement History</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">Jan 5, 2026</div>
                    <div className="text-xs text-gray-600 mt-1">Settlement ID: ST-2026-001</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">₹33,280</div>
                    <div className="text-xs text-green-600">✓ Paid</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  21 orders • Processed to HDFC ****1234
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">Dec 29, 2025</div>
                    <div className="text-xs text-gray-600 mt-1">Settlement ID: ST-2025-052</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">₹45,920</div>
                    <div className="text-xs text-green-600">✓ Paid</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  34 orders • Processed to HDFC ****1234
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">Dec 22, 2025</div>
                    <div className="text-xs text-gray-600 mt-1">Settlement ID: ST-2025-051</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">₹38,160</div>
                    <div className="text-xs text-green-600">✓ Paid</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  28 orders • Processed to HDFC ****1234
                </div>
              </div>

              <button className="w-full mt-2 bg-white border-2 border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                View All Settlements
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 text-sm mb-1">Weekly Settlement Schedule</div>
              <div className="text-xs text-blue-800">
                Settlements are processed every Friday. All completed orders from the previous week are included. 
                Funds are transferred to your bank account within 24 hours of processing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 22
export function VendorScreen22() {
  return (<WhatsAppFrame><WBubble time="11:45 AM"><div className="text-sm">Customer site is locked. Cannot deliver Order #1248.</div></WBubble><WBubble sent time="11:46 AM"><div className="text-sm">⚠️ Issue noted for Order #1248</div><div className="text-sm mt-2">Our team will call you within 10 minutes.</div></WBubble><div className="text-center my-4"><div className="bg-red-100 inline-block px-3 py-1 rounded-full border border-red-300 text-red-800 text-xs">Order State: ISSUE</div></div><div className="bg-white border-2 border-gray-300 rounded-xl p-4"><div className="text-sm font-semibold mb-2">📞 What happens next?</div><div className="text-sm text-gray-600">• Ops will call immediately</div><div className="text-sm text-gray-600">• We'll contact the buyer</div><div className="text-sm text-gray-600 mt-2 font-semibold">No penalty for legitimate issues</div></div></WhatsAppFrame>);
}

// 23
export function VendorScreen23() {
  return (<WhatsAppFrame><div className="text-center my-2"><div className="bg-red-100 inline-block px-3 py-1 rounded-full border border-red-300 text-red-800 text-xs">⚠️ System Notice</div></div><WBubble sent time="2:30 PM"><div className="text-sm font-semibold">⚠️ WARNING - Performance Alert</div><div className="text-sm mt-2">We've noticed:</div><div className="bg-red-50 border border-red-300 rounded p-2 mt-2 text-sm"><div>• 2 no-shows in last 30 days</div><div>• Late delivery on Order #1250</div></div></WBubble><WBubble sent time="2:30 PM"><div className="text-sm font-semibold">⏸️ Temporary Pause</div><div className="text-sm mt-2">Account paused for 7 days (until Jan 14)</div></WBubble><div className="text-center my-4"><div className="bg-gray-200 inline-block px-3 py-1 rounded-full border border-gray-400 text-gray-700 text-xs">Vendor State: SUSPENDED (7 days)</div></div></WhatsAppFrame>);
}

// 24 - Vendor Profile/Settings (Laptop Frame)
export function VendorScreen24() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6" />
          <div className="font-bold text-lg">Profile & Settings</div>
        </div>
        <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Catalog</button>
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Settings</button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">Business Name</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Chauhan Cement Suppliers" readOnly />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">Owner Name</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Vishal Chauhan" readOnly />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">Phone Number</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="+91 7906441952" readOnly />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">Service Area</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Miyapur, Kukatpally" readOnly />
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Availability Settings</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm">Currently Available</div>
                    <div className="text-xs text-gray-600 mt-1">Receiving order offers</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">● AVAILABLE</div>
                </div>
                <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-xs text-gray-700">
                  💡 <strong>Tip:</strong> Send "UNAVAILABLE" via WhatsApp to stop receiving orders temporarily
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
              <h2 className="font-bold text-lg text-gray-900 mb-4">KYC Documents</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-300 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm">Aadhaar Card</div>
                    <div className="text-xs text-gray-600 mt-1">XXXX XXXX 4567</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-300 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm">PAN Card</div>
                    <div className="text-xs text-gray-600 mt-1">ABCDE1234F</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-center pt-2">
                  <div className="text-xs text-gray-600">✓ All documents verified</div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Bank Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">Account Holder Name</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Vishal Chauhan" readOnly />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">Account Number</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="XXXXXX7890" readOnly />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">IFSC Code</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="HDFC0001234" readOnly />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block uppercase tracking-wide">Bank Name</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="HDFC Bank" readOnly />
                </div>
                <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xs text-green-800 font-semibold">Bank details verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}