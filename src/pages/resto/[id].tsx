import styles from '@/styles/MenuPage.module.css';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import Menu from '@/components/Menu';
import SignInPage from '../signin';
import ImageCustom from '@/components/Image';
import Input from '@/components/Input';


interface RestoProps {
    id: number;
}

// TODO: delete this once backend exists and fetch data
interface RestaurantInfo {
    image: string,
    title: string,
}

export default function Resto() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [restaurant, setRestaurant]: [any, Function] = useState(undefined);
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded || !router.isReady) return;

        async function getRestaurant() {

            // Not logged in
            if (!userId) {
                router.push("/signin");
                return;
            }

            const restaurantID = router.query.id;
            const token = await getToken({ template: "codehooks" });
            const response = await fetch('https://' + process.env.NEXT_PUBLIC_API_ENDPOINT + `/restaurant/${restaurantID}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            // Bad Auth
            if (!response.ok) {
                router.push("/404");
                return;
            }
            
            const data = await response.json();
            setRestaurant(data);
        }

        getRestaurant();
    }, [isLoaded, router, getToken, userId]);

    // TODO: FETCH RELEVANT DATA FROM ID, USERID HERE
    //       delete this once this is done
    const dummyRestaurant: RestaurantInfo = {
        title: "Raising Cane's",
        image: "https://i.imgur.com/tB3WB6m.jpeg",
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.title}>{dummyRestaurant.title}</div>
                <div className={styles.image}>
                    <ImageCustom
                        url={dummyRestaurant.image}
                        isStarred={true}
                        title={dummyRestaurant.image}
                        isResto={true}
                    />
                </div>
                <Input
                    placeholder={"Add item here..."}
                    id={"add-item"}
                    name={"add-item"}
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
