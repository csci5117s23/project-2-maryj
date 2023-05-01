import styles from '@/styles/MenuPage.module.css';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import Menu from '@/components/Menu';
import ImageCustom from '@/components/Image';
import Input from '@/components/Input';

interface RestoProps {
    id: number;
}

// TODO: delete this once backend exists and fetch data
interface RestaurantInfo {
    image: string,
    name: string,
    starred: boolean,
}

export default function Resto() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [restaurant, setRestaurant]: [any, Function] = useState(null);
    const [liked, setLiked] : [any, Function] = useState(null);

    
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded || !router.isReady) return;

        async function getRestaurant() {

            // Not logged in
            if (!userId) {
                router.push("/signin");
                return;
            }

            const placeId = router.query.id;
            const token = await getToken({ template: "codehooks" });
            const response = await fetch("https://backend-qsum.api.codehooks.io/dev/get-restaurant", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    placeId: placeId,
                    userId: userId, 
                }),
            });

            // Bad Auth
            if (!response.ok) {
                router.push("/404");
                return;
            }
            
            const data = await response.json();
            setRestaurant(data);
            if (liked == null) {
                setLiked(data.liked);
            }
        }
        getRestaurant();
    }, [isLoaded, router, getToken, userId]);

    async function updateLiked() {
        const token = await getToken({ template: 'codehooks' });

        await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/update-restaurant', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                placeId: restaurant.placeId,
                userId: userId,
                liked: !liked
            })
        });
        setLiked(!liked);
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.title}>{restaurant ? restaurant.name : "Loading..."}</div>
                <div className={styles.image}>
                    <ImageCustom
                        url={restaurant?.imageId}
                        isStarred={restaurant?.starred}
                        isLiked={restaurant?.liked}
                        isResto={true}
                        update={updateLiked}
                    />
                </div>
                <Input
                    placeId={router.query.id as string}
                    placeholder={"Add item here..."}
                    id={"add-item"}
                    name={"add-item"}
                    addMenuItem={(item: string) => {
                        const restaurantCopy = { ...restaurant };
                        if (!restaurantCopy.itemsTried) restaurantCopy.itemsTried = [];
                        restaurantCopy.itemsTried.push({
                            name: item,
                            liked: false,
                            reflection: "",
                        });
                        setRestaurant(restaurantCopy);
                    }}
                />
                <Menu restaurant={restaurant} />
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    return { props: { id } };
}
