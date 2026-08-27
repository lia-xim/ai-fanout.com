export const libraryCategories = ["Concept", "Measurement", "Method", "Data standard", "Field guide"] as const;
export type LibraryCategory = typeof libraryCategories[number];
export type LibrarySection = { readonly id:string; readonly title:string; readonly paragraphs:readonly string[]; readonly points?:readonly string[] };
export type LibraryArticle = { readonly slug:string; readonly number:string; readonly category:LibraryCategory; readonly title:string; readonly shortTitle:string; readonly description:string; readonly primaryIntent:string; readonly answer:string; readonly useWhen:string; readonly reviewedAt:string; readonly sections:readonly LibrarySection[]; readonly sourceIds:readonly string[]; readonly relatedSlugs:readonly string[]; readonly pairedSlug?:string; readonly image?:string; readonly imageAlt?:string };
import { englishArticles } from "./observed-query-articles";
export const libraryArticles = englishArticles;
export const libraryBySlug = new Map(libraryArticles.map(article => [article.slug, article]));
export const libraryGroups = libraryCategories.map(category => ({ category, articles:libraryArticles.filter(article => article.category===category) })).filter(group => group.articles.length>0);
