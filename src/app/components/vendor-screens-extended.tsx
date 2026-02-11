import { Phone, MessageCircle, Building2, CheckCircle, ShieldCheck, MapPin, AlertCircle, Loader, Package, FileText, Wallet, DollarSign, Bell, Settings, Monitor, Box, TrendingUp, Clock, HelpCircle, LifeBuoy, Mail } from "lucide-react";

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

// 25 - Catalog Management (Laptop Frame)
export function VendorScreen25() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <Box className="w-6 h-6" />
          <div className="font-bold text-lg">Catalog Management</div>
        </div>
        <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Payouts</button>
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Catalog</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg text-gray-900">My Catalog Items</h2>
              <div className="text-sm text-gray-600 mt-1">3 active items • Updated via WhatsApp</div>
            </div>
            <div className="bg-blue-50 border border-blue-300 px-4 py-2 rounded-lg text-sm text-blue-800">
              💬 Send "CATALOG" via WhatsApp to update
            </div>
          </div>

          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="text-left p-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Item Name</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Category</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Unit</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Your Payout</th>
                  <th className="text-left p-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                <tr className="bg-white">
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">UltraTech Cement</div>
                    <div className="text-xs text-gray-600">50kg bag</div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">Cement</td>
                  <td className="p-3 text-sm text-gray-700">per bag</td>
                  <td className="p-3 text-sm font-bold text-gray-900">₹360</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">● ACTIVE</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">ACC Cement</div>
                    <div className="text-xs text-gray-600">50kg bag</div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">Cement</td>
                  <td className="p-3 text-sm text-gray-700">per bag</td>
                  <td className="p-3 text-sm font-bold text-gray-900">₹360</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">● ACTIVE</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">JSW Cement</div>
                    <div className="text-xs text-gray-600">50kg bag</div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">Cement</td>
                  <td className="p-3 text-sm text-gray-700">per bag</td>
                  <td className="p-3 text-sm font-bold text-gray-900">₹360</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">● ACTIVE</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Available Items</h3>
          <div className="text-sm text-gray-600 mb-4">Items you can add to your catalog:</div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 opacity-50">
              <div className="font-semibold text-gray-900">Ambuja Cement</div>
              <div className="text-xs text-gray-600 mt-1">50kg bag • ₹360/bag</div>
              <div className="mt-3 text-xs text-gray-500">Not in your catalog</div>
            </div>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 opacity-50">
              <div className="font-semibold text-gray-900">Shree Cement</div>
              <div className="text-xs text-gray-600 mt-1">50kg bag • ₹360/bag</div>
              <div className="mt-3 text-xs text-gray-500">Not in your catalog</div>
            </div>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 opacity-50">
              <div className="font-semibold text-gray-900">M-Sand</div>
              <div className="text-xs text-gray-600 mt-1">per ton • ₹2,800/ton</div>
              <div className="mt-3 text-xs text-gray-500">Not in your catalog</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mt-4">
            <div className="text-sm text-blue-900 font-semibold mb-2">📱 How to update your catalog:</div>
            <div className="text-xs text-blue-800 space-y-1">
              <div>1. Send "CATALOG" via WhatsApp to Vendara</div>
              <div>2. You'll receive a list of available items</div>
              <div>3. Reply with numbers to select items (e.g., "1, 2, 5")</div>
              <div>4. Your catalog will be updated instantly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 26 - Performance & Analytics (Laptop Frame)
