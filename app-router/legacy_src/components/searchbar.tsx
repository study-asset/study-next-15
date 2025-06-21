"use client";

import styles from "./searchbar.module.css";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Searchbar() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSearch = () => {
    if (search === "") return;
    router.push(`/search?q=${search}`);
  };

  return (
    <div className={styles.container}>
      <input type="text" value={search} onChange={onChange} />
      <button onClick={onSearch}>검색</button>
    </div>
  );
}
