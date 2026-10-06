// What the site says about itself to machines: structured data (JSON-LD) for
// search engines, and /llms.txt for AI tools. Both are built from the same data
// as the page (the tour, the parts, the store statuses, the CV), so they can't
// drift from what visitors read.
import { FRUNT_PUBLISHED } from '@/case-studies/flags'
import { cv } from '@/data/cv'
import { appStatus, statusText, type AppKey } from '@/workbench/apps'
import { FRUNT_PARTS, MGK_PARTS, type Part } from '@/workbench/products'
import { LINKS, SKILLS_INSTALL, stops } from '@/workbench/stops'
import { SKILLS, skillText } from '@/workbench/skills-data'

export const SITE = 'https://matthewkay.dev'
export const TITLE = 'Matthew Kay · Product engineer'
export const DESCRIPTION = 'I design and build polished apps, end to end: frunt, MGKFitness and the studio behind them, MGKCodes.'

const APPS: AppKey[] = ['frunt', 'run', 'lift']
const PERSON = `${SITE}/#person`
const STUDIO = `${SITE}/#mgkcodes`

/** "TypeScript", "Supabase", … from the CV's skills, without the parenthesised detail. */
const skills = () => [...new Set(cv.skills.flatMap((g) => g.items.replace(/\s*\([^)]*\)/g, '').split(',').map((s) => s.trim()).filter(Boolean)))]

export function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', '@id': `${SITE}/#page`, url: `${SITE}/`, name: TITLE, description: DESCRIPTION, inLanguage: 'en-GB', mainEntity: { '@id': PERSON } },
      {
        '@type': 'Person', '@id': PERSON, name: cv.name, jobTitle: cv.headline, description: cv.profile,
        url: `${SITE}/`, image: `${SITE}/work/headshot.webp`, email: `mailto:${LINKS.email}`,
        address: { '@type': 'PostalAddress', addressLocality: cv.location.split(',')[0], addressCountry: 'GB' },
        sameAs: [LINKS.github, LINKS.linkedin, LINKS.x],
        worksFor: { '@id': STUDIO }, knowsAbout: skills(),
      },
      { '@type': 'Organization', '@id': STUDIO, name: 'MGKCodes', url: LINKS.mgkcodes, founder: { '@id': PERSON } },
      ...APPS.map((key) => {
        const s = appStatus(key)
        const os = [s.apple && 'iOS', s.google && 'Android'].filter(Boolean).join(', ')
        return {
          '@type': 'SoftwareApplication', name: s.label, url: s.web,
          applicationCategory: key === 'frunt' ? 'BusinessApplication' : 'HealthApplication',
          ...(os && { operatingSystem: os }), ...((s.apple || s.google) && { downloadUrl: s.apple ?? s.google }),
          creator: { '@id': PERSON }, publisher: { '@id': STUDIO },
        }
      }),
    ],
  }
}

const partLine = (p: Part) => `- **${p.name}** (${p.status}): ${p.line} Built with ${p.tech.replace(/ · /g, ', ')}.`

/** The site as plain Markdown, following the llms.txt convention (llmstxt.org). */
export function llmsText(): string {
  const apps = APPS.map((key) => {
    const s = appStatus(key)
    const where = [s.apple && `[App Store](${s.apple})`, s.google && `[Google Play](${s.google})`].filter(Boolean).join(', ')
    return `- [${s.label}](${s.web}): ${statusText(s)}.${where ? ` On ${where}.` : ''}`
  })
  const tour = stops.map((s) => [`### ${s.nav}`, '', s.title, ...(s.body ? ['', s.body] : [])].join('\n'))
  return [
    `# ${cv.name}`,
    '',
    `> ${cv.headline} in ${cv.location}. ${DESCRIPTION} This is the text version of ${SITE}, a portfolio built as one board of shipped work.`,
    '',
    cv.profile,
    '',
    '## Apps',
    '',
    ...apps,
    '',
    '## frunt, part by part',
    '',
    ...FRUNT_PARTS.map(partLine),
    '',
    '## MGKFitness, part by part',
    '',
    ...MGK_PARTS.map(partLine),
    '',
    '## The tour',
    '',
    'The site is one board that a camera moves across as you scroll. This is the text of each stop.',
    '',
    tour.join('\n\n'),
    '',
    '## My Claude Code skills',
    '',
    `Open source, each one tested with Claude Code's evals. Install: \`${SKILLS_INSTALL}\``,
    '',
    ...SKILLS.map((k) => `- ${skillText(k)}`),
    '',
    '## CV and links',
    '',
    `- [CV](${SITE}/cv/): the full CV as a web page, also as a [PDF](${SITE}/cv.pdf)`,
    ...(FRUNT_PUBLISHED ? [`- [frunt case study](${SITE}/work/frunt/): why I built it, the decisions, what went wrong and what I learnt`] : []),
    `- [GitHub](${LINKS.github})`,
    `- [LinkedIn](${LINKS.linkedin})`,
    `- [X](${LINKS.x})`,
    `- [MGKCodes](${LINKS.mgkcodes}), the studio behind frunt and MGKFitness`,
    `- [Claude Code skills](${LINKS.skills}) I build for my own workflow. Install: \`${SKILLS_INSTALL}\``,
    `- Email: ${LINKS.email}`,
    '',
  ].join('\n')
}
