import { LogoBadge } from "./LogoBadge";
import { HeaderActions } from "./HeaderActions";

export function AuthHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <LogoBadge />
      <HeaderActions />
    </div>
  );
}
