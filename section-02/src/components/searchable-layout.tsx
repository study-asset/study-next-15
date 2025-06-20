import style from "./searchable-layout.module.css";

import { useRouter } from "next/router";
import { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useState } from "react";

export default function SearchableLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const q = router.query.q as string;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSearch = () => {
    if (!search || q === search) return;
    router.push(`search?q=${search}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      onSearch();
    }
  };

  useEffect(() => {
    setSearch(q || "");
  }, [q]);

  return (
    <div>
      <div className={style.searchbar_container}>
        <input
          value={search}
          placeholder="검색어를 입력해 주세요."
          onChange={onChange}
          onKeyDown={onKeyDown}
        ></input>
        <button onClick={onSearch}>검색</button>
      </div>
      {children}
    </div>
  );
}
