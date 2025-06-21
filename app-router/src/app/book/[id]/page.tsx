import { BookData } from "@/types";
import styles from "./page.module.css";

export default async function Page({ params }: { params: Promise<{ id: string | string[] }> }) {
  const { id } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`);

  if (!response.ok) {
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
