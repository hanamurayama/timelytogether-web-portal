import ReviewReminder from '../ReviewReminder';
import type { ReminderFormData } from '../CreateReminderForm';

export default function ReviewReminderExample() {
  // todo: remove mock functionality
  const mockReminderData: ReminderFormData = {
    title: 'Take morning medication',
    message: 'Remember to take your blood pressure medication with water after breakfast.',
    date: '2025-01-15',
    time: '09:00',
    recurrence: 'daily',
    seniorId: 'senior-1',
    emailNotifications: true,
    completionAlerts: true,
    customNotificationEmail: 'family@example.com'
  };

  const handleSave = () => {
    console.log('Example save clicked');
    alert('Reminder saved successfully!');
  };

  const handleEdit = () => {
    console.log('Example edit clicked');
    alert('Returning to edit mode...');
  };

  const handleCancel = () => {
    console.log('Example cancel clicked');
  };

  return (
    <ReviewReminder 
      reminderData={mockReminderData}
      onSave={handleSave}
      onEdit={handleEdit}
      onCancel={handleCancel}
    />
  );
}