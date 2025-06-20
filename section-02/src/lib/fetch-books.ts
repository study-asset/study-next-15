import type { BookData } from "@/types";

export default async function fetchBooks(q?: string): Promise<BookData[]> {
  let url = "https://onebite-books-server-nsj318ww7-jiwoos-projects-25dae85c.vercel.app/book";

  if (q) {
    url += `/search?q=${q}`;
  }

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
