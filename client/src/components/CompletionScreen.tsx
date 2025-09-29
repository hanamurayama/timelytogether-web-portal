import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Plus, Home } from "lucide-react";
import type { ReminderFormData } from './CreateReminderForm';

interface CompletionScreenProps {
  reminderData: ReminderFormData;
  onCreateAnother: () => void;
  onGoHome: () => void;
}

export default function CompletionScreen({ reminderData, onCreateAnother, onGoHome }: CompletionScreenProps) {

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
          {/* Actions */}
          <div className="flex gap-4 pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}