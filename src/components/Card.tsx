
import Image from 'next/image';
import { MdStarBorder } from "react-icons/md";
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
                <Image src={image} alt={`image of ${title}`} fill />
                <MdStarBorder size="20px" className={styles['image-star']} />
            </div>
        </div>
    );
}