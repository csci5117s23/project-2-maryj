import { Inter } from 'next/font/google'
import CardContainer from '@/components/CardContainer'
import Header from '@/components/Header';
import { useAuth } from '@clerk/nextjs';
import SignInPage from './signin';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!userId) {
    return <SignInPage />
  }

  return (
    <>
      <Header/>
      <CardContainer filter="yes"/>
    </>
  )
}
