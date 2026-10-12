import Nav from "@/components/Nav";
import Playground from "@/components/sections/Playground";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Stack from "@/components/Stack";
import Blogs from "@/components/Blogs";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { homeJsonLd } from "@/content/site";

export default function Home() {
  return (
    <main id="content">
      <Nav />
      <Playground />
      <About />
      <Projects />
      <Experience />
      <Stack />
      <Blogs />
      <Testimonials />
      <Faq />
      <Contact />
      <script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
    </main>
  );
}
