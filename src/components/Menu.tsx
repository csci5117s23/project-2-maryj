import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useState, useRef, useEffect, MutableRefObject } from "react";
import ReflectionModal from "./ReflectionModal";
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
    const [viewMenuItems, setViewMenuItems]: [boolean, Function] = useState<boolean>(true);
    const [viewLikedItems, setViewLikedItems]: [boolean, Function] = useState<boolean>(true);
    const [isReflectionVisible, setIsReflectionVisible]: [boolean, Function] = useState<boolean>(false);
    const liked = useRef() as MutableRefObject<HTMLDivElement>;
    const menu = useRef() as MutableRefObject<HTMLDivElement>;

    const [modalPlaceId, setModalPlaceId]: [string, Function] = useState('');
    const [modalTitle, setModalTitle]: [string, Function]  = useState('');
    const [modalReflection, setModalReflection]: [string, Function]  = useState('');


    const [menuItems, setMenuItems]: [MenuItem[], Function] = useState<MenuItem[]>([]);
    useEffect(() => {
        console.log("restaurant", restaurant);
        restaurant && restaurant.itemsTried && setMenuItems(restaurant.itemsTried);
    }, [restaurant]);

    function setModal(placeId: string, title: string, reflection: string) {
        setModalPlaceId(placeId);
        setModalTitle(title);
        setModalReflection(reflection);
        setIsReflectionVisible(true);
    }

    function assignKey(title: string) {
        return title + Math.random().toString(36).substring(7);
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
                        ? { transform: "scaleY(1)" }
                        : { transform: "scaleY(0)"}
                    }
                >
                    {menuItems.filter(item => item.liked).map(item => {
                        return (
                            <MenuItem 
                                key={assignKey(restaurant.name)}
                                placeId={restaurant.placeId}
                                title={item.name}
                                liked={item.liked}
                                reflection={item.reflection}
                                setModal={setModal}
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
                        ? { transform: "scaleY(1)" }
                        : { transform: "scaleY(0)"}
                    }
                >
                    {menuItems.filter(item => !item.liked).map(item => {
                        return (
                            <MenuItem 
                                key={assignKey(restaurant.name)}
                                placeId={restaurant.placeId}
                                title={item.name}
                                liked={item.liked}
                                reflection={item.reflection}
                                setModal={setModal}
                            />
                        );
                    })}
                </div>
            </div>
            <ReflectionModal
                isVisible={isReflectionVisible}
                setIsVisible={setIsReflectionVisible}
                placeId={modalPlaceId}
                itemName={modalTitle}
                startingReflection={modalReflection}
            />
        </div>
    );
}   