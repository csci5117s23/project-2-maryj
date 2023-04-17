import { MdHomeFilled, MdFavorite, MdStar, MdLogout } from "react-icons/md";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
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
          <Link key={index} href={link.href} className={styles.link}>
            {link.text}{' '}
            <div className={styles.icon}>{link.icon}</div>
          </Link>
        ))}
        <Link href="/" onClick={e => { signOut(); router.push("/") }} className={styles.link}>
          Logout
          <div className={styles.icon}><MdLogout /></div>
        </Link>
      </div>
      <div className={styles.logo}>
        {/* logo stuff */}
      </div>
    </div>
  )
}