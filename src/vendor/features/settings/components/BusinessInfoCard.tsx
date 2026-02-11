import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Badge } from '../../../../app/components/ui/badge';
import { Button } from '../../../../app/components/ui/button';
import { Checkbox } from '../../../../app/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../../../app/components/ui/dialog';
import { Input } from '../../../../app/components/ui/input';
import { Building2, User, Phone, Mail, MapPin, Edit3, Search, CheckSquare, XSquare, Info, Lock } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import type { VendorProfile } from '../../../types/vendor';
import { HYDERABAD_SERVICE_AREAS, getAllowedServiceAreas, isAreaAllowed } from '../../../constants/serviceAreas';
import { useVendorAuth } from '../../../context/VendorAuthContext';

interface BusinessInfoCardProps {
  vendor: VendorProfile;
}

export function BusinessInfoCard({ vendor }: BusinessInfoCardProps) {
  const { updateServiceAreas } = useVendorAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(vendor.serviceAreas);
  const [searchQuery, setSearchQuery] = useState('');

  // Get allowed service areas based on vendor's business location
  const allowedAreas = useMemo(() => {
    return getAllowedServiceAreas(vendor.businessLocation);
  }, [vendor.businessLocation]);

  useEffect(() => {
    setSelectedAreas(vendor.serviceAreas);
  }, [vendor.serviceAreas]);

  // Filter areas based on search
  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return HYDERABAD_SERVICE_AREAS;
    
    const query = searchQuery.toLowerCase();
    return HYDERABAD_SERVICE_AREAS.filter(area => 
      area.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Separate allowed and restricted areas for display
  const { allowedFilteredAreas, restrictedFilteredAreas } = useMemo(() => {
    const allowed: string[] = [];
    const restricted: string[] = [];
    
    filteredAreas.forEach(area => {
      if (allowedAreas.includes(area)) {
        allowed.push(area);
      } else {
        restricted.push(area);
      }
    });
    
    return { allowedFilteredAreas: allowed, restrictedFilteredAreas: restricted };
  }, [filteredAreas, allowedAreas]);

  const handleToggleArea = (area: string) => {
    // Only allow toggling if area is in the allowed list
    if (!allowedAreas.includes(area)) {
      toast.error('This area is outside your service zone. Contact Vendara support to expand your zone.');
      return;
    }
    
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleSelectAll = () => {
    setSelectedAreas([...allowedAreas]);
  };

  const handleClearAll = () => {
    setSelectedAreas([]);
  };

  const handleSave = () => {
    if (selectedAreas.length === 0) {
      toast.error('Please select at least one service area');
      return;
    }

    updateServiceAreas(selectedAreas);
    setIsDialogOpen(false);
    toast.success('Service areas updated successfully');
  };

  const handleCancel = () => {
    setSelectedAreas(vendor.serviceAreas);
    setSearchQuery('');
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setSelectedAreas(vendor.serviceAreas);
    setSearchQuery('');
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary-700" />
          Business Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Business Name */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            Business Name
          </label>
          <div className="flex items-center gap-2">
            <p className="text-base font-medium text-neutral-900">{vendor.businessName}</p>
            <Badge variant="outline" className="bg-success-100 text-success-700 border-success-200">
              Verified
            </Badge>
          </div>
        </div>

        {/* Owner Name */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            <User className="w-3.5 h-3.5 inline mr-1" />
            Owner Name
          </label>
          <p className="text-base text-neutral-900">{vendor.ownerName}</p>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            <Phone className="w-3.5 h-3.5 inline mr-1" />
            Phone Number
          </label>
          <p className="text-base text-neutral-900 font-mono">{vendor.phone}</p>
        </div>

        {/* Email */}
        {vendor.email && (
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              Email Address
            </label>
            <p className="text-base text-neutral-900">{vendor.email}</p>
          </div>
        )}

        {/* Service Areas */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            Service Areas
          </label>
          <div className="flex flex-wrap gap-2">
            {vendor.serviceAreas.map((area) => (
              <Badge key={area} variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-300">
                {area}
              </Badge>
            ))}
          </div>
          <Button
            className="mt-2"
            size="sm"
            variant="outline"
            onClick={handleOpenDialog}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* Read-only Notice */}
        <div className="pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            <strong>Note:</strong> To update business information,{' '}
            <Link to="/vendor/support" className="text-primary-700 hover:text-primary-800 underline font-medium">
              contact Vendara support
            </Link>
            .
          </p>
        </div>
      </CardContent>

      {/* Premium Dialog for editing service areas */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Edit Service Areas
            </DialogTitle>
            <DialogDescription>
              You can select areas within your zone based on your business location ({vendor.businessLocation}).{' '}
              <Link to="/vendor/support" className="text-primary-700 hover:text-primary-800 underline font-medium">
                Contact Vendara support
              </Link>{' '}
              to serve additional areas.
            </DialogDescription>
          </DialogHeader>
          
          {/* Zone Restriction Info Banner */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-primary-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm text-neutral-700">
              <p className="font-medium text-neutral-900 mb-1">Service Zone Policy</p>
              <p className="text-xs">
                Based on your location in <span className="font-semibold">{vendor.businessLocation}</span>, you can serve <span className="font-semibold">{allowedAreas.length} areas</span> within a 15km radius. 
                Need to expand?{' '}
                <Link to="/vendor/support" className="text-primary-700 hover:text-primary-800 underline font-medium">
                  Contact Vendara support
                </Link>
                .
              </p>
            </div>
          </div>
          
          {/* Search and Quick Actions Bar */}
          <div className="space-y-3 pb-4 border-b border-neutral-200">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Selection Info and Quick Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary-100 text-primary-700 border-primary-200">
                  {selectedAreas.length} of {allowedAreas.length} selected
                </Badge>
                {filteredAreas.length !== HYDERABAD_SERVICE_AREAS.length && (
                  <span className="text-xs text-neutral-500">
                    ({filteredAreas.length} of {HYDERABAD_SERVICE_AREAS.length} shown)
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-8 text-xs hover:bg-primary-50"
                >
                  <CheckSquare className="w-3.5 h-3.5 mr-1" />
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-8 text-xs hover:bg-neutral-100"
                >
                  <XSquare className="w-3.5 h-3.5 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
          
          {/* Areas Grid */}
          <div className="max-h-[340px] overflow-y-auto pr-2 space-y-4">
            {filteredAreas.length > 0 ? (
              <>
                {/* Your Service Zone Areas */}
                {allowedFilteredAreas.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success-500"></div>
                      Your Service Zone ({allowedFilteredAreas.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {allowedFilteredAreas.map(area => {
                        const isSelected = selectedAreas.includes(area);
                        return (
                          <div 
                            key={area} 
                            className={`
                              flex items-center gap-2.5 p-3 rounded-lg border-2 transition-all cursor-pointer
                              ${isSelected 
                                ? 'bg-primary-50 border-primary-300 shadow-sm' 
                                : 'bg-neutral-50 border-neutral-200 hover:border-primary-200 hover:bg-neutral-100'
                              }
                            `}
                            onClick={() => handleToggleArea(area)}
                          >
                            <Checkbox
                              id={`area-${area}`}
                              checked={isSelected}
                              onCheckedChange={() => handleToggleArea(area)}
                              className="pointer-events-none"
                            />
                            <label
                              htmlFor={`area-${area}`}
                              className={`
                                text-sm font-medium leading-none cursor-pointer select-none flex-1
                                ${isSelected ? 'text-primary-700' : 'text-neutral-900'}
                              `}
                            >
                              {area}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Outside Zone Areas - Locked */}
                {restrictedFilteredAreas.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Outside Your Zone ({restrictedFilteredAreas.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {restrictedFilteredAreas.map(area => (
                        <div 
                          key={area} 
                          className="flex items-center gap-2.5 p-3 rounded-lg border-2 bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed"
                          onClick={() => handleToggleArea(area)}
                          title="Contact Vendara support to serve this area"
                        >
                          <Checkbox
                            id={`area-${area}`}
                            checked={false}
                            disabled
                            className="pointer-events-none"
                          />
                          <label
                            htmlFor={`area-${area}`}
                            className="text-sm font-medium leading-none select-none flex-1 text-neutral-600 cursor-not-allowed"
                          >
                            {area}
                          </label>
                          <Lock className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 italic">
                      <Link to="/vendor/support" className="text-primary-700 hover:text-primary-800 underline font-medium">
                        Contact Vendara support
                      </Link>{' '}
                      to add these areas to your zone
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                <p className="text-neutral-600 mb-1">No areas match your search</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={selectedAreas.length === 0}
              className="min-w-[140px]"
            >
              Save {selectedAreas.length > 0 && `(${selectedAreas.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}