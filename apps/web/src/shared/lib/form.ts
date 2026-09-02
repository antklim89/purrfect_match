import {
  createFormHook,
  type FormOptions,
  formOptions,
  revalidateLogic,
  type StandardSchemaV1,
} from '@tanstack/react-form';

import {
  Form,
  FormArray,
  FormInput,
  FormNumberInput,
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
    FormTextarea,
    FormNumberInput,
    FormArray,
    FormSelect,
    FormSelectItem,
  },
  formComponents: {
    Form,
    FormSubmitButton,
  },
});

export function createFormOptions<
  TOptions extends Partial<
    FormOptions<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta
    >
  >,
  TFormData,
  TOnMount extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnChange extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnChangeAsync extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnBlur extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnBlurAsync extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnSubmit extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnSubmitAsync extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnDynamic extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnDynamicAsync extends undefined | StandardSchemaV1<TFormData, unknown>,
  TOnServer extends undefined | StandardSchemaV1<TFormData, unknown>,
  TSubmitMeta = never,
>({
  schema,
  ...defaultOpts
}: Partial<
  FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >
> &
  TOptions & { schema: StandardSchemaV1<TFormData, unknown> }) {
  return formOptions({
    validators: {
      onDynamic: schema,
      onSubmit: schema,
    },
    validationLogic: revalidateLogic(),
    onSubmitInvalid({ formApi }) {
      console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
    },
    ...defaultOpts,
  });
}
