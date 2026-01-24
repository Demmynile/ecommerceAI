import { redirect } from "next/navigation";

interface AdminRedirectProps {
  params: {
    path?: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AdminRedirect({
  params,
  searchParams,
}: AdminRedirectProps) {
  const path = params.path?.join("/") || "";
  const queryString = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();

  const redirectUrl = `/admin-panel${path ? `/${path}` : ""}${
    queryString ? `?${queryString}` : ""
  }`;

  redirect(redirectUrl);
}
