// components/file-upload.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  accept?: string;
  onUpload: (file: File | undefined) => void;
  isUploading?: boolean;
}

export function FileUpload({ accept, onUpload, isUploading }: FileUploadProps) {
  const [file, setFile] = useState<File | undefined>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    onUpload(selectedFile);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="w-full">
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input px-3 py-6 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
          <UploadCloud className="h-5 w-5" />
          <span>{file ? file.name : 'Click to upload'}</span>
          <Input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </label>
      {file && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFile(undefined);
            onUpload(undefined);
          }}
          disabled={isUploading}
        >
          Remove
        </Button>
      )}
    </div>
  );
}