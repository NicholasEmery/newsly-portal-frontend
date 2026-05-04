import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/components/client/providers/AuthProvider";

const BtnSignIn = () => {
  const headerT = useTranslations("header");
  const sidebarT = useTranslations("sidebar");
  const auth = useAuth();

  if (auth.isLoading) {
    return null;
  }

  return (
    <Link
      href={auth.isAuthenticated ? "/auth/account" : "/auth/account?mode=login"}
      className="hidden lg:block"
    >
      <div className="text-white p-3 px-5 border-2 border-white rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 hover:text-black transition-all duration-500">
        <p className="font-semibold text-[clamp(0.875rem,0.9vw,1.1rem)]">
          {auth.isAuthenticated ? sidebarT("profile") : headerT("signIn")}
        </p>
        {auth.isPremium && (
          <span className="rounded-full border border-white/40 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide">
            {sidebarT("premiumBadge")}
          </span>
        )}
      </div>
    </Link>
  );
};

export default BtnSignIn;
