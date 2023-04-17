
import Image from 'next/image';
import { MdStar, MdStarBorder } from "react-icons/md";
import styles from '@/styles/Card.module.css';
import { useState } from 'react';

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
                <Image
                    className={styles.image}
                    src={image} 
                    alt={`image of ${title}`} 
                    fill 
                />
                {starState ? 
                    <MdStar 
                        className={styles['image-star']}
                        color="yellow" 
                        size="25px"
                        onClick={e => setStarState(!starState)}
                    /> : 
                    <MdStarBorder 
                        className={styles['image-star']} 
                        color="yellow" 
                        size="25px" 
                        onClick={e => setStarState(!starState)} 
                    />
                }
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.category}>{category}</p>
        </div>
    );
}