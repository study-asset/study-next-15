import { useRouter } from "next/router";

export default function Page() {
  const {
    query: { q },
  } = useRouter();

  return <h1>{q}</h1>;
}
