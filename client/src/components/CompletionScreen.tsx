import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Plus, Home } from "lucide-react";
import type { ReminderFormData } from './CreateReminderForm';

interface CompletionScreenProps {
  reminderData: ReminderFormData;
  onCreateAnother: () => void;
  onGoHome: () => void;
}

export default function CompletionScreen({ reminderData, onCreateAnother, onGoHome }: CompletionScreenProps) {
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

  const getSeniorName = (seniorId: string) => {
    const seniorMap = {
      'senior-1': 'Grandma Dorothy',
      'senior-2': 'Grandpa Harold',
      'senior-3': 'Aunt Margaret'
    };
    return seniorMap[seniorId as keyof typeof seniorMap] || 'Unknown Senior';
  };

  const handleCreateAnother = () => {
    console.log('Creating another reminder');
    onCreateAnother();
  };

  const handleGoHome = () => {
    console.log('Going to home');
    onGoHome();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-semibold text-green-600 dark:text-green-400">
            Reminder Created Successfully!
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Your reminder has been saved and scheduled. The senior will receive the reminder as configured.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Confirmation Details */}
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Reminder Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 dark:text-green-300">Title:</span>
                  <span className="font-medium text-green-800 dark:text-green-200" data-testid="text-confirmation-title">
                    {reminderData.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 dark:text-green-300">For:</span>
                  <Badge variant="secondary" className="text-green-800 dark:text-green-200" data-testid="badge-confirmation-senior">
                    {getSeniorName(reminderData.seniorId)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 dark:text-green-300">Scheduled:</span>
                  <span className="font-medium text-green-800 dark:text-green-200" data-testid="text-confirmation-schedule">
                    {formatDate(reminderData.date)} at {formatTime(reminderData.time)}
                  </span>
                </div>
                {reminderData.recurrence !== 'none' && (
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 dark:text-green-300">Repeats:</span>
                    <span className="font-medium text-green-800 dark:text-green-200" data-testid="text-confirmation-recurrence">
                      {reminderData.recurrence.charAt(0).toUpperCase() + reminderData.recurrence.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Email Notification Status */}
            {(reminderData.emailNotifications || reminderData.completionAlerts) && (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Email Notifications</h3>
                <div className="space-y-2 text-sm">
                  {reminderData.emailNotifications && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-700 dark:text-blue-300">Email reminders will be sent to the senior</span>
                    </div>
                  )}
                  {reminderData.completionAlerts && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-700 dark:text-blue-300">
                        Completion alerts will be sent
                        {reminderData.customNotificationEmail && (
                          <span className="font-mono ml-1">({reminderData.customNotificationEmail})</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="space-y-3">
              <h3 className="font-medium text-muted-foreground">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>The reminder will be automatically delivered at the scheduled time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Email notifications will be sent if enabled</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>You'll receive completion alerts when the senior acknowledges the reminder</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleGoHome}
                data-testid="button-go-home"
                className="flex-1 h-12 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
              <Button
                onClick={handleCreateAnother}
                data-testid="button-create-another"
                className="flex-1 h-12 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Another Reminder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}