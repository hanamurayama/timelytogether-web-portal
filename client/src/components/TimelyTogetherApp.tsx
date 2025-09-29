import { useState } from "react";
import Header from './Header';
import CreateReminderForm from './CreateReminderForm';
import ReviewReminder from './ReviewReminder';
import CompletionScreen from './CompletionScreen';
import type { ReminderFormData } from './CreateReminderForm';

type AppState = 'create' | 'review' | 'complete';

export default function TimelyTogetherApp() {
  const [currentState, setCurrentState] = useState<AppState>('create');
  const [reminderData, setReminderData] = useState<ReminderFormData | null>(null);

  const handleFormSubmit = (data: ReminderFormData) => {
    console.log('Moving to review with data:', data);
    setReminderData(data);
    setCurrentState('review');
  };

  const handleReviewSave = () => {
    console.log('Saving reminder and moving to completion');
    setCurrentState('complete');
  };

  const handleReviewEdit = () => {
    console.log('Returning to create form for editing');
    setCurrentState('create');
  };

  const handleCreateAnother = () => {
    console.log('Creating new reminder');
    setReminderData(null);
    setCurrentState('create');
  };

  const handleGoHome = () => {
    console.log('Going to home/dashboard');
    setReminderData(null);
    setCurrentState('create');
  };

  const handleCancel = () => {
    console.log('Cancelling current operation');
    setReminderData(null);
    setCurrentState('create');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        {currentState === 'create' && (
          <CreateReminderForm
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            initialData={reminderData || undefined}
          />
        )}
        
        {currentState === 'review' && reminderData && (
          <ReviewReminder
            reminderData={reminderData}
            onSave={handleReviewSave}
            onEdit={handleReviewEdit}
            onCancel={handleCancel}
          />
        )}
        
        {currentState === 'complete' && reminderData && (
          <CompletionScreen
            reminderData={reminderData}
            onCreateAnother={handleCreateAnother}
            onGoHome={handleGoHome}
          />
        )}
      </main>
    </div>
  );
}