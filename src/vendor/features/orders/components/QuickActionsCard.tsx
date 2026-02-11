import { Download, FileText, Truck, Share2, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import { toast } from 'sonner';

interface QuickActionsCardProps {
  orderNumber: string;
  onDownloadInvoice: () => void;
  onDownloadDeliveryChallan: () => void;
}

export function QuickActionsCard({
  orderNumber,
  onDownloadInvoice,
  onDownloadDeliveryChallan,
}: QuickActionsCardProps) {
  const handleShareOrder = () => {
    const orderUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `Order ${orderNumber}`,
          text: `View order details for ${orderNumber}`,
          url: orderUrl,
        })
        .then(() => toast.success('Order shared successfully'))
        .catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(orderUrl);
      toast.success('Order link copied to clipboard');
    }
  };

  const handlePrintOrder = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900">
          Documents & Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadInvoice}
          className="w-full justify-start border-2 border-neutral-200 hover:bg-primary-50 hover:border-primary-300"
        >
          <FileText className="w-4 h-4 mr-2 text-primary-600" />
          <span className="flex-1 text-left">Download Invoice</span>
          <Download className="w-4 h-4 text-neutral-400" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadDeliveryChallan}
          className="w-full justify-start border-2 border-neutral-200 hover:bg-primary-50 hover:border-primary-300"
        >
          <Truck className="w-4 h-4 mr-2 text-primary-600" />
          <span className="flex-1 text-left">Download Delivery Challan</span>
          <Download className="w-4 h-4 text-neutral-400" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintOrder}
          className="w-full justify-start border-2 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
        >
          <Printer className="w-4 h-4 mr-2 text-neutral-600" />
          <span className="flex-1 text-left">Print Order Details</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShareOrder}
          className="w-full justify-start border-2 border-neutral-200 hover:bg-blue-50 hover:border-blue-300"
        >
          <Share2 className="w-4 h-4 mr-2 text-blue-600" />
          <span className="flex-1 text-left">Share Order Details</span>
        </Button>

        <div className="pt-3 mt-3 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            Keep these documents for tax compliance and record-keeping
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
