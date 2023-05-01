import React, { useState, useEffect } from "react";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import styles from "@/styles/ReflectionModal.module.css";
import QuillWrapper from "@/components/QuillWrapper";
import "react-html5-camera-photo/build/css/index.css";
import { MdEditNote, MdCameraAlt, MdClose } from "react-icons/md";
import { useAuth } from "@clerk/nextjs";

export interface ReflectionModalProps {
  isVisible: boolean;
  setIsVisible: Function;
  placeId: string;
  itemName: string;
  startingReflection: string;
}

export default function ReflectionModal({
  isVisible,
  setIsVisible,
  placeId,
  itemName,
  startingReflection,
}: ReflectionModalProps) {
  const [value, setValue] = useState(startingReflection);
  const { userId, getToken } = useAuth();
  const [cameraStatus, setCameraStatus]: [boolean, Function] =
    useState<boolean>(false);

  useEffect(() => {
    setValue(startingReflection);
  }, [startingReflection]);

  function handleChange(newValue: string) {
    setValue(newValue);
  }

  async function handleTakePhoto(dataUri: any) {
    const base64Image = dataUri.split(",")[1];

    const token = await getToken({ template: "codehooks" });
    const response = await fetch(
      "https://backend-qsum.api.codehooks.io/dev/upload-image",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      }
    );
    const data = await response.json();
    const url = data.url;
    setValue(value + `<img src="${url}"/>`);

    setCameraStatus(!cameraStatus);
  }

  async function handleSave() {
    const token = await getToken({ template: "codehooks" });
    fetch(`https://backend-qsum.api.codehooks.io/dev/update-item/${placeId}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: itemName,
        reflection: value,
        userId: userId,
      }),
    });
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.blur} onClick={(e) => setIsVisible(!isVisible)}>
          <div
            className={styles.container}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h3>Reflection</h3>
              <MdClose
                className={styles.close}
                size="25px"
                onClick={(e) => setIsVisible(!isVisible)}
              />
            </div>
            <QuillWrapper value={value} onChange={handleChange} />
            <div className={styles.buttons}>
              <button
                className={styles.camera}
                onClick={(e) => setCameraStatus(!cameraStatus)}
              >
                Camera
                <MdCameraAlt size="18px" />
              </button>
              <button className={styles.save} onClick={handleSave}>
                Save
                <MdEditNote size="18px" />
              </button>
            </div>
          </div>
          {cameraStatus && (
            <div
              className={styles.blur}
              onClick={(e) => setCameraStatus(!cameraStatus)}
            >
              <div
                className={styles["camera-modal"]}
                onClick={(e) => e.stopPropagation()}
              >
                <Camera
                  onTakePhoto={(dataUri) => {
                    handleTakePhoto(dataUri);
                  }}
                  idealFacingMode = {FACING_MODES.ENVIRONMENT}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
