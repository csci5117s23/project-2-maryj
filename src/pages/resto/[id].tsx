
import Header from '@/components/Header';
import { useAuth } from '@clerk/nextjs';
import Menu from '@/components/Menu';
import SignInPage from '../signin';

interface RestoProps {
    id: number;
}

export default function Resto({ id }: RestoProps ) {
    const { isLoaded, userId, sessionId, getToken } = useAuth();

    if (!userId) {
        return <SignInPage />;
    }

    return (
        <div>
            <Header/>
            <Menu id={id}/>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    // Verify ID is valid
    // const response = await fetch('https://' + process.env.NEXT_PUBLIC_API_ENDPOINT + `/resto/${id}`);
    // if (response.ok) {
    //     return { 
    //         props: { 
    //             id  
    //         } 
    //     };
    // } else {
    //     return {
    //         notFound: true,
    //     };
    // }
    return { 
        props: { 
            id  
        } 
    };
}
