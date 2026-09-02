import { contacts } from '@purrfect_match/shared/entities/contact/constants';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { deleteImageDraftAd, uploadImageDraftAd } from '@/shared/api/ads';
import { useTypedAppFormContext } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/ui/field';
import { FileUpload, type FileUploadFileType } from '@/shared/ui/file-upload';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui/input-group';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateForm() {
  const form = useTypedAppFormContext(adCreateFormOptions);

  async function handleImageUpload(image: File) {
    const { data: uploadedImage, error } = await uploadImageDraftAd({ image });
    if (!error) return uploadedImage;
    toast.error(error.message);
  }
  async function handleImageRemove(image: FileUploadFileType) {
    const { error } = await deleteImageDraftAd({ adId: image.id });
    if (!error) return;
    toast.error(error.message);
  }

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
        {field => (
          <Field>
            <FieldLabel htmlFor={field.name + field.form.formId}>Upload Images</FieldLabel>
            <FileUpload
              id={field.name + field.form.formId}
              onFileRemove={async (image, index) => {
                await handleImageRemove(image);
                field.removeValue(index);
              }}
              images={field.state.value}
              onFileChange={async image => {
                const uploadedImage = await handleImageUpload(image);
                if (uploadedImage) field.handleChange(prev => [...prev, uploadedImage]);
              }}
              placeholder="Upload images"
              accept="image/*"
              multiple
            />
            <FieldError errors={field.state.meta.errors}></FieldError>
          </Field>
        )}
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
                      {subfield => (
                        <subfield.FormSelect>
                          {contacts.map(contact => (
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
