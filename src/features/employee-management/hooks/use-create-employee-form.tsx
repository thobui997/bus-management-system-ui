import { useNotification } from '@app/context/notification-context';
import { useCreateEmployee } from '@app/features/employee-management/api/create-employee.api';
import { Form } from 'antd';

export const useCreateEmployeeForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createEmployeeMutation = useCreateEmployee({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Employee created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create employee');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createEmployeeMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createEmployeeMutation.isPending
  };
};
