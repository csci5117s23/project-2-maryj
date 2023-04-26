import styles from '@/styles/MenuPage.module.css';
import Header from '@/components/Header';
import { useAuth } from '@clerk/nextjs';
import Menu from '@/components/Menu';
import SignInPage from '../signin';
import Image from 'next/image';
import { useEffect } from 'react';


interface RestoProps {
    id: number;
}

export default function Resto({ id }: RestoProps ) {
    const { isLoaded, userId, sessionId, getToken } = useAuth();

    // Verify ID is valid in useEffect
    if (!userId) {
        return <SignInPage />;
    }

    return (
        <>
            <Header/>
            <div className={styles.container}>
                <div className={styles.title}>Title Here</div>
                {/* FIXME: refactor */}
                <Image
                    className={styles.image}
                    src={""} 
                    alt={"restaurant image here"} 
                />
                <div className={styles.input}>Input Here</div>
                <Menu id={id}/>
            </div>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    return { props: { id  } };
}
