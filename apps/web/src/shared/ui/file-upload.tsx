import { type ChangeEvent, type ComponentProps, useRef, useState, useTransition } from 'react';
import { ImageIcon, XIcon } from 'lucide-react';
import Image from 'next/image';

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

export interface FileUploadFileType {
  id: string;
  url: string;
  blurDataUrl?: string;
}

export function FileUpload({
  placeholder,
  onFileChange,
  onFileRemove,
  images,
  ...props
}: ComponentProps<'input'> & {
  images: FileUploadFileType[];
  onFileChange: (files: File) => Promise<void>;
  onFileRemove: (file: FileUploadFileType, index: number) => void;
}) {
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return;

    setUploadingFiles([...e.target.files]);
    Array.from(e.target.files, async file => {
      await onFileChange(file);
      setUploadingFiles(prev => prev.filter(i => i.name !== file.name));
      return file;
    });

    e.target.value = '';
  }

  return (
    <div className="flex flex-1 flex-col gap-0.5 leading-snug border rounded-lg">
      <Button className="-m-0.25" onClick={() => inputRef.current?.click()} variant="outline">
        {placeholder}
      </Button>

      <div className="grid grid-col-1 md:grid-cols-2 p-2 gap-2">
        {images.length === 0 && <FileUploadEmpty />}
        {images.map((file, index) => (
          <FileUploadedAttachment image={file} index={index} onFileRemove={onFileRemove} key={file.id} />
        ))}
        {uploadingFiles.map(file => (
          <FileUploadingAttachment file={file} key={file.name} />
        ))}
      </div>
      <Input {...props} ref={inputRef} className="hidden" type="file" onChange={handleFileChange} {...props} />
    </div>
  );
}

function FileUploadEmpty() {
  return (
    <Empty className="col-span-2">
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

function FileUploadedAttachment({
  image,
  index,
  onFileRemove,
}: {
  image: FileUploadFileType;
  index: number;
  onFileRemove: (file: FileUploadFileType, index: number) => void;
}) {
  const [isRemoving, startRemoving] = useTransition();
  function handleFileRemove() {
    startRemoving(() => onFileRemove(image, index));
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
          <AttachmentAction aria-label="Remove uploaded image" onClick={handleFileRemove}>
            <XIcon />
          </AttachmentAction>
        )}
      </AttachmentActions>
    </Attachment>
  );
}

function FileUploadingAttachment({ file }: { file: File }) {
  return (
    <Attachment state="processing" className="w-full" key={file.name}>
      <AttachmentMedia variant="icon">
        <Spinner />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Image uploading...</AttachmentTitle>
      </AttachmentContent>
    </Attachment>
  );
}
