import { Component, Section, Row } from "@/components/ui/components";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    return redirect("/home");
  }
  return (
    <>
      <Section full>
        <Row>
          <Component centered small padding>
            <h1 className="heading1">Some high end sh*t</h1>
            <p>Have fun window shopping mf, we know you can't afford sh*t</p>
            <div className="flex flex-row gap-4 items-center justify-center mt-2">
              <Link href="/signin" className="button-black">
                Sign up for free
              </Link>
              <Link href="/contact" className="button-white">
                See features
              </Link>
            </div>
          </Component>
        </Row>
      </Section>
    </>
  );
}
