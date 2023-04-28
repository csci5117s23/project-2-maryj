import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useState, useRef, MutableRefObject } from "react";
import styles from '@/styles/Menu.module.css';
import MenuItem from "./MenuItem";

interface MenuProps {
    restaurant: any;
}

interface MenuItem {
    name: string;
    liked: boolean;
    reflection: string;
}

const dummyMenuItems: MenuItem[] = [
    {
        name: 'Spaghetti Carbonara',
        liked: true,
        reflection: ""
    },
    {
        name: 'Chicken Alfredo',
        liked: false,
        reflection: ""
    },
    {
        name: 'Margherita Pizza',
        liked: true,
        reflection: ""
    },
    {
        name: 'Caesar Salad',
        liked: false,
        reflection: ""
    },
    {
        name: 'Grilled Salmon',
        liked: true,
        reflection: ""
    }
];

export default function Menu({ restaurant }: MenuProps) {
    const [viewMenuItems, setViewMenuItems]: [boolean, Function] = useState<boolean>(false);
    const [viewLikedItems, setViewLikedItems]: [boolean, Function] = useState<boolean>(false);
    const liked = useRef() as MutableRefObject<HTMLDivElement>;
    const menu = useRef() as MutableRefObject<HTMLDivElement>;

    if (restaurant === undefined) {
        return null;
    }

    const menuItems: MenuItem[] = restaurant.itemsTried;

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
                                key={item.name}
                                title={item.name}
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
                                key={item.name}
                                title={item.name}
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