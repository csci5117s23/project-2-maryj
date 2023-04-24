import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import styles from '@/styles/Menu.module.css';
import MenuItem from "./MenuItem";

interface MenuProps {
    id: number;
}

interface MenuItems {
    id: number;
    title: string;
    isFavorite: boolean;
}

const dummyMenuItems: MenuItems[] = [
    {
        id: 1,
        title: 'Spaghetti Carbonara',
        isFavorite: true
    },
    {
        id: 2,
        title: 'Chicken Alfredo',
        isFavorite: false
    },
    {
        id: 3,
        title: 'Margherita Pizza',
        isFavorite: true
    },
    {
        id: 4,
        title: 'Caesar Salad',
        isFavorite: false
    },
    {
        id: 5,
        title: 'Grilled Salmon',
        isFavorite: true
    }
];

export default function Menu({ id }: MenuProps) {
    const [menuItems, setMenuItems]: [MenuItems[], Function] = useState<MenuItems[]>([]);
    const [viewMenuItems, setViewMenuItems]: [boolean, Function] = useState<boolean>(false);
    const [viewFavoriteItems, setViewFavoriteItems]: [boolean, Function] = useState<boolean>(false);
    const favorites = useRef() as MutableRefObject<HTMLDivElement>;
    const menu = useRef() as MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        async function getMenuItems() {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/resto/${id}`);
            // Store this in menuItems
            const data = response.json();
            // Fetch for menuItems
            setMenuItems(dummyMenuItems);
        }
        getMenuItems();
    }, [id]);

    return (
        <div className={styles.container}>
            <div className={styles.accordion}>
                <div className={styles['accordion-title']}>
                    <h3>Favorite Items</h3>
                    {viewFavoriteItems ? 
                        <MdKeyboardArrowUp
                            className={styles.icons}
                            size="25px"
                            onClick={e => setViewFavoriteItems(!viewFavoriteItems)}
                        /> : 
                        <MdKeyboardArrowDown 
                            className={styles.icons}
                            size="25px" 
                            onClick={e => setViewFavoriteItems(!viewFavoriteItems)} 
                        />
                    }
                </div>
                <div 
                    ref={favorites}
                    className={styles['accordion-items']}
                    style={
                        viewFavoriteItems
                        ? { height: favorites.current.scrollHeight }
                        : { height: "0px" }
                    }
                >
                    {menuItems.filter(item => item.isFavorite).map(item => {
                        return (
                            <MenuItem 
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                isFavorite={item.isFavorite}
                            />
                        );
                    })}
                </div>
            </div>
            <div className={styles.accordion}>
                <div className={styles['accordion-title']}>
                    <h3>Menu</h3>
                    {viewMenuItems ? 
                        <MdKeyboardArrowUp
                            className={styles.icons}
                            size="25px"
                            onClick={e => setViewMenuItems(!viewMenuItems)}
                        /> : 
                        <MdKeyboardArrowDown 
                            className={styles.icons}
                            size="25px" 
                            onClick={e => setViewMenuItems(!viewMenuItems)} 
                        />
                    }
                </div>
                <div 
                    ref={menu}
                    className={styles['accordion-items']}
                    style={
                        viewMenuItems
                        ? { height: menu.current.scrollHeight }
                        : { height: "0px" }
                    }
                >
                    {menuItems.filter(item => !item.isFavorite).map(item => {
                        return (
                            <MenuItem 
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                isFavorite={item.isFavorite}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}   