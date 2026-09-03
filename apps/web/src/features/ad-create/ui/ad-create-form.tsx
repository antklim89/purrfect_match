import { animalBreeds, animalTypes } from '@purrfect_match/shared/entities/animal/constants';
import type { AnimalTypes } from '@purrfect_match/shared/entities/animal/types';
import { toast } from 'sonner';

import { deleteImageDraftAd, uploadImageDraftAd } from '@/shared/api/ads';
import { useTypedAppFormContext } from '@/shared/lib/form';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { FileUpload, type FileUploadFileType } from '@/shared/ui/file-upload';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateForm() {
  const form = useTypedAppFormContext(adCreateFormOptions);

  async function handleImageUpload(image: File) {
    const result = await uploadImageDraftAd({ image });
    if (result.error) toast.error(result.error.message);
    return result;
  }

  async function handleImageRemove(image: FileUploadFileType) {
    const result = await deleteImageDraftAd({ adId: image.id });
    if (result.error) toast.error(result.error.message);
    return result;
  }

  return (
    <form.Form>
      <form.AppField name="name">
        {field => <field.FormInput placeholder="Enter animal name" label="Name" errors={field.state.meta.errors} />}
      </form.AppField>
      <form.AppField name="type" listeners={{ onChange: ({ fieldApi }) => fieldApi.form.setFieldValue('breed', '') }}>
        {field => (
          <field.FormSelect
            className="capitalize"
            placeholder="Select animal type"
            label="Type"
            errors={field.state.meta.errors}
          >
            {animalTypes.map(animalType => (
              <field.FormSelectItem className="capitalize" key={animalType} value={animalType}>
                {animalType}
              </field.FormSelectItem>
            ))}
          </field.FormSelect>
        )}
      </form.AppField>
      <form.AppField name="breed">
        {field => (
          <form.Subscribe
            selector={state =>
              typeof state.values.type === 'string' ? animalBreeds[state.values.type as AnimalTypes] : null
            }
          >
            {(selectedAnimalBreeds) =>
              selectedAnimalBreeds && (
                <field.FormSelect
                  className="capitalize"
                  placeholder="Select animal breed"
                  label="Breed"
                  errors={field.state.meta.errors}
                >
                  {selectedAnimalBreeds.map(animalType => (
                    <field.FormSelectItem className="capitalize" key={animalType} value={animalType}>
                      {animalType}
                    </field.FormSelectItem>
                  ))}
                </field.FormSelect>
              )
            }
          </form.Subscribe>
        )}
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
            <FieldLabel htmlFor={field.name + field.form.formId}>
              Upload Images ({field.state.value.length} / {20})
            </FieldLabel>
            <FileUpload
              id={field.name + field.form.formId}
              onFileRemove={async (image, index) => {
                const { error } = await handleImageRemove(image);
                if (!error) field.removeValue(index);
              }}
              images={field.state.value}
              onFileChange={async image => {
                const { data: uploadedImage } = await handleImageUpload(image);
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
    </form.Form>
  );
}
