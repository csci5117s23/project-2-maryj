import Link from 'next/link';
import styles from '@/styles/Header.module.css'

/* 
home likes starred logout jenkins logo
*/

export default function Header() {
  const links = [
    { href: '/home', text: 'home',  icon: 'idk'},
    { href: '/likes', text: 'likes',  icon: 'idk'},
    { href: '/starred', text: 'starred',  icon: 'idk'},
    { href: '/logout', text: 'logout',  icon: 'idk'},
  ]

  return (
    <div className={styles.header}>
      <div className={styles.links}>
        {links.map((link, index) => (
          <div key={index} className={styles.link}>
            <Link href={link.href}>
              {link.text}{' '}
            </Link>
            <div className={styles.icon}>
              
            </div>
          </div>
        ))}
      </div>
      <div className={styles.logo}>
        {/* logo stuff */}
      </div>
    </div>
  )
}