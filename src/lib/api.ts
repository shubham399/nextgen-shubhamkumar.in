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
} from "@/types";

const BASE_URL = process.env.API_URL || "http://localhost:3001";

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 3600 }, // cache for 1 hour
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const getMe = () => fetchAPI<Me>("/api/me");
export const getSocials = () => fetchAPI<Social[]>("/api/socials");
export const getContacts = () => fetchAPI<Contact[]>("/api/contacts");
export const getNav = () => fetchAPI<Nav>("/api/nav");
export const getExperience = () => fetchAPI<Experience[]>("/api/experience");
export const getSkills = () => fetchAPI<Skill[]>("/api/skills");
export const getServices = () => fetchAPI<Service[]>("/api/services");
export const getTestimonials = () => fetchAPI<Testimonial[]>("/api/testimonials");
export const getCertificates = () => fetchAPI<Certificate[]>("/api/certificates");
