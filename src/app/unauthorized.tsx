import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
export default async function Unauthorized() {
  const locale = await getLocale();
  redirect("/" + locale + "/signin");
}