export function VendorScreen26() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6" />
          <div className="font-bold text-lg">Performance & Analytics</div>
        </div>
        <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Analytics</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-2xl text-gray-900 mb-1">Performance Score</h2>
              <div className="text-sm text-gray-600">Based on last 30 days activity</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600">92</div>
              <div className="text-sm text-gray-600 mt-1">Excellent</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Acceptance Rate</div>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">94%</div>
            <div className="text-xs text-gray-600 mt-1">28 of 30 orders</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 uppercase tracking-wide">On-Time Delivery</div>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">96%</div>
            <div className="text-xs text-gray-600 mt-1">27 of 28 orders</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Response Time</div>
              <Loader className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">3.2m</div>
            <div className="text-xs text-gray-600 mt-1">Avg. minutes</div>
          </div>
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Total Orders</div>
              <Package className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">28</div>
            <div className="text-xs text-gray-600 mt-1">This month</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Order Volume Trend</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">January 2026</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="font-bold text-sm w-8 text-right">28</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">December 2025</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="font-bold text-sm w-8 text-right">24</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">November 2025</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="font-bold text-sm w-8 text-right">17</span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-green-50 border border-green-300 rounded-lg p-3 text-center">
              <div className="text-sm text-green-800 font-semibold">📈 +17% growth from last month</div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Issue Log</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="text-sm font-semibold text-gray-900">Order #1250</div>
                  <span className="text-xs text-gray-600">Jan 4</span>
                </div>
                <div className="text-xs text-gray-600">Late delivery (45 min delay)</div>
                <div className="text-xs text-yellow-600 mt-1">⚠️ Warning issued</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="text-sm font-semibold text-gray-900">Order #1243</div>
                  <span className="text-xs text-gray-600">Dec 28</span>
                </div>
                <div className="text-xs text-gray-600">Customer site locked</div>
                <div className="text-xs text-green-600 mt-1">✓ Resolved by ops</div>
              </div>
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center">
                <div className="text-xs text-green-800 font-semibold">✓ Only 2 issues in 28 orders (7%)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-5 mt-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Earnings Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">This Month</div>
              <div className="text-3xl font-bold text-gray-900">₹45,680</div>
              <div className="text-xs text-green-600 mt-1">+12% vs last month</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">Avg per Order</div>
              <div className="text-3xl font-bold text-gray-900">₹1,631</div>
              <div className="text-xs text-gray-600 mt-1">Based on 28 orders</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">All-Time Total</div>
              <div className="text-3xl font-bold text-green-600">₹1,24,560</div>
              <div className="text-xs text-gray-600 mt-1">Since Nov 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 27 - Cancel Order After Acceptance (WhatsApp)
export function VendorScreen27() {
  return (
    <WhatsAppFrame>
      <div className="text-center my-2">
        <div className="bg-blue-100 inline-block px-3 py-1 rounded-full border border-blue-300 text-blue-800 text-xs">Active Order #1248</div>
      </div>
      <WBubble time="11:00 AM">
        <div className="text-sm">I need to cancel Order #1248. Stock issue at warehouse.</div>
      </WBubble>
      <WBubble sent time="11:01 AM">
        <div className="text-sm font-semibold">⚠️ Cancellation Request - Order #1248</div>
        <div className="text-sm mt-2">Our ops team has been notified.</div>
      </WBubble>
      <WBubble sent time="11:02 AM">
        <div className="text-sm">📞 We'll call you in 2 minutes to confirm and arrange alternate vendor.</div>
      </WBubble>
      <div className="text-center my-4">
        <div className="bg-yellow-100 inline-block px-3 py-1 rounded-full border border-yellow-300 text-yellow-800 text-xs">Escalated to Ops</div>
      </div>
      <div className="bg-white border-2 border-gray-300 rounded-xl p-4 mt-4">
        <div className="text-sm font-semibold mb-2 text-red-700">⚠️ Important Note:</div>
        <div className="text-sm text-gray-700">
          • Canceling after acceptance affects performance score
        </div>
        <div className="text-sm text-gray-700">
          • Only cancel for genuine unavoidable issues
        </div>
        <div className="text-sm text-gray-700 mt-2 font-semibold">
          Repeated cancellations may lead to account suspension
        </div>
      </div>
    </WhatsAppFrame>
  );
}

