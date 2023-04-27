import React, { useState, useMemo, useEffect, useRef, forwardRef } from "react";
import Camera from 'react-html5-camera-photo';
import styles from "@/styles/ReflectionModal.module.css";
import QuillWrapper from "@/components/QuillWrapper";
import 'react-html5-camera-photo/build/css/index.css';
import { MdEditNote, MdCameraAlt, MdClose } from "react-icons/md";
import { useAuth } from '@clerk/nextjs';

export interface ReflectionModalProps {
  isVisible: boolean;
  resutaurantId: string;
  itemName: string;
}

export default function ReflectionModal({ isVisible, resutaurantId, itemName }: ReflectionModalProps) {
  const [value, setValue] = useState("");
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [cameraStatus, setCameraStatus]: [boolean, Function] = useState<boolean>(false);

  function handleChange(newValue: string) {
    setValue(newValue);
  }

  function handleTakePhoto (dataUri: any) {
    console.log(dataUri);
    setCameraStatus(!cameraStatus);
  }

  async function handleSave () {
    const token = await getToken({ template: "codehooks" });
    fetch(`https://backend-qsum.api.codehooks.io/dev/update-item/${resutaurantId}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: itemName, reflection: value }),
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
      });
    });
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
              <button className={styles.save} onClick={handleSave}>
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
