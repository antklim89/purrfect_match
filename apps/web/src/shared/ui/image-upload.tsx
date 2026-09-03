import { type ChangeEvent, type ComponentProps, useRef, useState, useTransition } from 'react';
import { ImageIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from './attachment';
import { Button } from './button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty';
import { Input } from './input';
import { Spinner } from './spinner';

export interface UploadImageType {
  id: string;
  url: string;
  blurDataUrl?: string;
}

export function ImageUpload({
  placeholder,
  onImageChange,
  onImageRemove,
  images,
  maxImages,
  ...props
}: ComponentProps<'input'> & {
  maxImages: number;
  images: UploadImageType[];
  onImageChange: (images: File) => Promise<void>;
  onImageRemove: (image: UploadImageType, index: number) => void;
}) {
  const [uploadingImages, setUploadingImages] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return;

    if (e.target.files.length + images.length > maxImages) {
      toast.warning(`Too many images. Max allowed is ${maxImages}`);
    }
    const imagesToUpload = [...e.target.files].slice(0, maxImages - images.length);

    setUploadingImages(imagesToUpload);
    imagesToUpload.map(async (image) => {
      await onImageChange(image);
      setUploadingImages((prev) => prev.filter((i) => i.name !== image.name));
      return image;
    });

    e.target.value = '';
  }

  return (
    <div className="flex flex-1 flex-col gap-0.5 leading-snug border rounded-lg">
      <Button className="-m-0.25" onClick={() => inputRef.current?.click()} variant="outline">
        {placeholder} ({images.length}/{maxImages})
      </Button>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))] gap-2 p-2">
        {images.length === 0 && uploadingImages.length === 0 && <ImageUploadEmpty />}
        {images.map((image, index) => (
          <ImageUploadedAttachment image={image} index={index} onImageRemove={onImageRemove} key={image.id} />
        ))}
        {uploadingImages.map((image) => (
          <ImageUploadingAttachment image={image} key={image.name} />
        ))}
      </div>
      <Input {...props} ref={inputRef} className="hidden" type="file" onChange={handleImageChange} {...props} />
    </div>
  );
}

function ImageUploadEmpty() {
  return (
    <Empty className="col-span-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImageIcon />
        </EmptyMedia>
        <EmptyTitle>No Images</EmptyTitle>
        <EmptyDescription>Add at least one image.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ImageUploadedAttachment({
  image,
  index,
  onImageRemove,
}: {
  image: UploadImageType;
  index: number;
  onImageRemove: (image: UploadImageType, index: number) => void;
}) {
  const [isRemoving, startRemoving] = useTransition();

  function handleImageRemove() {
    startRemoving(() => onImageRemove(image, index));
  }

  return (
    <Attachment state="done" className="w-full" key={image.id}>
      {isRemoving ? (
        <AttachmentMedia variant="icon">
          <Spinner />
        </AttachmentMedia>
      ) : (
        <AttachmentMedia variant="image">
          <Image
            placeholder={image.blurDataUrl ? 'blur' : 'empty'}
            src={image.url}
            blurDataURL={image.blurDataUrl}
            alt="uploaded image"
            className="w-8 aspect-square object-cover"
            width={64}
            height={64}
          />
        </AttachmentMedia>
      )}

      <AttachmentContent>
        <AttachmentTitle>{isRemoving ? 'Image removing' : 'Image uploaded'}</AttachmentTitle>
      </AttachmentContent>
      <AttachmentActions>
        {!isRemoving && (
          <AttachmentAction aria-label="Remove uploaded image" onClick={handleImageRemove}>
            <XIcon />
          </AttachmentAction>
        )}
      </AttachmentActions>
    </Attachment>
  );
}

function ImageUploadingAttachment({ image }: { image: File }) {
  return (
    <Attachment state="processing" className="w-full" key={image.name}>
      <AttachmentMedia variant="icon">
        <Spinner />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Image uploading...</AttachmentTitle>
      </AttachmentContent>
    </Attachment>
  );
}
