import Card from "./Card";
import { useState, useEffect } from "react";
import styles from '@/styles/CardContainer.module.css';
import { useAuth } from '@clerk/nextjs';

const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

interface CardContainerProps {
    filter: string;
}

interface Card {
    id: number;
    title: string;
    category: string;
    image: string;
    isStarred: boolean;
}

const dummyCards: Card[] = [
    {
      id: 1,
      title: "Raising Cane's Chicken Fingers",
      category: "Fried Chicken",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isStarred: false
    },
    {
      id: 2,
      title: "Hong Kong Noodle",
      category: "Chinese Cuisine",
      image: "https://i.imgur.com/FL5Xd1Y.jpeg",
      isStarred: true
    },
    {
      id: 3,
      title: "Sushi Station",
      category: "Japanese",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isStarred: false
    },
    {
      id: 4,
      title: "Chipotle Mexican Grill",
      category: "Mexican",
      image: "https://i.imgur.com/FL5Xd1Y.jpeg",
      isStarred: true
    },
    {
      id: 5,
      title: "Café de Paris",
      category: "French",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isStarred: false
    }
];

export default function CardContainer({ filter }: CardContainerProps) {
    // add auth
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [cards, setCards]: [Card[], Function] = useState<Card[]>([]);

    const [lat,setLat] = useState<string>("");
    const [lon,setLon] = useState<string>("");
    const [restaurants, setRestaurants] = useState<any[]>([]);

    useEffect(()=>{
        async function getGeo(){
            navigator.geolocation.getCurrentPosition((position)=>{
                setLat(position.coords.latitude.toString());
                setLon(position.coords.longitude.toString());
            });
        }
        getGeo();
    }, []);

    // // Delete all restaurants lol
    // useEffect(()=>{
    //     async function clearDatabase(){
    //         let queryString = backend_base + "/clear";
    //         // console.log(queryString)
    //         const response = await fetch(queryString, {
    //             method: "DELETE",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body : JSON.stringify({
    //                 userId: userId,
    //             }),
    //         });
    //         const data = await response.json();
    //         // console.log(data);
    //     }
    //     clearDatabase();
    // }, [userId]);
    
    useEffect(()=>{
        async function getNearbyPlaces(){
            let queryString = backend_base + "/google";
            // console.log(queryString)
            console.log(lat,lon)
            const response = await fetch(queryString, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    lat: lat,
                    lon: lon,
                    userId: userId,
                }),
            });
            const data = await response.json();
            setRestaurants(data);
            console.log(data);
        }
        getNearbyPlaces();
    }, [lat]);


    useEffect(() => {
        
        // Fetch for cards and set them in setCards() function
        async function getCards() {
            // const response = await fetch()
            setCards(dummyCards);
        }
        getCards();
    }, []);


    return (
        <div className={styles.container}>
            {cards.map(card => {
                return (
                    <Card
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        category={card.category}
                        image={card.image}
                        isStarred={card.isStarred}
                    />                    
                );
            })}
        </div>
    );
}