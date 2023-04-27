
import styles from '@/styles/Card.module.css';
import { useState } from 'react';
import ImageCustom from './Image';

interface CardProps {
    id: number;
    title: string;
    category: string;
    image: string;
    isStarred: boolean;
}

export default function Card({ id, title, category, image, isStarred }: CardProps) {
    const [starState, setStarState]: [boolean, Function] = useState(isStarred);

    return (
        <div className={styles.card}>
            <div className={styles['image-container']}>
                <ImageCustom 
                    url={image}
                    isStarred={isStarred}
                    title={title}
                />
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.category}>{category}</p>
        </div>
    );
}