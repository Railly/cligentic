import { Footer } from "./components/footer";
import { AgentDemo } from "./sections/agent-demo";
import { Clusters } from "./sections/clusters";
import { Hero } from "./sections/hero";
import { HowItWorks } from "./sections/how-it-works";
import { Skills } from "./sections/skills";
import { Why } from "./sections/why";

/**
 * cligentic landing — composition only, zero markup here.
 * Each section owns its own layout and copy. Reorder freely.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Skills />
      <Why />
      <HowItWorks />
      <AgentDemo />
      <Clusters />
      <Footer />
    </main>
  );
}
