import styles from '@/styles/Image.module.css';
import Image, { ImageProps } from "next/image";
import { MdStar, MdStarBorder } from "react-icons/md";
import { useState } from 'react';

interface ImgProps {
  url : string,
  isStarred : boolean,
  title : string,
  isResto : boolean,
  update: Function
}

export default function ImageCustom({ url, isStarred, title, isResto = false, update } : ImgProps) {
  let photo_url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=";
  photo_url += url;
  photo_url += "&key=";
  photo_url += process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  return (
    <div className={styles[isResto ? 'resto-container' : 'image-container']}>
      <Image
        className={styles[isResto ? 'image-resto' : 'image']}
        src={photo_url}
        alt={`Loading...`}
        fill
        sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
        priority
      />
      {isStarred ?
        <MdStar
          className={styles['image-star']}
          size="25px"
          onClick={e => {
            e.stopPropagation();
            update();
          }}
        /> :
        <MdStarBorder
          className={styles['image-star']}
          size="25px"
          onClick={e => {
            e.stopPropagation();
            update();
          }}
        />
      }
    </div>
  )
}

