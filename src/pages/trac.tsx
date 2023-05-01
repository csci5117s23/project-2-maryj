import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CardContainer from "@/components/CardContainer";
import Header from "@/components/Header";
import SignInPage from "./signin";

export default function Trac() {
  const { userId } = useAuth();
  const [filter, setFilter] = useState<string>("Home");
  const router = useRouter();

  useEffect(() => {
    if (router.query.filter && router.query.filter !== filter) {
      setFilter(router.query.filter as string);
    }
  }, [filter, router]);

  if (!userId) {
    return <SignInPage />;
  }

  return (
    <>
      <Header />
      <CardContainer filter={filter} />
    </>
  );
}
