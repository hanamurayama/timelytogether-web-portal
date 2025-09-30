import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, CheckCircle, Edit, ArrowLeft } from "lucide-react";
import type { ReminderFormData } from './CreateReminderForm';

interface ReviewReminderProps {
  reminderData: ReminderFormData;
  onSave: () => void;
  onEdit: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export default function ReviewReminder({ reminderData, onSave, onEdit, onCancel, isSaving = false }: ReviewReminderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRecurrenceDisplay = (recurrence: string) => {
    const recurrenceMap = {
      'none': 'One time only',
      'daily': 'Daily',
      'weekly': 'Weekly',
      'monthly': 'Monthly'
    };
    return recurrenceMap[recurrence as keyof typeof recurrenceMap] || recurrence;
  };


  const handleSave = () => {
    console.log('Saving reminder:', reminderData);
    onSave();
  };

  const handleEdit = () => {
    console.log('Editing reminder');
    onEdit();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader className="pb-6">
          {onCancel && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              data-testid="link-back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#d9825b]" />
            Review Reminder
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Click Save Reminder to confirm and schedule the reminder.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Reminder Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium">Reminder Details</h3>
                <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Title</div>
                    <div className="text-base font-medium" data-testid="text-title">
                      {reminderData.title}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Message</div>
                    <div className="text-base" data-testid="text-message">
                      {reminderData.message}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#d9825b]" />
                  Schedule
                </h3>
                <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div className="text-base font-medium" data-testid="text-date">
                          {formatDate(reminderData.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Time</div>
                        <div className="text-base font-medium" data-testid="text-time">
                          {formatTime(reminderData.time)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Repeat Pattern</div>
                    <Badge 
                      variant={reminderData.recurrence === 'none' ? 'outline' : 'default'}
                      data-testid="badge-recurrence"
                    >
                      {getRecurrenceDisplay(reminderData.recurrence)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Email Settings */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#d9825b]" />
                  Email Notifications
                </h3>
                <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base">Completion alerts</span>
                    <Badge 
                      variant={reminderData.completionAlerts ? 'default' : 'outline'}
                      data-testid="badge-completion-alerts"
                    >
                      {reminderData.completionAlerts ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  
                  {reminderData.completionAlerts && reminderData.customNotificationEmail && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Custom notification email</div>
                      <div className="text-base font-mono text-sm" data-testid="text-custom-email">
                        {reminderData.customNotificationEmail}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleEdit}
                data-testid="button-edit"
                disabled={isSaving}
                className="flex-1 h-12 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={handleSave}
                data-testid="button-save"
                disabled={isSaving}
                className="flex-1 h-12 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Reminder'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}