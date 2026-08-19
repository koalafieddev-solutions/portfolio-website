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
import { Button } from "../components/ui/Button"
import { CornerBrackets } from "../components/ui/CornerBrackets"
import { color, space, font, radius, layout } from "../lib/theme"
import { glassSurface } from "../lib/glass"
import products from "../content/products.json"
import softwareProjects from "../content/software-projects.json"
import videos from "../content/videos.json"
import timeline from "../content/timeline.json"
import education from "../content/education.json"
import profile from "../content/profile.json"

const stats = [
  { value: "5", label: "Commercial Unreal Engine Assets", accent: color.accentCyan },
  { value: "255,641", label: "Units Shipped", accent: color.accentMint },
  { value: "26", label: "Tutorials & Devlogs Published", accent: color.accentViolet },
  { value: "10+", label: "Years of Unreal Engine Experience", accent: color.accentAmber },
]

const navLinks = [
  { label: "Profile", href: "#profile" },
  { label: "Story", href: "#story" },
  { label: "Education", href: "#education" },
  { label: "Products", href: "#products" },
  { label: "Software", href: "#software-projects" },
  { label: "Tutorials", href: "#tutorials" },
  { label: "Contact", href: "#contact" },
]

const tutorialVideos = videos.filter((v) => v.tag === "Tutorial")
const setupGuideVideos = videos.filter((v) => v.tag === "Setup Guide")
const otherVideos = videos.filter((v) => v.tag !== "Tutorial" && v.tag !== "Setup Guide")

const offerings = [
  { label: "Contract Work", accent: color.accentCyan },
  { label: "Marketplace Assets", accent: color.accentMint },
  { label: "Custom Solutions", accent: color.accentViolet },
  { label: "Tooling & Pipelines", accent: color.accentAmber },
]

