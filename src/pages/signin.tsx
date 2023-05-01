import { SignIn } from "@clerk/nextjs";
import styles from "@/styles/SignIn.module.css";

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <SignIn />
    </div>
  );
}
