'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  Archive,
  CheckCircle,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Loader,
  Music,
  Trash2,
  UploadCloud,
  Video,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface FileWithPreview {
  id: string;
  preview?: string;
  progress: number;
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  file?: File;
  status: 'uploading' | 'completed' | 'error';
}

const fileUploadVariants = cva(
  'group relative w-full rounded-card border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-border bg-card hover:border-primary/30 focus-visible:ring-ring',
        dashed:
          'border-border border-dashed bg-background hover:border-primary/50 hover:bg-accent focus-visible:ring-ring',
        ghost:
          'border-transparent bg-accent/50 hover:bg-accent focus-visible:ring-ring',
      },
      size: {
        sm: 'min-h-[120px] p-4',
        default: 'min-h-[160px] p-6',
        lg: 'min-h-[200px] p-8',
      },
      state: {
        idle: '',
        dragging: 'scale-[1.02] border-primary bg-primary/5',
        disabled: 'pointer-events-none opacity-50',
      },
    },
    defaultVariants: {
      variant: 'dashed',
      size: 'default',
      state: 'idle',
    },
  }
);

const fileItemVariants = cva(
  'flex items-start gap-3 rounded-ele p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border border-border bg-card',
        ghost: 'bg-accent hover:bg-accent/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof fileUploadVariants> {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  onFilesChange?: (files: FileWithPreview[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  showPreview?: boolean;
  itemVariant?: 'default' | 'ghost';
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      variant,
      size,
      state,
      accept = 'image/*,application/pdf,video/*,audio/*,text/*,application/zip',
      multiple = true,
      maxFiles = 10,
      maxSize = 10 * 1024 * 1024, // 10MB
      disabled = false,
      onFilesChange,
      onUpload,
      showPreview = true,
      itemVariant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) return ImageIcon;
      if (type.startsWith('video/')) return Video;
      if (type.startsWith('audio/')) return Music;
      if (type.includes('pdf') || type.includes('document')) return FileText;
      if (type.includes('zip') || type.includes('archive')) return Archive;
      return FileIcon;
    };

    const formatFileSize = (bytes: number): string => {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
    };

    const validateFile = (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`;
      }
      return null;
    };

    const handleFiles = async (fileList: FileList) => {
      if (disabled) return;

      const newFiles = Array.from(fileList)
        .slice(0, maxFiles - files.length)
        .map((file) => {
          const error = validateFile(file);
          return {
            id: `${Date.now()}-${Math.random()}`,
            preview: file.type.startsWith('image/')
              ? URL.createObjectURL(file)
              : undefined,
            progress: 0,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            file,
            status: error ? ('error' as const) : ('uploading' as const),
          };
        });

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);

      // Simulate upload or call actual upload
      if (onUpload) {
        const validFiles = newFiles
          .filter((f) => f.status === 'uploading')
          .map((f) => f.file!);
        try {
          await onUpload(validFiles);
          setFiles((prev) =>
            prev.map((f) =>
              newFiles.find((nf) => nf.id === f.id)
                ? { ...f, status: 'completed' as const, progress: 100 }
                : f
            )
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) =>
              newFiles.find((nf) => nf.id === f.id)
                ? { ...f, status: 'error' as const }
                : f
            )
          );
        }
      } else {
        // Simulate upload progress
        newFiles.forEach((fileItem) => {
          if (fileItem.status === 'uploading') {
            simulateUpload(fileItem.id);
          }
        });
      }
    };

    const simulateUpload = (id: string) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, status: 'completed' as const } : f
            )
          );
        }
      }, 200);
    };

    const removeFile = (id: string) => {
      const updatedFiles = files.filter((f) => f.id !== id);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    };

    const clearAll = () => {
      setFiles([]);
      onFilesChange?.([]);
    };

    const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    };

    const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    };

    const openFileDialog = () => {
      if (!disabled) inputRef.current?.click();
    };

    return (
      <div className="flex w-full flex-col gap-4" ref={ref} {...props}>
        {/* Drop Zone */}
        <div
          aria-label="Upload files"
          className={cn(
            fileUploadVariants({
              variant,
              size,
              state: disabled ? 'disabled' : isDragging ? 'dragging' : 'idle',
            }),
            'cursor-pointer',
            className
          )}
          onClick={openFileDialog}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openFileDialog();
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          <div className="flex flex flex-col flex-col items-center justify-center gap-3 text-center">
            <motion.div
              animate={{
                y: isDragging ? [-2, 0, -2] : 0,
                scale: isDragging ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: isDragging ? Number.POSITIVE_INFINITY : 0,
                ease: 'easeInOut',
              }}
            >
              <UploadCloud
                className={cn(
                  'h-12 w-12 transition-colors',
                  isDragging
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
            </motion.div>

            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-foreground text-lg">
                {isDragging
                  ? 'Drop files here'
                  : files.length
                    ? 'Add more files'
                    : 'Upload files'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isDragging ? (
                  <span className="font-medium text-primary">
                    Release to upload
                  </span>
                ) : (
                  <>
                    Drag and drop files here, or{' '}
                    <span className="font-medium text-primary">browse</span>
                  </>
                )}
              </p>
              <p className="text-muted-foreground text-xs">
                Max {maxFiles} files, up to {formatFileSize(maxSize)} each
              </p>
            </div>

            {children}
          </div>

          <input
            accept={accept}
            aria-describedby="file-upload-description"
            className="sr-only"
            disabled={disabled}
            multiple={multiple}
            onChange={onSelect}
            ref={inputRef}
            type="file"
          />
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground text-sm">
                Files ({files.length})
              </h4>
              {files.length > 1 && (
                <button
                  className="text-muted-foreground text-xs transition-colors hover:text-destructive"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              )}{' '}
            </div>

            <div className="flex flex-col gap-2">
              <AnimatePresence>
                <ScrollArea
                  className={cn(
                    'w-full rounded-ele',
                    files.length > 3 ? 'h-64' : 'h-auto'
                  )}
                >
                  <div className="flex flex-col gap-2 pr-3">
                    {files.map((file) => {
                      const IconComponent = getFileIcon(file.type);
                      return (
                        <motion.div
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            fileItemVariants({ variant: itemVariant })
                          )}
                          exit={{ opacity: 0, y: -20 }}
                          initial={{ opacity: 0, y: 20 }}
                          key={file.id}
                        >
                          {/* File Icon/Preview */}
                          <div className="relative flex-shrink-0">
                            {showPreview && file.preview ? (
                              <img
                                alt={file.name}
                                className="h-10 w-10 rounded-ele border border-border object-cover"
                                src={file.preview}
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-ele bg-accent">
                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            {file.status === 'completed' && (
                              <div className="-top-1 -right-1 absolute">
                                <CheckCircle className="h-4 w-4 rounded-card bg-background text-primary" />
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate font-medium text-foreground text-sm">
                                {file.name}
                              </p>
                              <button
                                aria-label={`Remove ${file.name}`}
                                className="flex-shrink-0 rounded-ele p-1 transition-colors hover:bg-accent"
                                onClick={() => removeFile(file.id)}
                              >
                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <p className="text-muted-foreground text-xs">
                                {formatFileSize(file.size)}
                              </p>
                              <div className="flex items-center gap-2">
                                {file.status === 'uploading' && (
                                  <>
                                    <span className="text-muted-foreground text-xs">
                                      {Math.round(file.progress)}%
                                    </span>
                                    <Loader className="h-3 w-3 animate-spin text-primary" />
                                  </>
                                )}
                                {file.status === 'completed' && (
                                  <Badge size="sm" variant="secondary">
                                    Uploaded
                                  </Badge>
                                )}
                                {file.status === 'error' && (
                                  <Badge size="sm" variant="destructive">
                                    Error
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {file.status === 'uploading' && (
                              <div className="h-1.5 w-full overflow-hidden rounded-card bg-accent">
                                <motion.div
                                  animate={{ width: `${file.progress}%` }}
                                  className="h-full rounded-card bg-primary"
                                  initial={{ width: 0 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload, fileUploadVariants };
export type { FileWithPreview };
