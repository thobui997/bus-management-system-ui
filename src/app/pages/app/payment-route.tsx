import { usePayments } from '@app/features/payment/api/get-payments.api';
import PaymentFilter from '@app/features/payment/components/payment-filter';
import PaymentFormModal from '@app/features/payment/components/payment-form-modal';
import PaymentList from '@app/features/payment/components/payment-list';
import { useCreatePaymentForm } from '@app/features/payment/hooks/use-create-payment-form';
import { PaymentMethod, PaymentStatus } from '@app/features/payment/types/payment.type';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const PaymentRoute = () => {
  const [open, setOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const { handleSubmit, form } = useCreatePaymentForm(setOpen);
  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const paymentsQuery = usePayments({
    params: {
      search: tableState.search,
      page: tableState.page,
      pageSize: tableState.pageSize,
      status: paymentStatus,
      payment_method: paymentMethod,
      date_from: dateRange?.[0],
      date_to: dateRange?.[1]
    }
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    if (pageSize !== tableState.pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <PageTitle title='Payment Management' subTitle='Manage payments and transactions' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Payment
        </Button>
      </div>

      <BoxLayout className='flex flex-col gap-6'>
        <div className='flex items-center justify-between gap-4'>
          <SearchInput placeholder='Search payments...' handleSearch={(e) => handleSearch(e.target.value)} />
          <PaymentFilter
            onStatusChange={setPaymentStatus}
            onMethodChange={setPaymentMethod}
            onDateRangeChange={setDateRange}
          />
        </div>
        <PaymentList paymentsQuery={paymentsQuery} onPaginationChange={handlePaginationChange} />
      </BoxLayout>

      {open && <PaymentFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}
    </Container>
  );
};

export default PaymentRoute;
