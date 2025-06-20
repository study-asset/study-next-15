import { BookData } from "@/types";

export default async function fetchOneBook(id: number): Promise<BookData | null> {
  const url = `https://onebite-books-server-nsj318ww7-jiwoos-projects-25dae85c.vercel.app/book/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
