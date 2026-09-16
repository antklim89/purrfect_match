import { createFormHook } from '@tanstack/react-form';

import {
  Form,
  FormArray,
  FormInput,
  FormInputNumber,
  FormSelect,
  FormSelectItem,
  FormSubmitButton,
  FormTextarea,
  fieldContext,
  formContext,
} from '@/shared/ui/form';

export const { useAppForm, withForm, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormInput,
    FormInputNumber,
    FormTextarea,
    FormArray,
    FormSelect,
    FormSelectItem,
  },
  formComponents: {
    Form,
    FormSubmitButton,
  },
});
