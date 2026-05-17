import { HeaderActions } from "./HeaderActions";
import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="flex items-center justify-end gap-3">
      
      <HeaderActions />
    </div>
  );
}
