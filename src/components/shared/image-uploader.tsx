import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUploader({ 
  onImageSelect, 
  selectedImage, 
  onClear,
  disabled = false 
}: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
            "hover:border-primary hover:bg-accent/50",
            isDragActive && "border-primary bg-accent/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">
                {isDragActive ? "Déposez l'image ici" : "Glissez une image ou cliquez"}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, JPEG, GIF ou WEBP (max. 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-border rounded-lg overflow-hidden">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="w-full h-auto max-h-[400px] object-contain bg-muted"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="destructive"
              onClick={onClear}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3 border-t">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{selectedImage.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {(selectedImage.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
