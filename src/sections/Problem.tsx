import { Container, Reveal } from '../components/ui'

const problems = [
  {
    title: 'Talent is invisible.',
    body: 'Résumés flatten people into job titles. The capabilities that matter to a new venture rarely show up.',
  },
  {
    title: 'Ideas stall without teams.',
    body: 'Many promising ideas never get past the first founder, for lack of a complementary second or third person.',
  },
  {
    title: 'Networks are closed.',
    body: 'Finding collaborators still depends on who you already know, not on who you could build well with.',
  },
]

export function Problem() {
  return (
    <section id="problem" className="bg-forest text-mist">
      <Container className="py-24 lg:py-36">
        <Reveal as="h2" className="max-w-4xl text-headline font-semibold">
          Great companies start with great teams. <span className="text-mist/40">Finding that team is still left to chance.</span>
        </Reveal>

        <div className="mt-20 grid border-t border-line-dark md:grid-cols-3 lg:mt-28">
          {problems.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 100}
              className="border-b border-line-dark py-10 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <span className="text-sm tabular-nums text-mint/60">0{i + 1}</span>
              <h3 className="mt-6 text-title font-semibold">{p.title}</h3>
              <p className="mt-4 max-w-sm leading-relaxed text-mist/65">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
