export interface Me {
  cal: string;
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  avatarUrl: string;
  personalWebsiteUrl: string;
  cta: {
    message: string;
    btn: string;
  };
}

export interface Social {
  href: string;
  name: string;
  icon: string;
  username?: string;
}

export interface Contact {
  icon: string;
  title: string;
  href?: string;
  text: string;
}

export interface Nav {
  cal: string;
  resume: string;
  footer_note?: string;
}

export interface Experience {
  company: string;
  link: string;
  badges: string[];
  title: string;
  location: string;
  logo: string;
  start: string;
  end: string | null;
  description: string[];
  skip?: boolean;
}

export interface SkillIcon {
  light: string;
  dark: string;
}

export interface Skill {
  href: string;
  icon: SkillIcon | string;
  skill: string;
  category: string;
}

export interface Service {
  title: string;
  icon: string;
  description: string;
}

export interface Testimonial {
  avatar: string;
  name: string;
  date: string;
  text: string;
  destination: string;
  link: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  issuerIcon: string;
  issuedAt: string;
  link: string;
}

export interface Workout {
  workout: string;
  type: string;
  durationMinutes: number;
  createdAt: string;
}

export interface WorkoutSummary {
  lastWorkout: {
    daysAgo: number;
    type: string;
  };
  percentDays: number;
  totalWorkouts: number;
  streakWeeks: number;
  totalDurationMinutes: number;
  totalVolumeKg: number;
  totalSets: number;
  preferredTimeOfDay: string;
  calendar: Record<string, string>;
}

export interface DailyViewsResponse {
  days: { date: string; views: number }[];
}

export interface BlogViewsSummary {
  total: number;
  daily: Record<string, number>;
}
