import React, { useState, useMemo, useEffect, useRef, forwardRef } from "react";
import styles from "@/styles/ReflectionModal.module.css";
import QuillWrapper from "@/components/QuillWrapper";


export interface ReflectionModalProps {
  isVisible: boolean;
}

export default function ReflectionModal({ isVisible }: ReflectionModalProps) {
  const [value, setValue] = useState("");

  function handleChange(newValue: string) {
    setValue(newValue);
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.blur}>
          <div className={styles.container}>
            <QuillWrapper value={value} onChange={handleChange} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
