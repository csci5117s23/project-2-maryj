import React, { useState, useMemo, useEffect, useRef, forwardRef } from "react";
import Camera from 'react-html5-camera-photo';
import styles from "@/styles/ReflectionModal.module.css";
import QuillWrapper from "@/components/QuillWrapper";
import 'react-html5-camera-photo/build/css/index.css';
import { MdEditNote, MdCameraAlt, MdClose } from "react-icons/md";


export interface ReflectionModalProps {
  isVisible: boolean;
}

export default function ReflectionModal({ isVisible }: ReflectionModalProps) {
  const [value, setValue] = useState("");
  const [cameraStatus, setCameraStatus]: [boolean, Function] = useState<boolean>(false);

  function handleChange(newValue: string) {
    setValue(newValue);
  }

  function handleTakePhoto (dataUri: any) {
    console.log(dataUri);
    setCameraStatus(!cameraStatus);
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.blur}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h3>Reflection</h3>
              <MdClose size="25px" />
            </div>
            <QuillWrapper value={value} onChange={handleChange} />
            <div className={styles.buttons}>
              <button 
                className={styles.camera}
                onClick={e => setCameraStatus(!cameraStatus)}
              >
                Camera
                <MdCameraAlt 
                  size="18px"
                />
              </button>
              <button className={styles.save}>
                Save
                <MdEditNote 
                  size="18px"
                />
              </button>
            </div>
          </div>
          {cameraStatus && 
            <div className={styles['camera-modal']}>
                <Camera
                  onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                />
            </div>}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
