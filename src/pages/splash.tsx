import style from '@/styles/splash.module.css';
import { SignIn } from "@clerk/clerk-react";
import { useState } from "react"
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';





export default function Splash() {

    const [showSignin, setShowSignin] = useState(false);
    const { isLoaded, userId} = useAuth();
    const router = useRouter();


    /** 
     * This would route to the main page if the user is logged in 
     * 
    */
    // if (isLoaded && userId) {
    //     router.push('/home');
    // }

    const goLogin = () => {
        setShowSignin(true);
    }

    const hideLogin =() =>{
        setShowSignin(false);
    }


    return (
        <header className={style.appHeader}>
            <p> add logo here</p>
            <h1>a<span className={style.nameStyle} >Resto</span>Trac</h1>
            {showSignin && <SignIn/>}
            {showSignin ? 
                (<button className={`${style.btn} ${style.cancel}`} onClick={hideLogin}>Cancel</button>)
                : (<button className={`${style.btn} ${style.login}`} onClick={goLogin}>Get Started</button>)    
            }
        </header>
    );
}