import styles from '@/styles/Input.module.css';

interface InputProps {
  placeholder: string,
  id: string,
  name: string
}

export default function Input({ placeholder, id, name }: InputProps) {
  return (
    <form action="/" method="post">
      <input className={styles.input} placeholder={placeholder} type="text" id={id} name={name} />
    </form>
  )
}