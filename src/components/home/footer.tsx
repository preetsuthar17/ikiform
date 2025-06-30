"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="flex  justify-between max-w-6xl w-[95%] mx-auto py-10 text-sm font-inter flex-wrap gap-8 max-sm:text-center max-sm:items-center max-sm:justify-center max-sm:flex-col">
        <div className="max-w-[90px]">
          <Image
            src="/logo.svg"
            alt="Forms0"
            width={40}
            height={40}
            className="pointer-events-none rounded-ele"
          />
        </div>
      </footer>
    </>
  );
}
