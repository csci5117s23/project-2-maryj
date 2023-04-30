import styles from "@/styles/Input.module.css";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

interface InputProps {
  placeId: string;
  placeholder: string;
  id: string;
  name: string;
  addMenuItem: Function;
}

export default function Input({ placeId, placeholder, id, name, addMenuItem }: InputProps) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = inputValue;
    setInputValue("");
    addMenuItem(value);


    const token = await getToken({ template: "codehooks" });
    const response = await fetch(
      `https://backend-qsum.api.codehooks.io/dev/add-item/${placeId}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          name: value
        }),
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder={placeholder}
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
}
