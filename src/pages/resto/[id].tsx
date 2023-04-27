
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import Menu from '@/components/Menu';

export default function Resto() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [id, setID]: [any, Function] = useState(undefined);
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded || !router.isReady) return;

        async function verify() {

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
            // if (!response.ok) {
            //     router.push("/404");
            //     return;
            // }

            setID(restaurantID);
        }

        verify();
    }, [isLoaded, router, getToken, userId]);

    return (
        <div>
            <Header/>
            <Menu id={id}/>
        </div>
    );
}
