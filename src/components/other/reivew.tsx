import { Star } from 'lucide-react';
import { OptimizedImage } from './optimized-image';

export default function Review({
  name,
  image,
  review,
  role,
}: {
  name: string;
  image: string;
  review: string;
  role?: string;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 p-4 md:p-8">
        <div className="flex items-center">
          <span className="font-medum text-4xl">"</span>
        </div>
        <p className="text-center tracking-loose md:text-xl md:leading-[46px]">
          {review}
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="overflow-ellipsis rounded-card">
            <OptimizedImage
              alt={name}
              className="rounded-card"
              height={45}
              src={image}
              width={45}
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <p>{name}</p>
            <p className="text-muted-foreground text-sm opacity-70">{role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
