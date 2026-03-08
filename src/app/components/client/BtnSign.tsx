import Link from "next/link";

const BtnSignIn = () => {
  return (
    <Link href="/" className="hidden lg:block">
      <div className="text-white p-3 px-5 border-2 border-white rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-black transition-all duration-500">
        <div className="h-6 bg-white"></div>
        <p className="font-semibold text-[clamp(0.875rem,0.9vw,1.1rem)]">
          Sign In
        </p>
      </div>
    </Link>
  );
};

export default BtnSignIn;
