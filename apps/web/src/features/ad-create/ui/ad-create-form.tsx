import { useTypedAppFormContext } from '@/shared/lib/form';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateForm() {
  const form = useTypedAppFormContext(adCreateFormOptions);

  return (
    <form.Form>
      <form.AppField name="name">
        {field => <field.FormInput placeholder="Enter animal name" label="Name" errors={field.state.meta.errors} />}
      </form.AppField>
      <form.AppField name="type">
        {field => <field.FormInput placeholder="Enter animal type" label="Type" errors={field.state.meta.errors} />}
      </form.AppField>
      <form.AppField name="breed">
        {field => <field.FormInput placeholder="Enter animal breed" label="Breed" errors={field.state.meta.errors} />}
      </form.AppField>
      <form.AppField name="description">
        {field => (
          <field.FormTextarea placeholder="Enter description" label="Description" errors={field.state.meta.errors} />
        )}
      </form.AppField>
      <form.AppField name="price">
        {field => <field.FormNumberInput placeholder="Enter price" label="Price" errors={field.state.meta.errors} />}
      </form.AppField>
      <form.AppField name="images">
        {field => <field.FormFileInput accept="image/*" label="Upload Images" errors={field.state.meta.errors} />}
      </form.AppField>
    </form.Form>
  );
}
