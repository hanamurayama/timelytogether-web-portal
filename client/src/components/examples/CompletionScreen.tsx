import CompletionScreen from '../CompletionScreen';
import type { ReminderFormData } from '../CreateReminderForm';

export default function CompletionScreenExample() {
  // todo: remove mock functionality
  const mockReminderData: ReminderFormData = {
    title: 'Take morning medication',
    message: 'Remember to take your blood pressure medication with water after breakfast.',
    date: '2025-01-15',
    time: '09:00',
    recurrence: 'daily',
    completionAlerts: true,
    customNotificationEmail: 'family@example.com'
  };

  const handleCreateAnother = () => {
    console.log('Example create another clicked');
    alert('Creating another reminder...');
  };

  const handleGoHome = () => {
    console.log('Example go home clicked');
    alert('Going to dashboard...');
  };

  return (
    <CompletionScreen 
      reminderData={mockReminderData}
      onCreateAnother={handleCreateAnother}
      onGoHome={handleGoHome}
    />
  );
}