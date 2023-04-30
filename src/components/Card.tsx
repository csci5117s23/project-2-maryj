
import styles from '@/styles/Card.module.css';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from "next/router";
import ImageCustom from './Image';

interface CardProps {
    id: number;
    title: string;
    address: string;
    image: string;
    isStarred: boolean;
}

const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export default function Card({ id, title, address, image, isStarred }: CardProps) {
    const [starState, setStarState]: [boolean, Function] = useState(isStarred);
    const { userId, getToken } = useAuth();
    const router = useRouter();

    async function update() {
        const token = await getToken({ template: 'codehooks' });

        await fetch(backend_base + '/update-restaurant', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                placeId: id,
                userId: userId,
                starred: !isStarred
            })
        });

        setStarState(!starState);
    }

    function handleRoute() {
        router.push({
            pathname: `/resto/${id}}`
        });
    }

    return (
        <div className={styles.card} onClick={handleRoute}>
            <div className={styles['image-container']}>
                <ImageCustom 
                    url={image}
                    isStarred={starState}
                    title={title}
                    isResto={false} 
                    update={update}               
                />
            </div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.address}>{address}</p>
        </div>
    );
}