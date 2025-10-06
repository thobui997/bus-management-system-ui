import { useNotification } from '@app/context/notification-context';
import { useUpdateEmployee } from '@app/features/employee-management/api/update-employee.api';
import { Employee } from '@app/features/employee-management/types/employee.type';
import dayjs from '@app/lib/date-utils';
import { Form } from 'antd';

export const useUpdateEmployeeForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateEmployeeMutation = useUpdateEmployee({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Employee updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update employee');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updateEmployeeMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleSetFormValues = (values: Employee) => {
    setTimeout(() => {
      form.setFieldsValue({
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone_number,
        license_number: values.license_number,
        license_expiry: values.license_expiry ? dayjs(values.license_expiry) : null
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateEmployeeMutation.isPending,
    handleSetFormValues
  };
};
