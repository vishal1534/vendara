/**
 * Platform Settings Page - Admin Portal
 * System configuration and platform management
 */

import { useState } from 'react';
import { Button } from '../../../../app/components/ui/button';
import { Card } from '../../../../app/components/ui/card';
import { Input } from '../../../../app/components/ui/input';
import { Switch } from '../../../../app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../app/components/ui/tabs';
import {
  Settings,
  Save,
  IndianRupee,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  
  // General Settings
  const [platformFee, setPlatformFee] = useState(3);
  const [gstRate, setGstRate] = useState(12);
  const [minOrderValue, setMinOrderValue] = useState(500);
  
  // Features
  const [autoApproveVendors, setAutoApproveVendors] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Platform Settings</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="border-b border-neutral-200 w-full rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="pricing"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Pricing & Fees
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 border-b-2 border-transparent rounded-none px-4 py-3 -mb-[2px]"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Platform Configuration</h2>
            
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Auto-Approve Vendors</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Automatically approve vendor registrations without manual review
                    </p>
                  </div>
                  <Switch
                    checked={autoApproveVendors}
                    onCheckedChange={setAutoApproveVendors}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Maintenance Mode</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Put platform in maintenance mode (users cannot place orders)
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Configuration</h2>
            <Card className="p-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Minimum Order Value
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-48"
                  />
                  <span className="text-sm text-neutral-600">INR</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Orders below this amount will not be accepted
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing & Fees Tab */}
        <TabsContent value="pricing" className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Fee Structure</h2>
            
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Platform Commission Rate
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(Number(e.target.value))}
                      className="w-32"
                      step="0.1"
                    />
                    <span className="text-sm text-neutral-600">%</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Commission charged on all orders (currently: {platformFee}%)
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default GST Rate
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-neutral-600">%</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Default tax rate applied to orders (currently: {gstRate}%)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Current Fee Summary</h2>
            <Card className="p-6 bg-primary-50 border-primary-100">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-700">Platform Commission</span>
                  <span className="font-semibold text-neutral-900">{platformFee}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-700">GST</span>
                  <span className="font-semibold text-neutral-900">{gstRate}%</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-primary-200">
                  <span className="text-neutral-700">Min Order Value</span>
                  <span className="font-semibold text-primary-900">{formatCurrency(minOrderValue)}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Preferences</h2>
            
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Email Notifications</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Send email notifications for orders, updates, and alerts
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">SMS Notifications</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      Send SMS notifications for critical order updates
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Events</h2>
            <Card className="p-6">
              <div className="space-y-3">
                {[
                  'New order placed',
                  'Order status updated',
                  'Payment received',
                  'Vendor registration',
                  'Buyer registration',
                  'Low inventory alert',
                ].map((event, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-8 h-8 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    </div>
                    <span className="text-sm text-neutral-900">{event}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}