import { type ChangeEvent, type ComponentProps, useRef } from 'react';
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

export function FileUpload({
  placeholder,
  onFilesChange,
  onFileRemove,
  files,
  ...props
}: ComponentProps<'input'> & {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (file: File, index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    onFilesChange([...files, ...newFiles]);
    e.target.value = '';
  }

  function handleFileRemove(file: File, index: number) {
    return () => onFileRemove(file, index);
  }

  return (
    <div className="flex flex-1 flex-col gap-0.5 leading-snug border rounded-lg">
      <Button className="-m-0.25" onClick={() => inputRef.current?.click()} variant="outline">
        {placeholder}
      </Button>

      <div className="grid grid-col-1 md:grid-cols-2 p-2 gap-2">
        {files.length === 0 && (
          <Empty className="col-span-2">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>No Images</EmptyTitle>
              <EmptyDescription>Add at least one image.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {files.map((file, index) => (
          <Attachment className="w-full" key={file.name}>
            <AttachmentMedia variant="icon">
              <Image
                src={URL.createObjectURL(file)}
                alt="uploaded image"
                className="w-8 aspect-square object-cover"
                width={64}
                height={64}
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{file.name}</AttachmentTitle>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove uploaded image" onClick={handleFileRemove(file, index)}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </div>
      <Input {...props} ref={inputRef} className="hidden" type="file" onChange={handleFileChange} {...props} />
    </div>
  );
}
