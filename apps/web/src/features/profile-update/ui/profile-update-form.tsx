import { profileContacts } from '@purrfect_match/shared/entities/profile/constants';
import { Trash2Icon } from 'lucide-react';

import { useTypedAppFormContext } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';
import { Field, FieldError } from '@/shared/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui/input-group';
import { profileUpdateFormOptions } from '../models/form-options';

export function ProfileUpdateForm() {
  const form = useTypedAppFormContext(profileUpdateFormOptions);

  return (
    <form.Form>
      <form.AppField name="fullName">
        {(field) => (
          <field.FormInput
            autoComplete="family-name"
            placeholder="Enter your full name"
            label="Full Name"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
      <form.AppField name="address">
        {(field) => (
          <field.FormInput
            autoComplete="shipping street-address"
            placeholder="Enter your address"
            label="Address"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
      <form.AppField name="description">
        {(field) => (
          <field.FormTextarea
            placeholder="Enter something about you"
            label="Description"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>

      <form.AppField name="contacts" mode="array">
        {(field) => (
          <field.FormArray label="Phone or Messenger Numbers">
            {field.state.value.map((_, index) => (
              <Field key={index}>
                <InputGroup>
                  <form.AppField name={`contacts[${index}].number`}>
                    {(subfield) => (
                      <InputGroupInput
                        id={field.form.formId + index}
                        value={subfield.state.value}
                        onChange={(e) => subfield.handleChange(e.target.value)}
                      />
                    )}
                  </form.AppField>
                  <InputGroupAddon align="inline-start">
                    <form.AppField name={`contacts[${index}].type`}>
                      {(subfield) => (
                        <subfield.FormSelect>
                          {profileContacts.map((contact) => (
                            <subfield.FormSelectItem value={contact.value} key={contact.value}>
                              {contact.label}
                            </subfield.FormSelectItem>
                          ))}
                        </subfield.FormSelect>
                      )}
                    </form.AppField>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => field.removeValue(index)}>
                      <span className="sr-only">Remove Phone Number</span> <Trash2Icon />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <form.AppField name={`contacts[${index}].number`}>
                  {(subfield) => <FieldError errors={subfield.state.meta.errors} />}
                </form.AppField>
              </Field>
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