// 28 - View Order Delivery Details (WhatsApp)
export function VendorScreen28() {
  return (
    <WhatsAppFrame>
      <div className="text-center my-2">
        <div className="bg-blue-100 inline-block px-3 py-1 rounded-full border border-blue-300 text-blue-800 text-xs">Active Order #1246</div>
      </div>
      <WBubble time="2:15 PM">
        <div className="text-sm font-semibold">INFO 1246</div>
      </WBubble>
      <WBubble sent time="2:15 PM">
        <div className="text-sm font-semibold mb-2">📦 Order #1246 Details</div>
        <div className="bg-gray-100 border border-gray-300 rounded p-2 mt-2 text-sm space-y-2">
          <div>
            <div className="font-semibold">Item</div>
            <div className="text-gray-700">ACC Cement 50kg • 3 bags</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">Delivery Time</div>
            <div className="text-gray-700">Today, Jan 6 • 3:00-6:00 PM</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">Your Payout</div>
            <div className="text-green-700 font-bold">₹1,080</div>
          </div>
        </div>
      </WBubble>
      <WBubble sent time="2:15 PM">
        <div className="text-sm font-semibold mb-2">📍 Delivery Location</div>
        <div className="bg-gray-100 border border-gray-300 rounded p-2 mt-2 text-sm">
          <div className="font-semibold">Pradeep Construction</div>
          <div className="text-gray-700 mt-1">Plot 45, Survey No. 123</div>
          <div className="text-gray-700">Miyapur Main Road</div>
          <div className="text-gray-700">Hyderabad - 500049</div>
          <div className="bg-blue-50 border border-blue-300 rounded p-2 mt-2 text-xs text-blue-800">
            📱 Contact: Pradeep • +91 98765 12345
          </div>
        </div>
      </WBubble>
      <WBubble sent time="2:15 PM">
        <div className="text-sm text-gray-600">Send <span className="font-bold">DONE</span> after successful delivery</div>
      </WBubble>
    </WhatsAppFrame>
  );
}

// 29 - Contact Support (WhatsApp)
export function VendorScreen29() {
  return (
    <WhatsAppFrame>
      <WBubble time="4:30 PM">
        <div className="text-sm font-semibold">SUPPORT</div>
      </WBubble>
      <WBubble sent time="4:30 PM">
        <div className="text-sm font-semibold mb-2">🆘 Vendara Support</div>
        <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-2 text-sm space-y-3">
          <div>
            <div className="font-semibold">📞 Call Support</div>
            <div className="text-blue-600 mt-1">+91 40-1234-5678</div>
            <div className="text-xs text-gray-600">Available 8 AM - 8 PM</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">💬 WhatsApp Support</div>
            <div className="text-gray-700 text-xs mt-1">You're already connected!</div>
            <div className="text-gray-700 text-xs">Just send your query here</div>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="font-semibold">📧 Email Support</div>
            <div className="text-blue-600 mt-1 text-xs">vendors@realserv.in</div>
            <div className="text-xs text-gray-600">Response within 4 hours</div>
          </div>
        </div>
      </WBubble>
      <WBubble sent time="4:30 PM">
        <div className="text-sm font-semibold mb-2">Common Issues</div>
        <div className="text-sm space-y-1">
          <div>• Payment queries: Send PENDING or BALANCE</div>
          <div>• Order issues: Describe the problem here</div>
          <div>• Technical issues: Call us directly</div>
        </div>
      </WBubble>
      <div className="bg-white border-2 border-gray-300 rounded-xl p-4 mt-4">
        <div className="text-sm text-center text-gray-700">
          <strong>Average Response Time:</strong> &lt;10 minutes during business hours
        </div>
      </div>
    </WhatsAppFrame>
  );
}

