import styles from '@/styles/Image.module.css';
import Image, { ImageProps } from "next/image";
import { MdStar, MdStarBorder } from "react-icons/md";
import { useState } from 'react';

interface ImgProps {
  url : string,
  isStarred : boolean,
  title : string,
  isResto : boolean
}

export default function ImageCustom({ url, isStarred, title, isResto=false } : ImgProps) {
  const [starState, setStarState]: [boolean, Function] = useState(isStarred);

  return (
    <div className={styles[isResto ? 'resto-container' : 'image-container']}>
      <Image
        className={styles[isResto ? 'image-resto' : 'image']}
        src={url}
        alt={`image of ${title}`}
        fill
      />
      {starState ?
        <MdStar
          className={styles['image-star']}
          size="25px"
          onClick={e => setStarState(!starState)}
        /> :
        <MdStarBorder
          className={styles['image-star']}
          size="25px"
          onClick={e => setStarState(!starState)}
        />
      }
    </div>
  )
}

