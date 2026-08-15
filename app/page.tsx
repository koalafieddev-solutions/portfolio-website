import { Navbar } from "../components/sections/Navbar"
import { Hero } from "../components/sections/Hero"
import { StatsBar } from "../components/sections/StatsBar"
import { ProjectGrid } from "../components/sections/ProjectGrid"
import { ScrollRow } from "../components/sections/ScrollRow"
import { Timeline } from "../components/sections/Timeline"
import { Education } from "../components/sections/Education"
import { Profile, ProfileCategory } from "../components/sections/Profile"
import { ContactButton } from "../components/ui/ContactButton"
import { SectionHeading } from "../components/ui/SectionHeading"
import { AmbientBackground } from "../components/ui/AmbientBackground"
import { color, space, font, radius, layout } from "../lib/theme"
import { glassSurface } from "../lib/glass"
import products from "../content/products.json"
import videos from "../content/videos.json"
import timeline from "../content/timeline.json"
import education from "../content/education.json"
import profile from "../content/profile.json"

const stats = [
  { value: "5", label: "Commercial Unreal Engine Assets" },
  { value: "255,641", label: "Units Shipped" },
  { value: "26", label: "Tutorials & Devlogs Published" },
  { value: "10+", label: "Years of Unreal Engine Experience" },
]

const navLinks = [
  { label: "Profile", href: "#profile" },
  { label: "Story", href: "#story" },
  { label: "Education", href: "#education" },
  { label: "Products", href: "#products" },
  { label: "Tutorials", href: "#tutorials" },
  { label: "Contact", href: "#contact" },
]

const tutorialVideos = videos.filter((v) => v.tag === "Tutorial")
const setupGuideVideos = videos.filter((v) => v.tag === "Setup Guide")
const otherVideos = videos.filter((v) => v.tag !== "Tutorial" && v.tag !== "Setup Guide")

const offerings = ["Contract Work", "Marketplace Assets", "Custom Solutions", "Tooling & Pipelines"]

