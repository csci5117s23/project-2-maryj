import { MdEdit, MdStar, MdStarBorder } from 'react-icons/md';
import styles from '@/styles/MenuItem.module.css';

interface MenuItemProps {
    title: string;
    liked: boolean;
    reflection: string;
}

export default function MenuItem({ title, liked, reflection }: MenuItemProps) {
    return (
        <div className={styles.container}>
            <h3>{title}</h3>
            <div className={styles.options}>
                {liked ?
                    <MdStar 
                        className={styles.star}
                        size="25px"
                    /> : 
                    <MdStarBorder 
                        className={styles.star} 
                        size="25px" 
                    />
                }
                <MdEdit 
                    className={styles.icon}
                    size="25px" 
                />
            </div>
        </div>
    );
}