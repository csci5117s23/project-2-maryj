import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useState, useEffect } from "react";
import ReflectionModal from "./ReflectionModal";
import styles from "@/styles/Menu.module.css";
import MenuItem from "./MenuItem";

interface MenuProps {
  restaurant: any;
}

interface MenuItem {
  name: string;
  liked: boolean;
  reflection: string;
}

export default function Menu({ restaurant }: MenuProps) {
  const [viewMenuItems, setViewMenuItems]: [boolean, Function] =
    useState<boolean>(true);
  const [viewLikedItems, setViewLikedItems]: [boolean, Function] =
    useState<boolean>(true);
  const [isReflectionVisible, setIsReflectionVisible]: [boolean, Function] =
    useState<boolean>(false);

  const [modalPlaceId, setModalPlaceId]: [string, Function] = useState("");
  const [modalTitle, setModalTitle]: [string, Function] = useState("");
  const [modalReflection, setModalReflection]: [string, Function] =
    useState("");

  const [menuItems, setMenuItems]: [MenuItem[], Function] = useState<
    MenuItem[]
  >([]);
  useEffect(() => {
    restaurant && restaurant.itemsTried && setMenuItems(restaurant.itemsTried);
  }, [restaurant]);

  function setModal(placeId: string, title: string, reflection: string) {
    setModalPlaceId(placeId);
    setModalTitle(title);
    setModalReflection(reflection);
    setIsReflectionVisible(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.accordion}>
        <div className={styles["accordion-title"]}>
          <h3>Favorite Items</h3>
          {viewLikedItems ? (
            <MdKeyboardArrowUp
              className={styles.icons}
              size={"25px"}
              onClick={(e) => setViewLikedItems(!viewLikedItems)}
            />
          ) : (
            <MdKeyboardArrowDown
              className={styles.icons}
              size={"25px"}
              onClick={(e) => setViewLikedItems(!viewLikedItems)}
            />
          )}
        </div>
        <div
          className={styles["accordion-items"]}
          style={
            viewLikedItems
              ? { transform: "scaleY(1)" }
              : { transform: "scaleY(0)" }
          }
        >
          {menuItems
            .filter((item) => item.liked)
            .map((item, index) => {
              return (
                <MenuItem
                  key={index}
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
        <div className={styles["accordion-title"]}>
          <h3>Menu</h3>
          {viewMenuItems ? (
            <MdKeyboardArrowUp
              className={styles.icons}
              size={"25px"}
              onClick={(e) => setViewMenuItems(!viewMenuItems)}
            />
          ) : (
            <MdKeyboardArrowDown
              className={styles.icons}
              size={"25px"}
              onClick={(e) => setViewMenuItems(!viewMenuItems)}
            />
          )}
        </div>
        <div
          className={styles["accordion-items"]}
          style={
            viewMenuItems
              ? { transform: "scaleY(1)" }
              : { transform: "scaleY(0)" }
          }
        >
          {menuItems
            .filter((item) => !item.liked)
            .map((item, index) => {
              return (
                <MenuItem
                  key={index}
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
