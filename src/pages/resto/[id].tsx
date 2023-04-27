import styles from '@/styles/MenuPage.module.css';
import Header from '@/components/Header';
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



export default function Resto({ id }: RestoProps) {
    const { isLoaded, userId, sessionId, getToken } = useAuth();

    // Verify ID is valid in useEffect
    if (!userId) {
        return <SignInPage />;
    }

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
                <Menu id={id} />
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    return { props: { id } };
}
