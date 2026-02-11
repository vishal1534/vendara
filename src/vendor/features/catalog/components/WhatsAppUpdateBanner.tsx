import { MessageCircle } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';

export function WhatsAppUpdateBanner() {
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${catalogUpdateInstructions.whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(catalogUpdateInstructions.whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-success-50 border-2 border-success-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 bg-success-100 rounded-lg">
          <MessageCircle className="w-5 h-5 text-success-700" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 mb-2">
            Alternative: Update via WhatsApp
          </h3>
          <p className="text-sm text-neutral-700 mb-3">
            You can also manage your catalog by sending a WhatsApp message to Vendara support.
          </p>
          
          <Button
            onClick={handleWhatsAppClick}
            variant="outline"
            size="sm"
            className="bg-white border-success-300 text-success-700 hover:bg-success-50"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}