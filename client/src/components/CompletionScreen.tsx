import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Home } from "lucide-react";
import type { ReminderFormData } from './CreateReminderForm';

interface CompletionScreenProps {
  reminderData: ReminderFormData;
  onCreateAnother: () => void;
  onGoHome: () => void;
}

export default function CompletionScreen({ reminderData, onCreateAnother, onGoHome }: CompletionScreenProps) {
  const handleGoHome = () => {
    console.log('Going to home');
    onGoHome();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-[#d9825b]/10 dark:bg-[#d9825b]/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#d9825b]" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-[#d9825b]">
            Reminder Created Successfully!
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Reminder created and sent to your TimelyTogether device.
          </p>
        </CardHeader>
        <CardContent>
          {/* Actions */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleGoHome}
              data-testid="button-go-home"
              className="w-full sm:w-auto min-w-[200px] h-12 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}