import { useRouter } from "next/router";

export default function Page() {
  const {
    query: { id },
  } = useRouter();

  return <h1>Book id : {id}</h1>;
}