// 30 - Help Center (Laptop Frame)
export function VendorScreen30() {
  return (
    <div className="bg-gray-50 h-full overflow-y-auto">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-gray-700">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6" />
          <div className="font-bold text-lg">Help Center</div>
        </div>
        <div className="text-xs text-gray-400">Chauhan Cement Suppliers</div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Payouts</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Catalog</button>
          <button className="px-4 py-2 font-semibold text-gray-900 border-b-2 border-gray-900 -mb-0.5">Help</button>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <LifeBuoy className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="font-bold text-xl text-blue-900">Need Help?</h2>
              <div className="text-sm text-blue-800">We're here to support you</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-blue-300 rounded-lg p-4 text-center">
              <Phone className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-sm mb-1">Call Us</div>
              <div className="text-blue-600 font-bold">+91 40-1234-5678</div>
              <div className="text-xs text-gray-600 mt-1">8 AM - 8 PM</div>
            </div>
            <div className="bg-white border border-blue-300 rounded-lg p-4 text-center">
              <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-sm mb-1">WhatsApp</div>
              <div className="text-xs text-gray-700">Send message on</div>
              <div className="text-xs text-gray-700">your registered number</div>
            </div>
            <div className="bg-white border border-blue-300 rounded-lg p-4 text-center">
              <Mail className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-sm mb-1">Email</div>
              <div className="text-xs text-purple-600">vendors@realserv.in</div>
              <div className="text-xs text-gray-600 mt-1">4 hour response</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
            <h3 className="font-bold text-lg text-gray-900 mb-4">📦 Orders & Fulfillment</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">How do I receive orders?</div>
                <div className="text-xs text-gray-600">You'll get WhatsApp notifications for new order offers. Respond with ACCEPT or REJECT within 15 minutes.</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">What if I can't deliver on time?</div>
                <div className="text-xs text-gray-600">Send DELAY as soon as possible. Our ops team will call you immediately to arrange alternatives.</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">Can I cancel after accepting?</div>
                <div className="text-xs text-gray-600">Only for genuine issues. Send your reason via WhatsApp. Repeated cancellations affect your performance score.</div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
            <h3 className="font-bold text-lg text-gray-900 mb-4">💰 Payouts & Money</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">When do I get paid?</div>
                <div className="text-xs text-gray-600">Weekly settlements every Friday via bank transfer. Send PENDING to check your next payout amount.</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">How is payout calculated?</div>
                <div className="text-xs text-gray-600">Fixed payout per item/unit. All completed orders in the settlement period are paid together.</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">Can I update bank details?</div>
                <div className="text-xs text-gray-600">Contact support via WhatsApp or call us. Bank details require verification before updates.</div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
            <h3 className="font-bold text-lg text-gray-900 mb-4">📋 Catalog & Availability</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">How do I update my catalog?</div>
                <div className="text-xs text-gray-600">Send CATALOG via WhatsApp. You'll get a list of items to select from using numbers.</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">How do I mark myself unavailable?</div>
                <div className="text-xs text-gray-600">Send UNAVAILABLE to stop receiving orders. Send AVAILABLE when ready to resume.</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">Can I set specific unavailable times?</div>
                <div className="text-xs text-gray-600">Currently manual only. Send UNAVAILABLE before that time and AVAILABLE when back.</div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
            <h3 className="font-bold text-lg text-gray-900 mb-4">⚡ Account & Performance</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">How is performance measured?</div>
                <div className="text-xs text-gray-600">Acceptance rate, on-time delivery, response time, and issue frequency. Check Analytics tab for details.</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">What happens if performance drops?</div>
                <div className="text-xs text-gray-600">You'll receive warnings first. Repeated issues may lead to temporary suspension (usually 7 days).</div>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className="font-semibold text-sm mb-1">How do I improve my score?</div>
                <div className="text-xs text-gray-600">Accept orders promptly, deliver on time, and communicate proactively if issues arise.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-5 mt-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">📱 WhatsApp Commands Quick Reference</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">ORDERS</div>
              <div className="text-xs text-gray-600">View active orders</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">PENDING</div>
              <div className="text-xs text-gray-600">Check pending payout</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">BALANCE</div>
              <div className="text-xs text-gray-600">Earnings summary</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">CATALOG</div>
              <div className="text-xs text-gray-600">Update catalog items</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">AVAILABLE</div>
              <div className="text-xs text-gray-600">Start receiving orders</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">UNAVAILABLE</div>
              <div className="text-xs text-gray-600">Stop receiving orders</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">ACCEPT</div>
              <div className="text-xs text-gray-600">Accept order offer</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">REJECT</div>
              <div className="text-xs text-gray-600">Decline order offer</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">DONE</div>
              <div className="text-xs text-gray-600">Mark delivery complete</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">DELAY</div>
              <div className="text-xs text-gray-600">Report delivery delay</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">INFO #</div>
              <div className="text-xs text-gray-600">Get order details</div>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded p-3 text-sm">
              <div className="font-semibold mb-1">HELP</div>
              <div className="text-xs text-gray-600">Show all commands</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
