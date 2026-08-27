import type { LibraryArticle, LibraryCategory } from "./library";
export { englishArticles } from "./observed-query-articles.en";
export { germanArticles } from "./observed-query-articles.de";

export const groupsFor = (articles: readonly LibraryArticle[]) =>
  (["Concept", "Measurement", "Method", "Data standard", "Field guide"] as readonly LibraryCategory[])
    .map((category) => ({ category, articles: articles.filter((article) => article.category === category) }))
    .filter((group) => group.articles.length);
