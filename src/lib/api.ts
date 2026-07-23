import type {
  Me,
  Social,
  Contact,
  Nav,
  Experience,
  Skill,
  Service,
  Testimonial,
  Certificate,
  Workout,
  WorkoutSummary,
  DailyViewsResponse,
  BlogViewsSummary,
} from "@/types";

const BASE_URL = process.env.API_URL || "http://localhost:3001";

interface FetchAPIOptions {
  method?: "GET" | "POST";
  bypassCache?: boolean;
}

async function fetchAPI<T>(path: string, options?: FetchAPIOptions): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const secret = process.env.INTERNAL_SECRET_VALUE;
  if (secret) {
    headers["x-internal-secret"] = secret;
  }

  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    method: options?.method ?? "GET",
    headers,
  };

  if (options?.bypassCache) {
    fetchOptions.cache = "no-store";
  } else {
    fetchOptions.next = { revalidate: 600 };
  }

  const res = await fetch(`${BASE_URL}${path}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export type { FetchAPIOptions };
export { BASE_URL, fetchAPI };

export const getMe = () => fetchAPI<Me>("/api/me");
export const getSocials = () => fetchAPI<Social[]>("/api/socials");
export const getContacts = () => fetchAPI<Contact[]>("/api/contacts");
export const getNav = () => fetchAPI<Nav>("/api/nav");
export const getExperience = () => fetchAPI<Experience[]>("/api/experience");
export const getSkills = () => fetchAPI<Skill[]>("/api/skills");
export const getServices = () => fetchAPI<Service[]>("/api/services");
export const getTestimonials = () => fetchAPI<Testimonial[]>("/api/testimonials");
export const getCertificates = () => fetchAPI<Certificate[]>("/api/certificates");
export const getWorkouts = () => fetchAPI<Workout[]>("/api/workouts");
export const getWorkoutSummary = () => fetchAPI<WorkoutSummary>("/api/workouts/summary");

export const getDailyViews = () => fetchAPI<DailyViewsResponse>("/api/blog/views/daily");

export const getBlogViewsSummary = () => fetchAPI<BlogViewsSummary>("/api/blog/views/summary");
