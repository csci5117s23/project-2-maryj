import { MdEdit, MdStar, MdStarBorder } from "react-icons/md";
import { useState } from "react";
import styles from "@/styles/MenuItem.module.css";
import { useAuth } from "@clerk/nextjs";

interface MenuItemProps {
  placeId: string;
  title: string;
  liked: boolean;
  reflection: string;
  setModal: Function;
}

export default function MenuItem({
  placeId,
  title,
  liked,
  reflection,
  setModal
}: MenuItemProps) {
  const [isLiked, setIsLiked]: [boolean, Function] = useState<boolean>(liked);
  const { userId, getToken } = useAuth();

  const handleStar = () => {
    const liked = !isLiked;
    setIsLiked(liked);

    const updateLiked = async () => {
      const token = await getToken({ template: "codehooks" });
      fetch(
        `https://backend-qsum.api.codehooks.io/dev/update-item/${placeId}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: title,
            liked: liked,
            userId: userId,
          }),
        }
      ).then((res) => {
        res.json().then((data) => {
          console.log(data);
        });
      });
    };
    updateLiked();
  };

  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <div className={styles.options}>
        {isLiked ? (
          <MdStar className={styles.star} onClick={handleStar} size="25px" />
        ) : (
          <MdStarBorder
            className={styles.star}
            onClick={handleStar}
            size="25px"
          />
        )}
        <MdEdit
          className={styles.icon}
          size="25px"
          onClick={() => setModal(placeId, title, reflection)}
        />
      </div>
    </div>
  );
}
