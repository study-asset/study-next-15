import styles from "./page.module.css";

import { notFound } from "next/navigation";

import { BookData } from "@/types";

// export const dynamicParams = false; 다이나믹 설정을 비활성화하면서 새로운 경로는 생성하지 않음

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function Page({ params }: { params: Promise<{ id: string | string[] }> }) {
  const { id } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }

    return <div>문제가 발생했습니다.</div>;
  }

  const book: BookData = await response.json();

  const { coverImgUrl, title, subTitle, author, publisher, description } = book;

  return (
    <div className={styles.container}>
      <div
        className={styles.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.subTitle}>{subTitle}</div>
      <div className={styles.author}>
        {author} | {publisher}
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}
