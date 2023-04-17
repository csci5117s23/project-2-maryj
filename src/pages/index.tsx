import Header from '@/components/Header';
import { useAuth } from '@clerk/nextjs';
import SignInPage from './signin';

export default function Home() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!userId) {
    return <SignInPage />
  }

  return (
    <>
      <Header />
    </>
  )
}
