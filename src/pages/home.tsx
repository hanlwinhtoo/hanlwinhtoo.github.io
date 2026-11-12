import type {ReactNode} from 'react';
import {Button} from '@/components/sodium/ui/button';
import {CopyButton} from '@/components/sodium/ui/copy-button';
import {DataList, DataListItem, DataListLabel, DataListValue} from '@/components/sodium/ui/data-list';
import {Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemLink, ItemMeta, ItemTitle} from '@/components/sodium/ui/item';
import {Status} from '@/components/sodium/ui/status';
import {Tag} from '@/components/sodium/ui/tag';
import {ArrowRight, Icon, Launch} from '@/components/sodium/icon';
import {SiteShell} from '@/components/site/site-shell';
import {SingaporeTime} from '@/components/site/singapore-time';
import {ThemeToggle} from '@/components/site/theme-toggle';
import {certifications, education, type Entry, person, projects, skills, volunteering} from '@/content/resume';

// The home page reads like a one-page resume: who, then short ruled sections.
// Each row is a name, one line and a date; the detail lives on the case-study pages and in resume.pdf.

function Hero() {
  return <section aria-label="Introduction" className="flex flex-col gap-6 pt-16 pb-10 lg:pt-20">
    <Status status="ok">{person.availability}</Status>
    <div className="flex flex-col gap-3">
      <h1 className="type-display whitespace-nowrap">{person.name}</h1>
      <p className="max-w-measure type-heading-sm text-text-2">{person.headline}</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button nativeButton={false} render={<a href={person.resume} target="_blank" rel="noopener"/>}>View résumé</Button>
      <Button variant="secondary" nativeButton={false} render={<a href={`mailto:${person.email}`}/>}>Email me</Button>
      <Button variant="ghost" nativeButton={false} render={<a href={person.linkedin} target="_blank" rel="noopener"/>}>
        LinkedIn <Icon icon={Launch} size={16}/>
      </Button>
      <Button variant="ghost" nativeButton={false} render={<a href={person.github} target="_blank" rel="noopener"/>}>
        GitHub <Icon icon={Launch} size={16}/>
      </Button>
    </div>
  </section>;
}

/** A resume section: its name in the left column on wide screens, the rows beside it. */
function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-6 gap-3 border-t border-line py-8 md:grid-cols-4 md:gap-6">
    <h2 id={`${id}-title`} className="type-heading-sm">{title}</h2>
    <div className="min-w-0 md:col-span-3">{children}</div>
  </section>;
}

function Entries({rows}: {rows: Entry[]}) {
  return <ItemGroup>
    {rows.map(r => <Item key={r.title} id={r.id} className="scroll-mt-6">
      <ItemContent>
        <ItemTitle>
          {r.href ? <ItemLink href={r.href}>{r.title}</ItemLink> : <span>{r.title}</span>}
          {r.tag && <Tag variant="outline" size="sm">{r.tag}</Tag>}
        </ItemTitle>
        <ItemDescription className="line-clamp-none">{r.line}</ItemDescription>
      </ItemContent>
      <ItemMeta>{r.date}</ItemMeta>
      {r.href && <ItemActions><Icon icon={ArrowRight} size={16} className="text-text-3"/></ItemActions>}
    </Item>)}
  </ItemGroup>;
}

export function Home() {
  return <SiteShell>
    <div className="mx-auto flex max-w-224 flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between gap-4 border-b border-line py-4">
        <span className="type-code">{person.name}</span>
        <div className="flex items-center gap-3">
          <SingaporeTime/>
          <ThemeToggle/>
        </div>
      </header>

      <main id="main" className="flex flex-col">
        <Hero/>
        <Section id="projects" title="Projects"><Entries rows={projects}/></Section>
        <Section id="education" title="Education"><Entries rows={education}/></Section>
        <Section id="certifications" title="Certifications"><Entries rows={certifications}/></Section>
        <Section id="skills" title="Skills">
          <DataList variant="framed">
            {skills.map(s => <DataListItem key={s.label}>
              <DataListLabel>{s.label}</DataListLabel>
              <DataListValue prose>{s.value}</DataListValue>
            </DataListItem>)}
          </DataList>
        </Section>
        <Section id="volunteering" title="Volunteering"><Entries rows={volunteering}/></Section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
        <span className="flex items-center gap-1">
          <a href={`mailto:${person.email}`} className="type-code-sm text-text-2 hover:text-text-1">{person.email}</a>
          <CopyButton value={person.email} label="email address"/>
        </span>
        <span className="type-caption text-text-3">© {new Date().getFullYear()} {person.name}</span>
      </footer>
    </div>
  </SiteShell>;
}
