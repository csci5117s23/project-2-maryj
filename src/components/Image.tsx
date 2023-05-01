import Image, { ImageProps } from "next/image";
import {
  MdStar,
  MdStarBorder,
  MdFavorite,
  MdFavoriteBorder,
} from "react-icons/md";
import styles from "@/styles/Image.module.css";

interface ImgProps {
  url: string;
  isStarred: boolean;
  isLiked?: boolean;
  isResto: boolean;
  update: Function;
}

export default function ImageCustom({
  url,
  isStarred,
  isLiked,
  isResto = false,
  update,
}: ImgProps) {
  let photo_url =
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=";
  photo_url += url;
  photo_url += "&key=";
  photo_url += process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  return (
    <div className={styles[isResto ? "resto-container" : "image-container"]}>
      <Image
        className={styles[isResto ? "image-resto" : "image"]}
        src={
          url
            ? photo_url
            : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
        }
        alt={`Loading...`}
        fill
        sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
        priority
      />
      {isResto ? (
        // is a restaurant
        isLiked ? (
          <MdFavorite
            className={styles["image-heart"]}
            size={"25px"}
            onClick={(e) => {
              e.stopPropagation();
              update();
            }}
          />
        ) : (
          <MdFavoriteBorder
            className={styles["image-heart"]}
            size={"25px"}
            onClick={(e) => {
              e.stopPropagation();
              update();
            }}
          />
        )
      ) : // is not a restaurant
      isStarred ? (
        <MdStar
          className={styles["image-star"]}
          size={"25px"}
          onClick={(e) => {
            e.stopPropagation();
            update();
          }}
        />
      ) : (
        <MdStarBorder
          className={styles["image-star"]}
          size={"25px"}
          onClick={(e) => {
            e.stopPropagation();
            update();
          }}
        />
      )}
    </div>
  );
}
