import { usePathname } from "next/navigation";

export function useIsGoldPage() {
  const pathname = usePathname();
  return pathname === "/gold";
}