const contactEmail = "koalafieddev@gmail.com"
const contactDiscord = "scqdevelopers"

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <AmbientBackground />
      <Navbar brand="Koalafied Dev" links={navLinks} />

      <Hero
        eyebrow="Unreal Engine Developer · Aerospace Engineer · Koalafied Dev"
        headline="Hi, I'm Simon Cura — I build systems that have to work."
        subhead="I've just earned my B.S. in Aerospace Engineering (Astronautics Option) from Embry-Riddle Aeronautical University — and I'm now going full-time into Unreal Engine development. 10+ years building in the engine, five commercial marketplace assets shipped, one of which Epic featured for free and put in front of 255,000+ developers. Same instinct carries over: design the system, model every edge case, ship something that holds up."
      />

      <StatsBar kicker="By the Numbers" items={stats} />

      <div style={{ height: space.xl }} />

      <div id="profile">
        <Profile
          heading="Profile"
          subheading="Same identity, three views — skills, services, and the highlights that tie back to it."
          identity={profile.identity}
          categories={profile.categories as ProfileCategory[]}
        />
      </div>

      <div style={{ height: space.md }} />

      <div id="story">
        <Timeline
          heading="The Story So Far"
          subheading="Aerospace engineering by degree, Unreal Engine developer by habit — how five commercial assets and a quarter-million units happened alongside it."
          entries={timeline}
        />
      </div>

      <div style={{ height: space.md }} />

      <div id="education">
        <Education
          heading="Education"
          subheading="A B.S. in Aerospace Engineering (Astronautics Option), now complete — the same systems-first thinking behind everything above."
          data={education}
        />
      </div>

      <div style={{ height: space.md }} />

      <section
        style={{
          maxWidth: layout.maxWidth,
          margin: "0 auto",
          padding: `${space.lg}px`,
          fontFamily: font.family,
        }}
      >
        <SectionHeading heading="Currently" subheading="A snapshot of where my time is going right now." />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: space.lg,
            ...glassSurface(),
            borderRadius: radius.lg,
            padding: space.lg,
          }}
        >
          <div style={{ flex: "0 0 auto", minWidth: 160, textAlign: "center" }}>
            <div
              style={{
                fontFamily: font.mono,
                color: color.signalHover,
                fontSize: font.size.xxl,
                fontWeight: font.weight.semibold,
              }}
            >
              3
            </div>
            <div
              style={{
                color: color.textFaint,
                fontSize: font.size.xs,
                fontWeight: font.weight.medium,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginTop: space.xxs,
              }}
            >
              Active Engagements
            </div>
          </div>

          <div
            style={{
              flex: "1 1 320px",
              color: color.textMuted,
              fontSize: font.size.md,
              lineHeight: 1.6,
            }}
          >
            I'm currently balancing <strong style={{ color: color.text }}>3 active client engagements</strong>{" "}
            spanning Unreal Engine contract development and ongoing marketplace asset support, alongside
            continued work on new commercial assets and tutorials.{" "}
            <a href="#contact" style={{ color: color.accentHover, fontWeight: font.weight.semibold }}>
              Get in touch
            </a>{" "}
            if you'd like to talk about availability for new work.
          </div>
        </div>
      </section>

      <div id="products">
        <ProjectGrid
          heading="Commercial Unreal Engine Assets"
          subheading="Five modular systems sold on the Unreal Engine Marketplace and Fab, used by other developers to ship their own projects faster — including one Epic gave away for free to 255,000+ developers."
          projects={products}
          columns={3}
          featuredIndex={0}
          sectionIndex="04"
        />
      </div>

      <div id="tutorials">
        <ScrollRow
          heading="Tutorials"
          subheading="Character systems, combat, environment art, and UE5 fundamentals — scroll for more."
          items={tutorialVideos}
          sectionIndex="05"
        />
        <ScrollRow heading="Setup Guides" items={setupGuideVideos} />
        <ScrollRow heading="Teasers, Devlogs & Demos" items={otherVideos} />
      </div>

      <section
        id="contact"
        style={{
          position: "relative",
          maxWidth: layout.maxWidth,
          margin: `${space.xl}px auto`,
          padding: `clamp(40px, 10vw, ${space.xxl}px) clamp(20px, 6vw, ${space.lg}px)`,
          textAlign: "center",
          ...glassSurface(true),
          borderRadius: radius.lg,
          fontFamily: font.family,
          overflow: "hidden",
        }}
      >
        <h2
          className="hero-cta-title"
          style={{
            margin: 0,
            marginBottom: space.xs,
            fontFamily: font.display,
            fontSize: font.size.xl,
            fontWeight: font.weight.semibold,
            letterSpacing: -0.5,
          }}
        >
          Let's build something.
        </h2>
        <p
          style={{
            margin: "0 auto",
            marginBottom: space.lg,
            maxWidth: 480,
            color: color.textMuted,
            fontSize: font.size.sm,
            lineHeight: 1.6,
          }}
        >
          Available for Unreal Engine contract work, marketplace collaborations, and custom solutions built
          to your project's spec. If it needs to be modular, replicated, or just actually work — that's the job.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: space.sm,
            marginBottom: space.lg,
          }}
        >
          {offerings.map((offering, index) => {
            const accentColor = index % 2 === 0 ? color.accent : color.signal
            return (
              <span
                key={offering}
                style={{
                  padding: `${space.xxs + 1}px ${space.sm}px`,
                  borderRadius: radius.pill,
                  border: `1px solid ${accentColor}33`,
                  backgroundColor: `${accentColor}14`,
                  color: color.textMuted,
                  fontSize: font.size.xs,
                  fontWeight: font.weight.medium,
                }}
              >
                {offering}
              </span>
            )
          })}
        </div>
        <ContactButton email={contactEmail} discord={contactDiscord} />
      </section>

      <footer
        style={{
          borderTop: `1px solid ${color.border}`,
          fontFamily: font.family,
        }}
      >
        <div
          style={{
            maxWidth: layout.maxWidth,
            margin: "0 auto",
            padding: `${space.lg}px`,
            textAlign: "center",
            color: color.textFaint,
            fontSize: font.size.xs,
          }}
        >
          © {new Date().getFullYear()} Simon Cura — Koalafied Dev
        </div>
      </footer>
    </main>
  )
}
