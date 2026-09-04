import { SignInSchema, SignUpSchema } from '@purrfect_match/shared/entities/auth/schemas';
import { formOptions, revalidateLogic } from '@tanstack/react-form';

export const signInOptions = formOptions({
  validators: {
    onDynamic: SignInSchema,
  },
  defaultValues: {
    email: '',
    password: '',
  },
  validationLogic: revalidateLogic(),
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
  },
});

export const signUpOptions = formOptions({
  validators: {
    onDynamic: SignUpSchema,
  },
  defaultValues: {
    name: '',
    email: '',
    password: '',
    confirm: '',
  },
  validationLogic: revalidateLogic(),
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
  },
});
