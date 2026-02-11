import { Phone, MessageCircle, Building2, CheckCircle, ShieldCheck, MapPin, AlertCircle, Loader, Package, FileText, Wallet, DollarSign, Bell, Settings } from "lucide-react";

// WhatsApp Frame Component
function WhatsAppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white h-full relative overflow-hidden">
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
      
      <div className="bg-[#ece5dd] p-4 pb-20 overflow-y-auto" style={{ height: 'calc(100% - 76px)' }}>
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

// WhatsApp Bubble Component
function WhatsAppBubble({ sent = false, children, time = "10:00 AM" }: { sent?: boolean; children: React.ReactNode; time?: string }) {
  return (
    <div className={`flex ${sent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${sent ? 'bg-[#dcf8c6]' : 'bg-white border border-gray-300'}`}>
        {children}
        <div className="text-[11px] text-gray-600 text-right mt-1">{time}</div>
      </div>
    </div>
  );
}

// Phone Frame Component (same as buyer screens)
function PhoneFrame({ children, showBottomNav = false }: { children: React.ReactNode; showBottomNav?: boolean }) {
  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      <div className="bg-gray-800 rounded-[56px] p-3.5 shadow-xl border border-gray-700">
        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[120px] h-8 bg-black rounded-[20px] z-50"></div>
        <div className="bg-black rounded-[46px] overflow-hidden relative" style={{ height: '852px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// 01 - Vendor Interest (Lead)
export function VendorInterestScreen() {
  return (
    <PhoneFrame showBottomNav={false}>
      <WhatsAppFrame>
        <WhatsAppBubble time="2:30 PM">
          <div className="text-sm">Hello! I'm interested in becoming a Vendara vendor for cement supply in Miyapur area.</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="2:32 PM">
          <div className="text-sm">Great! Thanks for your interest. We'll get back to you within 24 hours to start the verification process.</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="2:32 PM">
          <div className="text-sm">Please share:</div>
          <div className="text-sm mt-1">1. Your full name</div>
          <div className="text-sm">2. Shop/business name</div>
          <div className="text-sm">3. Location/area</div>
        </WhatsAppBubble>
        
        <div className="text-center my-4">
          <div className="bg-white inline-block px-3 py-1 rounded-full border border-gray-300 text-xs">Vendor State: LEAD</div>
        </div>
      </WhatsAppFrame>
    </PhoneFrame>
  );
}

// 02 - Verification (In-Person)
export function VendorVerificationScreen() {
  return (
    <PhoneFrame showBottomNav={false}>
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
            <div className="text-sm text-gray-600">Aadhaar / PAN / Driving License</div>
          </div>
          
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-3">
            <div className="font-semibold mb-3">Vendor Details</div>
            <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm mb-2" value="Vishal Chauhan" readOnly />
            <input type="text" placeholder="Business Name" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm mb-2" value="Chauhan Cement Suppliers" readOnly />
            <input type="text" placeholder="Phone Number" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm mb-2" value="+91 7906441952" readOnly />
            <input type="text" placeholder="Service Area" className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-sm" value="Miyapur, Hyderabad" readOnly />
          </div>
          
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-3">
            <div className="font-semibold mb-3">Category Selection</div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 border-gray-900 rounded-lg bg-gray-50">
                <div className="w-5 h-5 rounded border-2 border-gray-900 bg-gray-900 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">Cement Supplier</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg">
                <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                <span className="font-medium">Sand Supplier</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg">
                <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                <span className="font-medium">Mason</span>
              </label>
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
    </PhoneFrame>
  );
}

// 03 - Catalog Opt-In (WhatsApp)
export function VendorCatalogOptInScreen() {
  return (
    <PhoneFrame showBottomNav={false}>
      <WhatsAppFrame>
        <WhatsAppBubble sent time="3:45 PM">
          <div className="text-sm font-semibold mb-2">Catalog Selection</div>
          <div className="text-sm">You selected: Cement Supplier</div>
          <div className="text-sm mt-2">Please select which items you can supply:</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="3:45 PM">
          <div className="text-sm">Available Cement Items:</div>
          <div className="text-sm mt-1">1. ✓ UltraTech Cement 50kg</div>
          <div className="text-sm">2. ✓ ACC Cement 50kg</div>
          <div className="text-sm">3. ✗ Ambuja Cement 50kg</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble time="3:47 PM">
          <div className="text-sm">I can supply UltraTech and ACC. Not Ambuja.</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="3:48 PM">
          <div className="text-sm">✓ Confirmed:</div>
          <div className="text-sm mt-1">• UltraTech Cement 50kg</div>
          <div className="text-sm">• ACC Cement 50kg</div>
          <div className="text-sm mt-2 font-semibold">You can update this anytime.</div>
        </WhatsAppBubble>
        
        <div className="text-center my-4">
          <div className="bg-white inline-block px-3 py-1 rounded-full border border-gray-300 text-xs">Vendor State: CATALOG OPT-IN</div>
        </div>
      </WhatsAppFrame>
    </PhoneFrame>
  );
}

// 04 - Commercial Acceptance
export function VendorCommercialAcceptanceScreen() {
  return (
    <PhoneFrame showBottomNav={false}>
      <WhatsAppFrame>
        <WhatsAppBubble sent time="4:15 PM">
          <div className="text-sm font-semibold mb-2">⚠️ Important: Commercial Terms</div>
          <div className="text-sm mt-2">Vendara operates with:</div>
          <div className="text-sm mt-1">✓ Fixed pricing (no negotiation)</div>
          <div className="text-sm">✓ Small/micro orders only</div>
          <div className="text-sm">✓ Digital settlements (weekly)</div>
          <div className="text-sm">✓ No direct buyer contact</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="4:15 PM">
          <div className="text-sm font-semibold">Sample Pricing:</div>
          <div className="text-sm mt-1">UltraTech 50kg: ₹380/bag</div>
          <div className="text-sm">Your payout: ₹360/bag</div>
          <div className="text-sm mt-2 text-gray-600">Delivery included</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="4:16 PM">
          <div className="text-sm">Reply YES to accept these terms</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble time="4:18 PM">
          <div className="text-sm font-semibold">YES</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="4:18 PM">
          <div className="text-sm">🎉 Great! Terms accepted.</div>
          <div className="text-sm mt-1">Your profile is being activated...</div>
        </WhatsAppBubble>
        
        <div className="text-center my-4">
          <div className="bg-white inline-block px-3 py-1 rounded-full border border-gray-300 text-xs">Vendor State: COMMERCIAL ACCEPTANCE</div>
        </div>
      </WhatsAppFrame>
    </PhoneFrame>
  );
}

// 05 - Profile Activated
export function VendorProfileActivatedScreen() {
  return (
    <PhoneFrame showBottomNav={false}>
      <WhatsAppFrame>
        <WhatsAppBubble sent time="4:20 PM">
          <div className="text-sm font-semibold">✅ Profile Activated!</div>
          <div className="text-sm mt-2">Welcome to Vendara, Rajesh!</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="4:20 PM">
          <div className="text-sm font-semibold">Your Details:</div>
          <div className="text-sm mt-1">📍 Area: Miyapur</div>
          <div className="text-sm">📦 Category: Cement Supplier</div>
          <div className="text-sm">✓ Items: UltraTech, ACC (50kg)</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="4:21 PM">
          <div className="text-sm font-semibold">What's Next?</div>
          <div className="text-sm mt-1">• You'll receive order offers here</div>
          <div className="text-sm">• Reply ACCEPT or REJECT</div>
          <div className="text-sm">• Access portal for history & payouts</div>
        </WhatsAppBubble>
        
        <WhatsAppBubble sent time="4:21 PM">
          <div className="text-sm">Portal: vendor.vendara.in</div>
          <div className="text-sm mt-1">Login: +91 7906441952</div>
          <div className="text-sm">OTP will be sent</div>
        </WhatsAppBubble>
        
        <div className="text-center my-4">
          <div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Vendor State: ELIGIBLE ✓</div>
        </div>
      </WhatsAppFrame>
    </PhoneFrame>
  );
}

// 06 - Default Available State
export function VendorDefaultAvailableScreen() {
  return (
    <PhoneFrame showBottomNav={false}>
      <WhatsAppFrame>
        <div className="text-center my-4">
          <div className="bg-green-100 inline-block px-3 py-1 rounded-full border border-green-300 text-green-800 text-xs">Status: AVAILABLE (Default)</div>
        </div>
        
        <div className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
            <div className="font-bold text-lg mb-2">You're Available</div>
            <div className="text-sm text-gray-600 mb-4">Ready to receive order offers</div>
            
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs text-left">
              <div className="font-semibold mb-2">ℹ️ How it works:</div>
              <div className="text-gray-600">• You're assumed available by default</div>
              <div className="text-gray-600">• No daily check-ins required</div>
              <div className="text-gray-600">• Send BUSY or PAUSE if needed</div>
            </div>
          </div>
        </div>
        
        <WhatsAppBubble sent time="9:00 AM">
          <div className="text-sm">You can send availability updates anytime:</div>
          <div className="text-sm mt-1">• AVAILABLE</div>
          <div className="text-sm">• BUSY</div>
          <div className="text-sm">• AFTER 2PM</div>
          <div className="text-sm">• PAUSE</div>
        </WhatsAppBubble>
      </WhatsAppFrame>
    </PhoneFrame>
  );
}

// Continue with remaining screens...
// (Due to length, I'll add the rest in a second file or you can request specific ones)

// Export placeholder for screens 7-23
export function VendorSendAvailabilityScreen() { return <PhoneFrame><div className="p-4">Screen 07 - Coming Soon</div></PhoneFrame>; }
export function VendorPauseOrdersScreen() { return <PhoneFrame><div className="p-4">Screen 08 - Coming Soon</div></PhoneFrame>; }
export function VendorOrderOfferScreen() { return <PhoneFrame><div className="p-4">Screen 09 - Coming Soon</div></PhoneFrame>; }
export function VendorAcceptOrderScreen() { return <PhoneFrame><div className="p-4">Screen 10 - Coming Soon</div></PhoneFrame>; }
export function VendorRejectOrderScreen() { return <PhoneFrame><div className="p-4">Screen 11 - Coming Soon</div></PhoneFrame>; }
export function VendorReadinessCheckScreen() { return <PhoneFrame><div className="p-4">Screen 12 - Coming Soon</div></PhoneFrame>; }
export function VendorDelayNotificationScreen() { return <PhoneFrame><div className="p-4">Screen 13 - Coming Soon</div></PhoneFrame>; }
export function VendorActiveOrderScreen() { return <PhoneFrame><div className="p-4">Screen 14 - Coming Soon</div></PhoneFrame>; }
export function VendorSendDoneScreen() { return <PhoneFrame><div className="p-4">Screen 15 - Coming Soon</div></PhoneFrame>; }
export function VendorWaitingConfirmationScreen() { return <PhoneFrame><div className="p-4">Screen 16 - Coming Soon</div></PhoneFrame>; }
export function VendorPortalDashboardScreen() { return <PhoneFrame><div className="p-4">Screen 17 - Coming Soon</div></PhoneFrame>; }
export function VendorOrderHistoryScreen() { return <PhoneFrame><div className="p-4">Screen 18 - Coming Soon</div></PhoneFrame>; }
export function VendorOrderDetailsScreen() { return <PhoneFrame><div className="p-4">Screen 19 - Coming Soon</div></PhoneFrame>; }
export function VendorPayoutLedgerScreen() { return <PhoneFrame><div className="p-4">Screen 20 - Coming Soon</div></PhoneFrame>; }
export function VendorSettlementSummaryScreen() { return <PhoneFrame><div className="p-4">Screen 21 - Coming Soon</div></PhoneFrame>; }
export function VendorReportIssueScreen() { return <PhoneFrame><div className="p-4">Screen 22 - Coming Soon</div></PhoneFrame>; }
export function VendorWarningSuspensionScreen() { return <PhoneFrame><div className="p-4">Screen 23 - Coming Soon</div></PhoneFrame>; }
