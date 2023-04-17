
import Image from 'next/image';
import { MdStar, MdStarBorder } from "react-icons/md";
import styles from '@/styles/Card.module.css';

interface CardProps {
    id: number;
    title: string;
    category: string;
    image: string;
    isStarred: boolean;
}

export default function Card({ id, title, category, image, isStarred }: CardProps) {
    return (
        <div className={styles.card}>
            <div className={styles['image-container']}>
                <Image
                    className={styles.image}
                    src={image} 
                    alt={`image of ${title}`} 
                    fill 
                />
                {isStarred ? 
                    <MdStar color="yellow" size="25px" className={styles['image-star']} /> : 
                    <MdStarBorder color="yellow" size="25px" className={styles['image-star']} />
                }
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.category}>{category}</p>
        </div>
    );
}