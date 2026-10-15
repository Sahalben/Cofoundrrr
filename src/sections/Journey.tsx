import { Container, Reveal, SwatchAccordion } from '../components/ui'
import type { SwatchItem } from '../components/ui/SwatchAccordion'

const stages: SwatchItem[] = [
  {
    title: 'People',
    description:
      'Discover your professional identity and make it visible. Showcase verified capabilities and projects rather than static job titles.',
    tags: 'Identity, Capabilities, Portfolio',
    color: '#1A3828',
    image: {
      src: 'https://framerusercontent.com/images/W1vHh9m78CQqEck7nFU4aEdqsWw.jpg',
      alt: 'People in the ecosystem',
    },
    button: 'Explore profiles',
    link: '#profiles',
  },
  {
    title: 'Teams',
    description:
      'Meet complementary collaborators and form around shared intent. Match on chemistry, skill gaps, and aligned commitment.',
    tags: 'Co-founders, Complementary Skills, Trust',
    color: '#224734',
    image: {
      src: 'https://framerusercontent.com/images/55pg3RZwwb6bZpDnzTRmAEHvhPA.jpg',
      alt: 'Teams collaborating',
    },
    button: 'Find collaborators',
    link: '#discovery',
  },
  {
    title: 'Projects',
    description:
      'Prove the partnership by building something real together. Take on authentic, community-validated problems before incorporating.',
    tags: 'Problem Box, Prototypes, Proof of Work',
    color: '#1E3E2E',
    image: {
      src: 'https://framerusercontent.com/images/UOfiwX1MqEHC0FC9UNmOF30LY.jpg',
      alt: 'Real world projects',
    },
    button: 'Explore problems',
    link: '#/problems',
  },
  {
    title: 'Startups',
    description:
      'Develop promising projects into ventures, backed by structured cohort programs and, over time, direct access to investment.',
    tags: 'Venture Formation, Bootcamps, Seed Capital',
    color: '#142C20',
    image: {
      src: 'https://framerusercontent.com/images/d5EaywqblJ9eH7URTE5IBMBX73g.jpg',
      alt: 'Startup ventures',
    },
    button: 'View programs',
    link: '#programs',
  },
]

export function Journey() {
  return (
    <section id="journey" className="bg-[#000000] text-mist">
      <Container className="py-24 lg:py-36">
        <Reveal delay={80} className="w-full">
          <div className="h-[520px] sm:h-[580px] lg:h-[620px] w-full">
            <SwatchAccordion
              items={stages}
              openItem={2}
              trigger="hover"
              numbers={true}
              scrim={true}
              radius="20px"
              gap="10px"
              textColor="#F0F7F4"
              buttonColor="#DDEEE6"
              buttonTextColor="#061810"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
