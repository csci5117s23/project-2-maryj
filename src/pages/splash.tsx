import { SignIn } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Image from "next/image";
import style from "@/styles/Splash.module.css";

export default function Splash() {
  const [showSignin, setShowSignin] = useState(false);
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/trac");
    }
  }, [isLoaded, userId, router]);

  const goLogin = () => {
    setShowSignin(true);
  };

  const hideLogin = () => {
    setShowSignin(false);
  };

  return (
    <header className={style.appHeader}>
      <Image src={"/jenkinsGuySquare.png"} alt={""} width={250} height={250} />
      <h1>
        a<span className={style.nameStyle}>Resto</span>Trac
      </h1>
      {showSignin && <SignIn />}
      {showSignin ? (
        <button className={`${style.btn} ${style.cancel}`} onClick={hideLogin}>
          Cancel
        </button>
      ) : (
        <button className={`${style.btn} ${style.login}`} onClick={goLogin}>
          Get Started
        </button>
      )}
    </header>
  );
}
