/**
 * Send Notification Modal
 * Modal for sending notifications to vendors
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../app/components/ui/dialog';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Textarea } from '../../../app/components/ui/textarea';
import { Label } from '../../../app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../app/components/ui/select';
import { Bell } from 'lucide-react';

interface SendNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorName: string;
  onSend: (notification: NotificationData) => void;
}

export interface NotificationData {
  type: 'info' | 'warning' | 'urgent';
  subject: string;
  message: string;
}

export function SendNotificationModal({
  open,
  onOpenChange,
  vendorName,
  onSend,
}: SendNotificationModalProps) {
  const [type, setType] = useState<NotificationData['type']>('info');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      return;
    }

    onSend({ type, subject, message });
    
    // Reset form
    setType('info');
    setSubject('');
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Send Notification to {vendorName}
          </DialogTitle>
          <DialogDescription>
            Send an in-app notification to this vendor. They will receive it immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Notification Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as NotificationData['type'])}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter notification subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-neutral-500">{message.length}/500 characters</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!subject.trim() || !message.trim()}>
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
