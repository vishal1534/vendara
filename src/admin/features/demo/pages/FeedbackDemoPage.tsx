/**
 * Feedback Components Demo Page
 * Showcases all Vendara feedback components with examples
 * Located at: /admin/demo/feedback
 */

import { useState } from 'react';
import { Card } from '../../../../app/components/ui/card';
import { Button } from '../../../../app/components/ui/button';
import {
  Alert,
  ConfirmationDialog,
  EmptyState,
  ErrorState,
  StatusIndicator,
  StatusDot,
  LoadingState,
  Spinner,
  Skeleton,
} from '../../../components/feedback';
import {
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackDemoPage() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDestructiveDialog, setShowDestructiveDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmAction = () => {
    toast.success('Action confirmed successfully');
  };

  const handleDeleteAction = () => {
    toast.success('Item deleted successfully');
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Feedback Components</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Vendara Design System - Construction-native feedback UI
        </p>
      </div>

      {/* 1. Alerts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">1. Alert Component</h2>
          <p className="text-sm text-neutral-600">
            Inline banners for info, success, warning, and error messages
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Info Alert</h3>
            <Alert
              variant="info"
              title="System Update Available"
              description="A new version of the admin portal is available. Update now for the latest features."
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Success Alert</h3>
            <Alert
              variant="success"
              description="Material successfully added to the catalog."
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Warning Alert (with action)</h3>
            <Alert
              variant="warning"
              title="Low Stock Warning"
              description="This material is running low. Consider restocking soon."
              action={{
                label: 'Restock Now',
                onClick: () => toast.info('Opening restock form...'),
              }}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Error Alert (dismissible)</h3>
            {showAlert && (
              <Alert
                variant="error"
                title="Upload Failed"
                description="The image file is too large. Maximum size is 5MB."
                dismissible
                onDismiss={() => setShowAlert(false)}
              />
            )}
            {!showAlert && (
              <Button variant="outline" size="sm" onClick={() => setShowAlert(true)}>
                Show Alert Again
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* 2. Confirmation Dialogs */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">2. Confirmation Dialog</h2>
          <p className="text-sm text-neutral-600">
            Modal dialogs for destructive and important actions
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={() => setShowConfirmDialog(true)}>
              Show Default Dialog
            </Button>
            <Button variant="destructive" onClick={() => setShowDestructiveDialog(true)}>
              Show Destructive Dialog
            </Button>
          </div>

          <ConfirmationDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
            variant="default"
            title="Confirm Action"
            description="Are you sure you want to proceed with this action?"
            confirmLabel="Proceed"
            onConfirm={handleConfirmAction}
          />

          <ConfirmationDialog
            open={showDestructiveDialog}
            onOpenChange={setShowDestructiveDialog}
            variant="destructive"
            title="Delete Material?"
            description="This will permanently remove the material from the catalog. This action cannot be undone."
            confirmLabel="Delete Material"
            onConfirm={handleDeleteAction}
          />
        </Card>
      </section>

      {/* 3. Empty States */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">3. Empty State</h2>
          <p className="text-sm text-neutral-600">
            Placeholder for empty tables, lists, and content areas
          </p>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-lg">
              <EmptyState
                icon={Package}
                title="No materials found"
                description="Try adjusting your filters or add a new material to get started."
              />
            </div>

            <div className="border border-neutral-200 rounded-lg">
              <EmptyState
                icon={Users}
                title="No vendors yet"
                description="Start by adding your first vendor to the platform."
                action={{
                  label: 'Add Vendor',
                  onClick: () => toast.info('Opening vendor form...'),
                }}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* 4. Error States */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">4. Error State</h2>
          <p className="text-sm text-neutral-600">
            Display for failed data loading, API errors, and system issues
          </p>
        </div>

        <Card className="p-6">
          <div className="border border-neutral-200 rounded-lg">
            <ErrorState
              title="Failed to load vendors"
              description="We couldn't fetch the vendor list. Please check your connection and try again."
              error="Network request failed: ERR_CONNECTION_REFUSED"
              showDetails={true}
              onRetry={() => toast.info('Retrying...')}
              onGoHome={() => toast.info('Navigating home...')}
            />
          </div>
        </Card>
      </section>

      {/* 5. Status Indicators */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">5. Status Indicators</h2>
          <p className="text-sm text-neutral-600">
            Status badges and dots for live indicators
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Status Badges</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusIndicator type="success" label="Active" />
              <StatusIndicator type="available" label="Available Now" />
              <StatusIndicator type="warning" label="Pending Approval" />
              <StatusIndicator type="error" label="Failed" />
              <StatusIndicator type="info" label="Processing" />
              <StatusIndicator type="neutral" label="Inactive" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">With Icons</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusIndicator type="success" label="Completed" icon={CheckCircle2} />
              <StatusIndicator type="warning" label="Pending" icon={Clock} />
              <StatusIndicator type="error" label="Critical" icon={AlertTriangle} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Sizes</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusIndicator type="success" label="Small" size="sm" />
              <StatusIndicator type="success" label="Medium" size="md" />
              <StatusIndicator type="success" label="Large" size="lg" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Live Status Dots</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <StatusDot type="success" pulse />
                <span className="text-sm text-neutral-600">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot type="available" pulse size="md" />
                <span className="text-sm text-neutral-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot type="warning" />
                <span className="text-sm text-neutral-600">Away</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot type="neutral" />
                <span className="text-sm text-neutral-600">Offline</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. Loading States */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">6. Loading States</h2>
          <p className="text-sm text-neutral-600">
            Loading spinners, skeletons, and full-screen loaders
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Loading Component</h3>
            <div className="border border-neutral-200 rounded-lg">
              <LoadingState message="Loading materials..." size="md" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Button Loading States</h3>
            <div className="flex items-center gap-3">
              <Button onClick={simulateLoading} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button variant="outline" disabled>
                <Spinner size="sm" className="mr-2" />
                Processing
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Skeleton Loaders</h3>
            <div className="space-y-3">
              <Skeleton width="w-full" height="h-12" />
              <Skeleton width="w-full" height="h-12" />
              <Skeleton width="w-3/4" height="h-12" />
            </div>
          </div>
        </Card>
      </section>

      {/* 7. Toast Notifications */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">7. Toast Notifications</h2>
          <p className="text-sm text-neutral-600">
            Global, temporary notifications using Sonner
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={() => toast.success('Operation completed successfully')}>
              Success Toast
            </Button>
            <Button variant="outline" onClick={() => toast.error('Failed to save changes')}>
              Error Toast
            </Button>
            <Button variant="outline" onClick={() => toast.warning('Low stock alert')}>
              Warning Toast
            </Button>
            <Button variant="outline" onClick={() => toast.info('New order received')}>
              Info Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.success('Order created', {
                  action: {
                    label: 'View',
                    onClick: () => toast.info('Viewing order...'),
                  },
                })
              }
            >
              Toast with Action
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}