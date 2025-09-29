import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Mail } from "lucide-react";

export interface ReminderFormData {
  title: string;
  message: string;
  date: string;
  time: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  completionAlerts: boolean;
  customNotificationEmail: string;
}

interface CreateReminderFormProps {
  onSubmit: (data: ReminderFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ReminderFormData>;
}

export default function CreateReminderForm({ onSubmit, onCancel, initialData }: CreateReminderFormProps) {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: initialData?.title || '',
    message: initialData?.message || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    recurrence: initialData?.recurrence || 'none',
    completionAlerts: initialData?.completionAlerts || false,
    customNotificationEmail: initialData?.customNotificationEmail || '',
  });

  const [titleLength, setTitleLength] = useState(formData.title.length);
  const [messageLength, setMessageLength] = useState(formData.message.length);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    onSubmit(formData);
  };

  const updateField = (field: keyof ReminderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'title') {
      setTitleLength(value.length);
    } else if (field === 'message') {
      setMessageLength(value.length);
    }
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.message.trim() && 
           formData.date && 
           formData.time && 
           titleLength <= 40 &&
           messageLength <= 120;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Create New Reminder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Reminder Title
                </Label>
                <div className="relative">
                  <Input
                    id="title"
                    data-testid="input-title"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Take morning medication"
                    maxLength={40}
                    className="text-base h-12"
                  />
                  <div className={`text-sm mt-1 ${titleLength > 35 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {titleLength}/40 characters
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-medium">
                  Reminder Message
                </Label>
                <div className="relative">
                  <Textarea
                    id="message"
                    data-testid="input-message"
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Remember to take your blood pressure medication with water after breakfast."
                    maxLength={120}
                    rows={3}
                    className="text-base resize-none"
                  />
                  <div className={`text-sm mt-1 ${messageLength > 110 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {messageLength}/120 characters
                  </div>
                </div>
              </div>

            </div>

            {/* Scheduling */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Schedule Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-medium">
                    Date
                  </Label>
                  <Input
                    id="date"
                    data-testid="input-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="text-base h-12"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-base font-medium">
                    Time
                  </Label>
                  <Input
                    id="time"
                    data-testid="input-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField('time', e.target.value)}
                    className="text-base h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrence" className="text-base font-medium">
                  Repeat Pattern
                </Label>
                <Select value={formData.recurrence} onValueChange={(value: any) => updateField('recurrence', value)}>
                  <SelectTrigger data-testid="select-recurrence" className="h-12">
                    <SelectValue placeholder="Select repeat pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No repeat (one time)</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="completionAlerts"
                    data-testid="checkbox-completion-alerts"
                    checked={formData.completionAlerts}
                    onCheckedChange={(checked) => updateField('completionAlerts', checked)}
                  />
                  <Label htmlFor="completionAlerts" className="text-base cursor-pointer">
                    Send completion alerts
                  </Label>
                </div>

                {formData.completionAlerts && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="customEmail" className="text-base font-medium">
                      Custom notification email (optional)
                    </Label>
                    <Input
                      id="customEmail"
                      data-testid="input-custom-email"
                      type="email"
                      value={formData.customNotificationEmail}
                      onChange={(e) => updateField('customNotificationEmail', e.target.value)}
                      placeholder="family@example.com"
                      className="text-base h-12"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  data-testid="button-cancel"
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={!isFormValid()}
                data-testid="button-submit"
                className="flex-1 h-12"
              >
                Continue to Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}