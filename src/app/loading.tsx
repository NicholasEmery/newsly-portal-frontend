import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner animado com logo centralizada */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-5 border-blue-500 border-t-transparent animate-spin"></div>
          <span className="flex items-center justify-center w-full h-full">
            <Image
              src="/images/logo-spinner.png"
              alt="Logo Newsly Portal"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
              priority
            />
          </span>
        </div>
      </div>
    </div>
  );
}
