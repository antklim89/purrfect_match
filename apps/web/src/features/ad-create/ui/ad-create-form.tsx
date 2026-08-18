import { contacts } from '@purrfect_match/shared/entities/contact/constants';
import { Trash2Icon } from 'lucide-react';

import { useTypedAppFormContext } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';
import { FieldContent, FieldError } from '@/shared/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui/input-group';
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

      <form.AppField name="contacts" mode="array">
        {field => (
          <field.FormArray label="Contacts">
            {field.state.value.map((_, index) => (
              <FieldContent key={index}>
                <InputGroup>
                  <form.AppField name={`contacts[${index}].number`}>
                    {subfield => (
                      <InputGroupInput
                        id={field.form.formId + index}
                        value={subfield.state.value}
                        onChange={e => subfield.handleChange(e.target.value)}
                      />
                    )}
                  </form.AppField>
                  <InputGroupAddon align="inline-start">
                    <form.AppField name={`contacts[${index}].type`}>
                      {subfield => <subfield.FormSelect items={contacts} />}
                    </form.AppField>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => field.removeValue(index)}>
                      <span className="sr-only">Remove Phone Number</span> <Trash2Icon />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <form.AppField name={`contacts[${index}].number`}>
                  {subfield => <FieldError errors={subfield.state.meta.errors} />}
                </form.AppField>
              </FieldContent>
            ))}

            <Button variant="outline" onClick={() => field.pushValue({ type: 'phone', number: '' })}>
              Add Contact
            </Button>
          </field.FormArray>
        )}
      </form.AppField>
    </form.Form>
  );
}
