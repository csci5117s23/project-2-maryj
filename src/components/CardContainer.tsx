import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Card from "./Card";
import styles from "@/styles/CardContainer.module.css";

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

export default function CardContainer({ filter }: CardContainerProps) {
  // add auth
  const { userId, getToken } = useAuth();
  const [cards, setCards]: [Card[], Function] = useState<Card[]>([]);

  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");

  useEffect(() => {
    async function getGeo() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude.toString());
        setLon(position.coords.longitude.toString());
      });
    }
    getGeo();
  }, []);

  useEffect(() => {
    if (!lat || !lon || !userId || !filter) return;

    async function getNearbyPlaces() {
      const token = await getToken({ template: "codehooks" });
      let response = null;

      if (filter === "Saved") {
        response = await fetch(`${backend_base}/get-restaurants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            userId,
            filter,
          }),
        });
      } else if (filter === "Likes") {
        response = await fetch(`${backend_base}/get-restaurants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            userId,
            filter,
          }),
        });
      } else {
        response = await fetch(`${backend_base}/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            lat,
            lon,
            userId,
          }),
        });
      }

      response
        .json()
        .then((data) => {
          setCards(
            data.map((entry: any) => {
              return {
                id: entry.placeId,
                title: entry.name,
                address: entry.address,
                image: entry.imageId,
                isLiked: entry.liked,
                isStarred: entry.starred,
              };
            })
          );
        })
        .catch((err) => {
          setCards([]);
        });
    }

    getNearbyPlaces();
  }, [lat, lon, userId, getToken, filter]);

  return (
    <div className={styles.container}>
      {cards.map((card) => {
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
