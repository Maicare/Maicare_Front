import { FormProvider as Form, UseFormReturn } from 'react-hook-form';
import { Any } from '../types/types';

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<Any>;
  onSubmit?: VoidFunction;
};

const FormProvider = ({ children, onSubmit, methods }: Props) => {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
};

export default FormProvider;
