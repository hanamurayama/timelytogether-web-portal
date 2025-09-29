import CreateReminderForm from '../CreateReminderForm';

export default function CreateReminderFormExample() {
  const handleSubmit = (data: any) => {
    console.log('Example form submitted:', data);
    alert('Form submitted! Check console for details.');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <CreateReminderForm 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}