import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const onClick = () => {
    router.push("/test");
  };

  useEffect(() => {
    router.prefetch("/test");
  }, []);

  return (
    <>
      <header>
        <Link href={"/"}>Index</Link>
        &nbsp;
        <Link href={"/search?q=1"} prefetch={false}>
          Search
        </Link>
        &nbsp;
        <Link href={"/book/1"}>Book</Link>
        <div>
          <button onClick={onClick}>/test 페이지</button>
        </div>
      </header>
      <Component {...pageProps} />
    </>
  );
}
