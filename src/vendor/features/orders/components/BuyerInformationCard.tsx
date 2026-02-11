import { Phone, Mail, MessageCircle, User, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { Separator } from '../../../../app/components/ui/separator';

interface BuyerInformationCardProps {
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  buyerCompany?: string;
  orderNumber: string;
}

export function BuyerInformationCard({
  buyerName = 'Vendara Buyer',
  buyerPhone,
  buyerEmail,
  buyerCompany,
  orderNumber,
}: BuyerInformationCardProps) {
  const handleCall = () => {
    if (buyerPhone) {
      window.location.href = `tel:${buyerPhone}`;
    }
  };

  const handleWhatsApp = () => {
    if (buyerPhone) {
      const message = `Hi, I'm contacting you regarding order ${orderNumber}`;
      window.open(`https://wa.me/${buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (buyerEmail) {
      const subject = `Regarding Order ${orderNumber}`;
      window.location.href = `mailto:${buyerEmail}?subject=${encodeURIComponent(subject)}`;
    }
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          Buyer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Name
          </label>
          <p className="text-base font-semibold text-neutral-900 mt-1">{buyerName}</p>
        </div>

        {buyerCompany && (
          <>
            <Separator />
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Company
              </label>
              <p className="text-base text-neutral-900 mt-1">{buyerCompany}</p>
            </div>
          </>
        )}

        {buyerPhone && (
          <>
            <Separator />
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Phone
              </label>
              <p className="text-base text-neutral-900 mt-1">{buyerPhone}</p>
            </div>
          </>
        )}

        {buyerEmail && (
          <>
            <Separator />
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email
              </label>
              <p className="text-sm text-neutral-900 mt-1 break-all">{buyerEmail}</p>
            </div>
          </>
        )}

        {/* Contact Actions */}
        {buyerPhone && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Quick Actions
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  className="justify-start border-2 border-neutral-200 hover:bg-primary-50 hover:border-primary-300"
                >
                  <Phone className="w-4 h-4 mr-2 text-primary-600" />
                  Call Buyer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsApp}
                  className="justify-start border-2 border-neutral-200 hover:bg-success-50 hover:border-success-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-success-600" />
                  WhatsApp
                </Button>
                {buyerEmail && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmail}
                    className="justify-start border-2 border-neutral-200 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    Email
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Info Note */}
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-600">
            Contact the buyer if you need to coordinate delivery times or discuss order details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
