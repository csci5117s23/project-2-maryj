import { Inter } from 'next/font/google'
import Splash from './splash';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Splash />
  );
}
