
import Header from '@/components/Header';
import { useAuth } from '@clerk/nextjs';
import Menu from '@/components/Menu';
import SignInPage from '../signin';
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
            <Menu id={id}/>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    return { props: { id  } };
}
