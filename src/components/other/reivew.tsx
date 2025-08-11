import { Star } from "lucide-react";
import { OptimizedImage } from "./optimized-image";

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
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-8 px-4 py-12 md:px-8 md:py-28">
        <div className="flex items-center gap-1">
          <Star fill="#eab308" size={20} stroke="none" />
          <Star fill="#eab308" size={20} stroke="none" />
          <Star fill="#eab308" size={20} stroke="none" />
          <Star fill="#eab308" size={20} stroke="none" />
          <Star fill="#eab308" size={20} stroke="none" />
        </div>
        <p className="text-center">{review}</p>
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
            <p className="text-muted-foreground text-sm">{role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