const contactEmail = "koalafieddev@gmail.com"
const contactDiscord = "scqdevelopers"

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <AmbientBackground />
      <Navbar brand="Koalafied Dev" links={navLinks} ctaLabel="Contact" ctaHref="#contact" />

      <Hero
        eyebrow="Unreal Engine Developer · Aerospace Engineer · Koalafied Dev"
        headline={
          <>
            Hi, I&rsquo;m Simon Cura — I build{" "}
            <span
              style={{
                backgroundImage: `linear-gradient(90deg, ${color.accentCyan}, ${color.accentMint})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              systems that have to work
            </span>
            .
          </>
        }
        subhead="I've just earned my B.S. in Aerospace Engineering (Astronautics Option) from Embry-Riddle Aeronautical University — and I'm now going full-time into Unreal Engine development. 10+ years building in the engine, five commercial marketplace assets shipped, one of which Epic featured for free and put in front of 255,000+ developers. Same instinct carries over: design the system, model every edge case, ship something that holds up."
      >
        <Button label="View My Work" href="#products" variant="primary" />
        <Button label="Get In Touch" href="#contact" variant="secondary" />
      </Hero>

      <StatsBar kicker="By the Numbers" items={stats} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: `${space.lg}px auto`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: space.xs,
            color: color.textMuted,
            fontFamily: font.mono,
            fontSize: font.size.xs,
            fontWeight: font.weight.medium,
            letterSpacing: font.tracking.label,
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: color.accentCyan,
              boxShadow: `0 0 6px 1px ${color.accentCyan}80`,
              flexShrink: 0,
            }}
          />
          Based out of{" "}
          <span style={{ color: color.accentCyan, fontWeight: font.weight.semibold }}>Miami, FL</span>
        </div>
      </div>

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
        <SectionHeading
          heading="Currently"
          subheading="A snapshot of where my time is going right now."
          index="04"
          accent={color.accentAmber}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: space.sm,
            maxWidth: 640,
            margin: "0 auto",
            ...glassSurface(),
            borderRadius: radius.sm,
            padding: `${space.xl}px ${space.lg}px`,
          }}
        >
          <CornerBrackets corners={["tr", "bl"]} />

          <div
            style={{
              fontFamily: font.mono,
              color: color.accentAmber,
              fontSize: font.size.xxl,
              fontWeight: font.weight.semibold,
              lineHeight: 1,
            }}
          >
            3
          </div>
          <div
            style={{
              color: color.textFaint,
              fontFamily: font.mono,
              fontSize: font.size.xs,
              fontWeight: font.weight.medium,
              textTransform: "uppercase",
              letterSpacing: font.tracking.label,
              marginBottom: space.sm,
            }}
          >
            Active Engagements
          </div>

          <div
            style={{
              color: color.textMuted,
              fontSize: font.size.md,
              lineHeight: 1.6,
            }}
          >
            I'm currently balancing <strong style={{ color: color.accentAmber }}>3 active client engagements</strong>{" "}
            spanning Unreal Engine contract development and ongoing marketplace asset support, alongside
            continued work on new commercial assets and tutorials.{" "}
            <a href="#contact" style={{ color: color.accentCyan, fontWeight: font.weight.semibold }}>
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
          sectionIndex="05"
        />
      </div>

      <div id="software-projects">
        <ProjectGrid
          heading="Recent Software Projects"
          subheading="Self-directed systems and simulation work — the technical playground where new mechanics get prototyped before anything ships in commercial work."
          projects={softwareProjects}
          columns={3}
          sectionIndex="06"
          showItemIndex={false}
        />
      </div>

      <div id="tutorials">
        <ScrollRow
          heading="Tutorials"
          subheading="Character systems, combat, environment art, and UE5 fundamentals — scroll for more."
          items={tutorialVideos}
          sectionIndex="07"
          accent={color.accentViolet}
        />
        <ScrollRow heading="Setup Guides" items={setupGuideVideos} accent={color.accentAmber} />
        <ScrollRow heading="Teasers, Devlogs & Demos" items={otherVideos} accent={color.accentMint} />
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
          borderRadius: radius.sm,
          fontFamily: font.family,
        }}
      >
        <CornerBrackets corners={["tr", "bl", "br"]} />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: space.xs,
            marginBottom: space.xs,
          }}
        >
          <span
            style={{
              fontFamily: font.mono,
              color: color.accentMint,
              fontSize: font.size.xs,
              letterSpacing: font.tracking.label,
            }}
          >
            08
          </span>
          <span style={{ width: 20, height: 1, backgroundColor: color.borderStrong }} />
        </div>

        <h2
          className="gradient-sheen-text"
          style={{
            margin: 0,
            marginBottom: space.xs,
            fontFamily: font.display,
            fontSize: font.size.xl,
            fontWeight: font.weight.semibold,
            letterSpacing: font.tracking.heading,
            textTransform: "uppercase",
          }}
        >
          Let&rsquo;s build something.
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
          {offerings.map((offering) => (
            <span
              key={offering.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: space.xxs,
                padding: `${space.xxs + 1}px ${space.sm}px`,
                border: `1px solid ${offering.accent}4D`,
                color: offering.accent,
                fontFamily: font.mono,
                fontSize: font.size.xs,
                fontWeight: font.weight.medium,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: offering.accent,
                  boxShadow: `0 0 6px 1px ${offering.accent}80`,
                  flexShrink: 0,
                }}
              />
              {offering.label}
            </span>
          ))}
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
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: space.xs,
            width: "100%",
            maxWidth: layout.maxWidth,
            margin: "0 auto",
            padding: `${space.lg}px`,
            textAlign: "center",
            color: color.textFaint,
            fontSize: font.size.xs,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              border: `1px solid ${color.textFaint}`,
              flexShrink: 0,
            }}
          />
          <span>
            <span style={{ fontFamily: font.mono }}>© {new Date().getFullYear()}</span> Simon Cura — Koalafied Dev
          </span>
        </div>
      </footer>
    </main>
  )
}
