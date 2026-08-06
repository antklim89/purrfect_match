import { userMessengers } from '@purrfect_match/shared/entities/auth/config';
import { Trash2Icon } from 'lucide-react';

import { useTypedAppFormContext } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldLabel, FieldSet } from '@/shared/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { userInfoUpdateFormOptions } from '../models/form-options';

export function UserInfoUpdateForm() {
  const form = useTypedAppFormContext(userInfoUpdateFormOptions);

  return (
    <form.Form>
      <form.AppField name="fullName">
        {field => (
          <field.FormInput
            autoComplete="family-name"
            placeholder="Enter your full name"
            label="Full Name"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
      <form.AppField name="address">
        {field => (
          <field.FormInput
            autoComplete="shipping street-address"
            placeholder="Enter your address"
            label="Address"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
      <form.AppField name="description">
        {field => (
          <field.FormTextarea
            placeholder="Enter something about you"
            label="Description"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>

      <form.AppField name="messengers" mode="array">
        {field => (
          <FieldSet className="flex flex-col gap-2">
            <FieldLabel htmlFor={field.form.formId + (field.state.value.length - 1)}>
              Phone or Messenger Numbers
            </FieldLabel>

            {field.state.value.map((_, index) => (
              <Field key={index}>
                <InputGroup>
                  <form.AppField name={`messengers[${index}].number`}>
                    {subfield => (
                      <InputGroupInput
                        id={field.form.formId + index}
                        value={subfield.state.value}
                        onChange={e => subfield.handleChange(e.target.value)}
                      />
                    )}
                  </form.AppField>
                  <InputGroupAddon align="inline-start">
                    <form.AppField name={`messengers[${index}].messenger`}>
                      {subfield => (
                        <Select
                          onValueChange={v => subfield.handleChange(v || userMessengers[0].value)}
                          items={userMessengers}
                          value={subfield.state.value || userMessengers[0].value}
                        >
                          <SelectTrigger className="-ml-1 ">
                            <SelectValue placeholder="Messenger" />
                          </SelectTrigger>
                          <SelectContent alignItemWithTrigger>
                            <SelectGroup>
                              {userMessengers.map(messenger => (
                                <SelectItem key={messenger.value} value={messenger.value}>
                                  {messenger.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </form.AppField>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => field.removeValue(index)}>
                      <span className="sr-only">Remove Phone Number</span> <Trash2Icon />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <form.AppField name={`messengers[${index}].number`}>
                  {subfield => <FieldError errors={subfield.state.meta.errors} />}
                </form.AppField>
              </Field>
            ))}

            <FieldError errors={field.state.meta.errors} />
            <Button variant="outline" onClick={() => field.pushValue({ messenger: 'phone', number: '' })}>
              Add Phone Number
            </Button>
          </FieldSet>
        )}
      </form.AppField>
    </form.Form>
  );
}
