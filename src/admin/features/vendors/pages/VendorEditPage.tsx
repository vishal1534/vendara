/**
 * Vendor Edit Page
 * Edit vendor details and configuration
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Label } from '../../../../app/components/ui/label';
import { Textarea } from '../../../../app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { mockVendors } from '../../../mocks/vendors.mock';
import { toast } from 'sonner';

export function VendorEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vendor = mockVendors.find((v) => v.id === id);

  const [formData, setFormData] = useState({
    businessName: vendor?.businessName || '',
    ownerName: vendor?.ownerName || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    category: vendor?.category || '',
    gstNumber: vendor?.gstNumber || '',
    panNumber: vendor?.panNumber || '',
    address: vendor?.address || '',
    pincode: vendor?.pincode || '',
    city: vendor?.city || '',
    serviceRadius: vendor?.serviceRadius || 10,
    commissionRate: vendor?.commissionRate || 3,
    status: vendor?.status || 'active',
  });

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Vendor not found</p>
        <Button onClick={() => navigate('/admin/vendors')} className="mt-4">
          Back to Vendors
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, this would make an API call to update the vendor
    toast.success(`Vendor "${formData.businessName}" updated successfully!`);
    navigate(`/admin/vendors/${id}`);
  };

  const handleCancel = () => {
    navigate(`/admin/vendors/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/admin/vendors/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Edit Vendor</h1>
            <p className="text-sm text-neutral-600">{vendor.businessName}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Business Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Business Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Material Supplier">Material Supplier</SelectItem>
                  <SelectItem value="Labor Contractor">Labor Contractor</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Tax & Legal */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Tax & Legal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber}
                onChange={(e) =>
                  setFormData({ ...formData, gstNumber: e.target.value })
                }
                placeholder="Enter GST number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) =>
                  setFormData({ ...formData, panNumber: e.target.value })
                }
                placeholder="Enter PAN number"
              />
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Address</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Service Configuration */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Service Configuration
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceRadius">Service Radius (km)</Label>
              <Input
                id="serviceRadius"
                type="number"
                value={formData.serviceRadius}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceRadius: parseInt(e.target.value) || 0,
                  })
                }
                min="1"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                value={formData.commissionRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    commissionRate: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                max="20"
                step="0.1"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
