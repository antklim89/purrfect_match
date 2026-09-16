import { MAX_IMAGES_PER_AD } from '@purrfect_match/shared/entities/ad/constants';
import { animalBreeds, animalTypes } from '@purrfect_match/shared/entities/animal/constants';
import type { AnimalTypes } from '@purrfect_match/shared/entities/animal/types';
import { toast } from 'sonner';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';
import { useTypedAppFormContext } from '@/shared/lib/form';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { ImageUpload, type UploadImageType } from '@/shared/ui/image-upload';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateForm() {
  const form = useTypedAppFormContext(adCreateFormOptions);

  async function handleImageUpload(image: File) {
    const result = await apiCall(apiSessionClient.api.ad['upload-image-draft'].$patch({ form: { image } }));
    if (result.error) toast.error(result.error.message);

    return result;
  }

  async function handleImageRemove(image: UploadImageType) {
    const result = await apiCall(
      apiSessionClient.api.ad[':id']['delete-image-draft'].$patch({ param: { id: image.id } }),
    );
    if (result.error) toast.error(result.error.message);
    return result;
  }

  return (
    <form.Form>
      <form.AppField name="name">
        {(field) => <field.FormInput placeholder="Enter animal name" label="Name" />}
      </form.AppField>
      <form.AppField name="type" listeners={{ onChange: ({ fieldApi }) => fieldApi.form.setFieldValue('breed', '') }}>
        {(field) => (
          <field.FormSelect className="capitalize" placeholder="Select animal type" label="Type">
            {animalTypes.map((animalType) => (
              <field.FormSelectItem className="capitalize" key={animalType} value={animalType}>
                {animalType}
              </field.FormSelectItem>
            ))}
          </field.FormSelect>
        )}
      </form.AppField>
      <form.AppField name="breed">
        {(field) => (
          <form.Subscribe
            selector={(state) =>
              typeof state.values.type === 'string' ? animalBreeds[state.values.type as AnimalTypes] : null
            }
          >
            {(selectedAnimalBreeds) =>
              selectedAnimalBreeds && (
                <field.FormSelect className="capitalize" placeholder="Select animal breed" label="Breed">
                  {selectedAnimalBreeds.map((animalType) => (
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
        {(field) => <field.FormTextarea placeholder="Enter description" label="Description" />}
      </form.AppField>
      <form.AppField name="price">
        {(field) => <field.FormInputNumber placeholder="Enter price" label="Price" />}
      </form.AppField>

      <form.AppField name="images">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name + field.form.formId}>Upload Images</FieldLabel>
            <ImageUpload
              maxImages={MAX_IMAGES_PER_AD}
              id={field.name + field.form.formId}
              onImageRemove={async (image, index) => {
                const { error } = await handleImageRemove(image);
                if (!error) field.removeValue(index);
              }}
              images={field.state.value}
              onImageChange={async (image) => {
                const { data: uploadedImage } = await handleImageUpload(image);
                if (uploadedImage) field.handleChange((prev) => [...prev, uploadedImage]);
              }}
              placeholder="Upload images"
              accept="image/*"
              multiple
            />
            <FieldError></FieldError>
          </Field>
        )}
      </form.AppField>
    </form.Form>
  );
}
