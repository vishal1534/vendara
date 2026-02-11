import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVendorSupport } from '../../../context/VendorSupportContext';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../app/components/ui/card';
import { Separator } from '../../../../app/components/ui/separator';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Search,
  Ticket,
  BookOpen,
  Video,
  ExternalLink,
} from 'lucide-react';

// Mapping of question parameters to FAQ IDs
const questionToFaqMap: Record<string, string> = {
  catalog: 'faq_005', // How do I add new items to my catalog?
  payment: 'faq_003', // When will I receive payment for completed orders?
  offers: 'faq_001', // How long do I have to accept or reject an order request?
  delivery: 'faq_010', // What if the buyer does not pick up the order on time?
};

export function SupportPage() {
  const { faqs, openTicketsCount } = useVendorSupport();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const faqRefs = useRef<Record<string, HTMLDetailsElement | null>>({});

  // Handle question parameter from URL
  useEffect(() => {
    const questionParam = searchParams.get('question');
    if (questionParam && questionToFaqMap[questionParam]) {
      const faqId = questionToFaqMap[questionParam];
      setExpandedFaqId(faqId);
      
      // Scroll to the FAQ after a short delay to ensure rendering
      setTimeout(() => {
        const faqElement = faqRefs.current[faqId];
        if (faqElement) {
          faqElement.open = true;
          faqElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [searchParams]);

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  // Filter FAQs based on search
  const filteredFAQs = searchQuery
    ? faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Help & Support</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Get help with orders, payments, and account management
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create Ticket */}
        <Card className="border-primary-200 hover:border-primary-300 transition-colors cursor-pointer" onClick={() => navigate('/vendor/support/create-ticket')}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Ticket className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">Create Support Ticket</h3>
                <p className="text-xs text-neutral-600 mb-2">Get personalized help from our support team</p>
                <Button variant="link" className="text-xs text-primary-600 p-0 h-auto">
                  Create Ticket →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Tickets */}
        <Card className="border-neutral-200 hover:border-primary-200 transition-colors cursor-pointer" onClick={() => navigate('/vendor/support/tickets')}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-neutral-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 flex items-center gap-2">
                  My Support Tickets
                  {openTicketsCount > 0 && (
                    <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                      {openTicketsCount} open
                    </Badge>
                  )}
                </h3>
                <p className="text-xs text-neutral-600 mb-2">Track and manage your support requests</p>
                <Button variant="link" className="text-xs text-primary-600 p-0 h-auto">
                  View Tickets →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Support */}
        <Card className="border-neutral-200 hover:border-success-200 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-success-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">WhatsApp Support</h3>
                <p className="text-xs text-neutral-600 mb-2">For urgent issues, contact us directly</p>
                <Button
                  variant="link"
                  className="text-xs text-success-600 p-0 h-auto"
                  onClick={() => window.open('https://wa.me/917906441952', '_blank')}
                >
                  Chat Now →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="border-neutral-200 bg-neutral-50">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Phone Support</p>
                <p className="text-sm text-neutral-600 mt-1">+91 7906441952</p>
                <p className="text-xs text-neutral-500 mt-1">Mon-Sat, 9 AM - 6 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Email Support</p>
                <p className="text-sm text-neutral-600 mt-1">vendor@vendara.in</p>
                <p className="text-xs text-neutral-500 mt-1">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Support Hours</p>
                <p className="text-sm text-neutral-600 mt-1">Mon-Sat: 9 AM - 6 PM</p>
                <p className="text-xs text-neutral-500 mt-1">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search FAQs */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Frequently Asked Questions</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
          />
        </div>
      </div>

      {/* FAQ Results or Categories */}
      {searchQuery ? (
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <Card className="border-neutral-200">
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-900 mb-1">No results found</p>
                <p className="text-xs text-neutral-500">
                  Try different keywords or create a support ticket for help
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="border-neutral-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-3">{faq.answer}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs bg-neutral-50 text-neutral-600 border-neutral-200">
                          {faq.category}
                        </Badge>
                        <span className="text-xs text-neutral-500">
                          {faq.helpful} people found this helpful
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                {category}
              </h3>
              <div className="space-y-2">
                {categoryFaqs.map((faq) => (
                  <details key={faq.id} className="group bg-white border border-neutral-200 rounded-lg" ref={el => faqRefs.current[faq.id] = el}>
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
                      <span className="text-sm font-medium text-neutral-900 pr-4">
                        {faq.question}
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-4 pb-4 pt-2 border-t border-neutral-100">
                      <p className="text-sm text-neutral-600 mb-3">{faq.answer}</p>
                      {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedLinks.map((link, idx) => (
                            <Button
                              key={idx}
                              variant="link"
                              size="sm"
                              onClick={() => navigate(link.url)}
                              className="text-xs text-primary-600 p-0 h-auto"
                            >
                              {link.label} →
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Resources */}
      <Card className="border-primary-200 bg-primary-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-neutral-900">
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="https://realserv.in/vendor-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Video Tutorials</p>
                <p className="text-xs text-neutral-500">Step-by-step guides</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </a>
          <a
            href="https://realserv.in/vendor-terms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Vendor Terms & Conditions</p>
                <p className="text-xs text-neutral-500">Policies and guidelines</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}