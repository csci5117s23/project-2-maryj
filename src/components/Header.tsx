import { MdHomeFilled, MdFavorite, MdStar, MdLogout } from "react-icons/md";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import JenkinsGuy from "./JenkinsGuy";
import Link from 'next/link';
import styles from '@/styles/Header.module.css'

/* 
home likes starred logout jenkins logo
*/

export default function Header() {
  const { signOut } = useClerk();
  const router = useRouter();
  const links = [
    { href: '/home', text: 'Home',  icon: <MdHomeFilled />},
    { href: '/likes', text: 'Likes',  icon: <MdFavorite />},
    { href: '/starred', text: 'Starred',  icon: <MdStar />},
  ]

  return (
    <div className={styles.header}>
      <div className={styles.links}>
        {links.map((link, index) => (
          <div key={index} onClick={e => { 
            if (router.pathname !== '/trac') {
              router.push({
                pathname: '/trac',
                query: { filter: link.text },
              });
            } else {
              router.replace({
                pathname: router.pathname,
                query: { ...router.query, filter: link.text },
              });
            }
          }} className={styles.link}>
            {link.text}{' '}
            <div className={styles.icon}>{link.icon}</div>
          </div>
        ))}
        <Link href="/" onClick={e => { signOut(); router.push("/") }} className={styles.link}>
          Logout
          <div className={styles.icon}><MdLogout /></div>
        </Link>
      </div>
      <JenkinsGuy/>
    </div>
  )
}