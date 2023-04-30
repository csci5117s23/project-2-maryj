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
    address: string;
    image: string;
    isLiked: boolean;
    isStarred: boolean;
}

const dummyCards: Card[] = [
    {
      id: 1,
      title: "Raising Cane's Chicken Fingers",
      address: "Fried Chicken",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isLiked: false,
      isStarred: false
    },
    {
      id: 2,
      title: "Hong Kong Noodle",
      address: "Chinese Cuisine",
      image: "https://i.imgur.com/FL5Xd1Y.jpeg",
      isLiked: false,
      isStarred: true
    },
    {
      id: 3,
      title: "Sushi Station",
      address: "Japanese",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isLiked: false,
      isStarred: false
    },
    {
      id: 4,
      title: "Chipotle Mexican Grill",
      address: "Mexican",
      image: "https://i.imgur.com/FL5Xd1Y.jpeg",
      isLiked: false,
      isStarred: true
    },
    {
      id: 5,
      title: "Café de Paris",
      address: "French",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isLiked: false,
      isStarred: false
    }
];

export default function CardContainer({ filter }: CardContainerProps) {
    // add auth
    const { userId, getToken } = useAuth();
    const [cards, setCards]: [Card[], Function] = useState<Card[]>([]);

    const [lat, setLat] = useState<string>("");
    const [lon, setLon] = useState<string>("");

    useEffect(()=>{
        async function getGeo() {
            navigator.geolocation.getCurrentPosition((position) => {
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
    //         const token = await getToken({ template: 'codehooks' });
    //         // console.log(queryString)
    //         const response = await fetch(queryString, {
    //             method: "DELETE",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": "Bearer " + token
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
    
    useEffect(() => {
        if (!lat || !lon || !userId || !filter) return;

        async function getNearbyPlaces() {
            const token = await getToken({ template: 'codehooks' });
            let response = null;

            if (filter === "Starred") {
                response = await fetch(backend_base + "/get-restaurants", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        userId: userId,
                        filter: filter
                    })
                });
            } else if (filter === "Likes") {
                response = await fetch(backend_base + "/get-restaurants", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        userId: userId,
                        filter: filter
                    })
                });
            } else {
                response = await fetch(backend_base + "/google", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        lat: lat,
                        lon: lon,
                        userId: userId,
                    })
                });
            }
            
            response.json().then((data) => {
                setCards(data.map((entry: any) => {
                    return {
                        id: entry.placeId,
                        title: entry.name,
                        address: entry.address,
                        image: entry.imageId,
                        isLiked: entry.liked,
                        isStarred: entry.starred
                    };
                }));
            }).catch((err) => {setCards([])});
        }
        
        getNearbyPlaces();
    }, [lat, lon, userId, getToken, filter]);

    return (
        <div className={styles.container}>
            {cards.map(card => {
                return (
                    <Card
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        address={card.address}
                        image={card.image}
                        isStarred={card.isStarred}
                    />                    
                );
            })}
        </div>
    );
}