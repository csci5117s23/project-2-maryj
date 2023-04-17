import Card from "./Card";
import { useState, useEffect } from "react";
import styles from '@/styles/CardContainer.module.css';

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
    const [cards, setCards]: [Card[], Function] = useState<Card[]>([]);

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