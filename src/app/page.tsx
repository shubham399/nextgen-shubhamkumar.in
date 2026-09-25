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
import Divider from "@/components/ui/Divider";

function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Divider />
    </div>
  );
}

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
    jobTitle: me.about,
    description: me.summary,
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

      <main id="main-content">
        <Hero me={me} socials={socials} nav={nav} experience={experience} />

        <SectionDivider />
        <About me={me} contacts={contacts} experience={experience} />

        <SectionDivider />
        <ExperienceSection experiences={experience} />

        <SectionDivider />
        <Skills skills={skills} />

        <SectionDivider />
        <Services services={services} />

        <SectionDivider />
        <Testimonials testimonials={testimonials} />

        <SectionDivider />
        <Certificates certificates={certificates} />

        <SectionDivider />
        <Contact contacts={contacts} me={me} socials={socials} />
      </main>

      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
