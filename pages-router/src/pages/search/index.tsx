import SearchableLayout from "@/components/searchable-layout";
import { ReactNode, useEffect, useState } from "react";
import BookItem from "@/components/book-item";
// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import { BookData } from "@/types";
import { useRouter } from "next/router";
import Head from "next/head";

// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//   const q = context.query.q;
//   const books = await fetchBooks(q as string);

//   return { props: { books } };
// };

// export default function Page({ books }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   return (
//     <div>
//       {books.map((book) => (
//         <BookItem key={book.id} {...book} />
//       ))}
//     </div>
//   );
// }

export default function Page() {
  const [books, setBooks] = useState<BookData[]>([]);

  const router = useRouter();
  const q = router.query.q;

  const fetchSearch = async () => {
    const data = await fetchBooks(q as string);
    setBooks(data);
  };

  useEffect(() => {
    if (q) fetchSearch();
  }, [q]);

  return (
    <>
      <Head>
        <title>한입북스 - 검색결과</title>
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:title" content="한입북스 - 검색결과" />
        <meta property="og:description" content="한입북스에 등록된 도서들을 만나보세요." />
      </Head>
      <div>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </div>
    </>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{[page]}</SearchableLayout>;
};
