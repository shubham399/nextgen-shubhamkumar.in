import {
  getMe,
  getSocials,
  getContacts,
  getNav,
  getExperience,
  getSkills,
  getServices,
  getTestimonials,
  getCertificates,
} from "@/lib/api";

import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ExperienceSection from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

// All data fetched in parallel on the server
export default async function Home() {
  const [me, socials, contacts, nav, experience, skills, services, testimonials, certificates] =
    await Promise.all([
      getMe(),
      getSocials(),
      getContacts(),
      getNav(),
      getExperience(),
      getSkills(),
      getServices(),
      getTestimonials(),
      getCertificates(),
    ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: me.name,
    url: "https://www.shubhkumar.in",
    image: me.avatarUrl,
    jobTitle: "Associate Lead Engineer",
    description: me.about,
    address: {
      "@type": "PostalAddress",
      addressLocality: me.location,
    },
    sameAs: socials.map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation me={me} nav={nav} socials={socials} />

      <main>
        <Hero me={me} socials={socials} nav={nav} experience={experience} />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <About me={me} contacts={contacts} experience={experience} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <ExperienceSection experiences={experience} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <Skills skills={skills} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <Services services={services} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <Testimonials testimonials={testimonials} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <Certificates certificates={certificates} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <Contact contacts={contacts} me={me} socials={socials} />
      </main>

      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
