import { BookData } from "@/types";

export default async function fetchRandomBooks(): Promise<BookData[]> {
  const url =
    "https://onebite-books-server-nsj318ww7-jiwoos-projects-25dae85c.vercel.app/book/random";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
