import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import styles from '@/styles/Menu.module.css';
import MenuItem from "./MenuItem";

interface MenuProps {
    id: number;
}

interface MenuItems {
    title: string;
    liked: boolean;
    reflection: string;
}

const dummyMenuItems: MenuItems[] = [
    {
        title: 'Spaghetti Carbonara',
        liked: true,
        reflection: ""
    },
    {
        title: 'Chicken Alfredo',
        liked: false,
        reflection: ""
    },
    {
        title: 'Margherita Pizza',
        liked: true,
        reflection: ""
    },
    {
        title: 'Caesar Salad',
        liked: false,
        reflection: ""
    },
    {
        title: 'Grilled Salmon',
        liked: true,
        reflection: ""
    }
];

export default function Menu({ id }: MenuProps) {
    const [menuItems, setMenuItems]: [MenuItems[], Function] = useState<MenuItems[]>([]);
    const [viewMenuItems, setViewMenuItems]: [boolean, Function] = useState<boolean>(false);
    const [viewLikedItems, setViewLikedItems]: [boolean, Function] = useState<boolean>(false);
    const liked = useRef() as MutableRefObject<HTMLDivElement>;
    const menu = useRef() as MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        if (!id) return;

        async function getMenuItems() {
            setMenuItems(dummyMenuItems);

            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/restaurant/${id}`);
            // Store this in menuItems
            const data: any = await response.json();

            // Fetch for menuItems
            // setMenuItems(data.itemsTried);
        }
        getMenuItems();
    }, [id]);

    if (id === undefined) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.accordion}>
                <div className={styles['accordion-title']}>
                    <h3>Favorite Items</h3>
                    {viewLikedItems ? 
                        <MdKeyboardArrowUp
                            className={styles.icons}
                            size="25px"
                            onClick={e => setViewLikedItems(!viewLikedItems)}
                        /> : 
                        <MdKeyboardArrowDown 
                            className={styles.icons}
                            size="25px" 
                            onClick={e => setViewLikedItems(!viewLikedItems)} 
                        />
                    }
                </div>
                <div 
                    ref={liked}
                    className={styles['accordion-items']}
                    style={
                        viewLikedItems
                        ? { height: liked.current.scrollHeight }
                        : { height: "0px" }
                    }
                >
                    {menuItems.filter(item => item.liked).map(item => {
                        return (
                            <MenuItem 
                                key={item.title}
                                title={item.title}
                                liked={item.liked}
                                reflection={item.reflection}
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
                    {menuItems.filter(item => !item.liked).map(item => {
                        return (
                            <MenuItem 
                                key={item.title}
                                title={item.title}
                                liked={item.liked}
                                reflection={item.reflection}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}   