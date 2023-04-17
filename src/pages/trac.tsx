import { Inter } from 'next/font/google'
import CardContainer from '@/components/CardContainer'
import Header from '@/components/Header';
import { useAuth } from '@clerk/nextjs';
import SignInPage from './signin';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [filter, setFilter] = useState<string>('Home');
  const router = useRouter();

  useEffect(() => {
    if (router.query.filter && router.query.filter !== filter) {
      setFilter(router.query.filter as string);
    }
  }, [filter, router.query.filter]);

  if (!userId) {
    return <SignInPage />
  }

  return (
    <>
      <Header/>
      <CardContainer filter={filter}/>
    </>
  )
}
