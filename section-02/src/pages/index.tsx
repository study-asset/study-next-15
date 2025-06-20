import SearchableLayout from "@/components/searchable-layout";
import style from "./index.module.css";

import type { ReactNode } from "react";

import BookItem from "@/components/book-item";
// import { InferGetServerSidePropsType } from "next";
import type { InferGetStaticPropsType } from "next";
import Head from "next/head";

import fetchBooks from "@/lib/fetch-books";
import fetchRandomBooks from "@/lib/fetch-random-books";

// export const getServerSideProps = async () => {
//   // 컴포넌트보다 먼저 실행 후, 컴포넌트에 필요한 데이터를 불러오는 함수 ( SSR 방식 )
//   const [allBooks, recoBooks] = await Promise.all([fetchBooks(), fetchRandomBooks()]);

//   return {
//     props: { allBooks, recoBooks },
//   };
// };

// export default function Home({
//   allBooks,
//   recoBooks,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   return (
//     <div className={style.container}>
//       <section>
//         <h3>지금 추천하는 도서</h3>
//         {recoBooks.map((book) => (
//           <BookItem key={book.id} {...book} />
//         ))}
//       </section>
//       <section>
//         <h3>등록된 모든 도서</h3>
//         {allBooks.map((book) => (
//           <BookItem key={book.id} {...book} />
//         ))}
//       </section>
//     </div>
//   );
// }

export const getStaticProps = async () => {
  // 컴포넌트보다 먼저 실행 후, 컴포넌트에 필요한 데이터를 불러오는 함수 ( SSR 방식 )
  const [allBooks, recoBooks] = await Promise.all([fetchBooks(), fetchRandomBooks()]);

  return {
    props: { allBooks, recoBooks },
    // revalidate: 3,
  };
};

export default function Home({
  allBooks,
  recoBooks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>한입북스</title>
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:title" content="한입북스" />
        <meta property="og:description" content="한입북스에 등록된 도서들을 만나보세요." />
      </Head>
      <div className={style.container}>
        <section>
          <h3>지금 추천하는 도서</h3>
          {recoBooks.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </section>
        <section>
          <h3>등록된 모든 도서</h3>
          {allBooks.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </section>
      </div>
    </>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
