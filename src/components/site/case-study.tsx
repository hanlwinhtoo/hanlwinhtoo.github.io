import type {ReactNode} from 'react';
import {BreadcrumbTrail} from '@/components/sodium/ui/breadcrumb';
import {Button} from '@/components/sodium/ui/button';
import {DataList, DataListItem, DataListLabel, DataListValue} from '@/components/sodium/ui/data-list';
import {Frame, FrameBody} from '@/components/sodium/ui/frame';
import {Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemLink, ItemTitle} from '@/components/sodium/ui/item';
import {Status} from '@/components/sodium/ui/status';
import {StatusStrip, StatusStripCell, StatusStripLabel, StatusStripValue} from '@/components/sodium/ui/status-strip';
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/sodium/ui/table';
import {Tag} from '@/components/sodium/ui/tag';
import {ArrowLeft, ArrowRight, ArrowUp, Icon} from '@/components/sodium/icon';
import {cn} from '@/lib/sodium/utils';
import {PhotoView} from '@/components/site/photo-view';
import {SiteShell} from '@/components/site/site-shell';
import {SingaporeTime} from '@/components/site/singapore-time';
import {ThemeToggle} from '@/components/site/theme-toggle';

/* ---------- Content types: each case study in src/content/case-studies is data in these shapes ---------- */

/** Text with an optional opening phrase set in text-1 (Sodium has one weight, so no bold). */
export type Line = {lead?: string; text: string};

export type Block =
  | {kind: 'p'; lead?: string; text: string}
  | {kind: 'list'; ordered?: boolean; items: Line[]}
  | {kind: 'checks'; items: (Line & {pass: boolean})[]}
  | {kind: 'fix'; text: string};

export type Media =
  /** No image has a background behind it. crop fills a 16:9 frame edge to edge (a photo or a render); without it
      the image shows whole at its own shape (a screenshot, so no text is cut). natural also narrows the frame to the
      image (the tall BusGuard poster). Selecting any image enlarges it over the page; full is the file shown
      there, when it differs. */
  | {kind: 'image'; src: string; alt: string; width: number; height: number; caption: string; crop?: boolean; natural?: boolean; full?: string}
  | {kind: 'diagram'; diagram: ReactNode; caption: string}
  | {kind: 'table'; title: string; columns: {label: string; numeric?: boolean}[]; rows: string[][]; total?: string[]; note?: string};

export type Section = {id: string; title: string; tag?: string; blocks: Block[]; tools?: string[]; media?: Media};

/** A run of sections under one heading ("What I built"), or one section on its own. */
export type Part =
  | {kind: 'sections'; title?: string; sections: Section[]}
  | {kind: 'rows'; title: string; rows: {title: string; text: string; fix?: string}[]}
  | {kind: 'media'; media: Media}
  | {kind: 'gallery'; title: string; images: Extract<Media, {kind: 'image'}>[]}
  | {kind: 'learned'; items: Line[]};

export type CaseStudyData = {
  slug: string;
  homeAnchor: string;
  name: string;
  tags: string[];
  context: string;
  lead: string;
  facts: {label: string; value: string}[];
  hero: Media;
  stats?: {label: string; value: string}[];
  parts: Part[];
  next: {name: string; href: string};
};

/* ---------- Pieces ---------- */

function Lead({line}: {line: Line}) {
  return <>{line.lead && <span className="text-text-1">{line.lead} </span>}{line.text}</>;
}

function Blocks({blocks}: {blocks: Block[]}) {
  return <div className="flex max-w-(--measure) flex-col gap-3 type-body text-text-2">
    {blocks.map((b, i) => {
      switch (b.kind) {
        case 'p':
          return <p key={i}><Lead line={b}/></p>;
        case 'list': {
          const items = b.items.map((it, j) => <li key={j} className="ps-1"><Lead line={it}/></li>);
          return b.ordered
            ? <ol key={i} className="flex list-decimal flex-col gap-2 ps-5">{items}</ol>
            : <ul key={i} className="flex list-disc flex-col gap-2 ps-5">{items}</ul>;
        }
        case 'checks':
          return <ul key={i} className="flex flex-col gap-2">
            {b.items.map((it, j) => <li key={j} className="flex flex-wrap items-baseline gap-x-2">
              <Status status={it.pass ? 'ok' : 'idle'} size="sm">{it.lead}</Status>
              <span>{it.text}</span>
            </li>)}
          </ul>;
        case 'fix':
          return <p key={i} className="flex flex-wrap items-baseline gap-2"><Tag variant="outline" size="sm">Fix</Tag><span>{b.text}</span></p>;
      }
    })}
  </div>;
}

function Tools({tools}: {tools: string[]}) {
  return <ul aria-label="Tools" className="flex flex-wrap gap-1.5">
    {tools.map(t => <li key={t}><Tag>{t}</Tag></li>)}
  </ul>;
}

/** A photo in a frame with its caption. Selecting the photo enlarges it over the page. */
function PhotoFigure({media, uniform}: {media: Extract<Media, {kind: 'image'}>; uniform?: boolean}) {
  // In a gallery every tile matches: each photo fills the same 16:9 shape (the enlarged view still shows it whole),
  // and each frame stretches to its row, so a one-line caption ends level with a two-line one beside it.
  return <Frame className={cn('w-full', uniform && 'h-full', media.natural && 'mx-auto max-w-120')}>
    <figure className="flex flex-1 flex-col">
      <PhotoView photo={uniform ? {...media, crop: true} : media}/>
      <figcaption className="flex-1 border-t border-line p-inset type-caption text-text-2">{media.caption}</figcaption>
    </figure>
  </Frame>;
}

/** An image or diagram in a frame with its caption. */
function Figure({media}: {media: Exclude<Media, {kind: 'table'}>}) {
  if (media.kind === 'image') return <PhotoFigure media={media}/>;
  return <Frame className="w-full">
    <figure className="flex flex-col">
      <div className="p-inset"><div className="mx-auto max-w-180">{media.diagram}</div></div>
      <figcaption className="border-t border-line p-inset type-caption text-text-2">{media.caption}</figcaption>
    </figure>
  </Frame>;
}

function DataTable({media}: {media: Extract<Media, {kind: 'table'}>}) {
  return <div className="flex min-w-0 flex-col gap-2">
    <Table title={media.title}>
      <TableHeader>
        {/* A heading may take two lines, so a wide table fits the column on a laptop instead of scrolling sideways. */}
        <TableRow>{media.columns.map(c => <TableHead key={c.label} numeric={c.numeric} className="whitespace-normal">{c.label}</TableHead>)}</TableRow>
      </TableHeader>
      <TableBody>
        {media.rows.map(row => <TableRow key={row[0]}>
          {row.map((cell, j) => <TableCell key={j} numeric={media.columns[j].numeric} className={j === 0 ? undefined : 'whitespace-normal'}>{cell}</TableCell>)}
        </TableRow>)}
      </TableBody>
      {media.total && <TableFooter>
        <TableRow>{media.total.map((cell, j) => <TableCell key={j} numeric={media.columns[j].numeric}>{cell}</TableCell>)}</TableRow>
      </TableFooter>}
    </Table>
    {media.note && <p className="type-caption text-text-2">{media.note}</p>}
  </div>;
}

function MediaView({media}: {media: Media}) {
  return media.kind === 'table' ? <DataTable media={media}/> : <Figure media={media}/>;
}

/** One section, read top to bottom: heading, words, tools, then what shows them at the column's full width.
    A main section opens on a rule; a subsection inside a part is set apart by space alone. */
function SectionView({section, level}: {section: Section; level: 2 | 3}) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return <section id={section.id} aria-labelledby={`${section.id}-title`}
    className={cn('flex scroll-mt-10 flex-col gap-4', level === 2 ? 'border-t border-line py-10' : 'pt-10')}>
    <div className="flex flex-wrap items-center gap-2">
      <Heading id={`${section.id}-title`} className={level === 2 ? 'type-heading' : 'type-heading-sm'}>{section.title}</Heading>
      {section.tag && <Tag variant="outline">{section.tag}</Tag>}
    </div>
    <Blocks blocks={section.blocks}/>
    {section.tools && <Tools tools={section.tools}/>}
    {section.media && <div className="pt-2"><MediaView media={section.media}/></div>}
  </section>;
}

function PartView({part}: {part: Part}) {
  switch (part.kind) {
    case 'sections':
      return part.title
        ? <div className="flex flex-col border-t border-line py-10">
            <h2 className="type-heading">{part.title}</h2>
            {part.sections.map(s => <SectionView key={s.id} section={s} level={3}/>)}
          </div>
        : <>{part.sections.map(s => <SectionView key={s.id} section={s} level={2}/>)}</>;
    case 'rows':
      return <div className="flex flex-col gap-6 border-t border-line py-10">
        <h2 className="type-heading">{part.title}</h2>
        <Frame aria-label={part.title}>
          <FrameBody padding="none">
            {part.rows.map(r => <article key={r.title} className="flex flex-col gap-2 p-inset rule-row">
              <h3 className="type-heading-sm">{r.title}</h3>
              <Blocks blocks={[{kind: 'p', text: r.text}, ...(r.fix ? [{kind: 'fix', text: r.fix} as const] : [])]}/>
            </article>)}
          </FrameBody>
        </Frame>
      </div>;
    case 'media':
      return <div className="border-t border-line py-10"><MediaView media={part.media}/></div>;
    case 'gallery':
      return <section aria-labelledby="gallery-title" className="flex flex-col gap-6 border-t border-line py-10">
        <h2 id="gallery-title" className="type-heading">{part.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {part.images.map((img, i) => <div key={img.src} className={i === 0 ? 'sm:col-span-2' : undefined}><PhotoFigure media={img} uniform/></div>)}
        </div>
      </section>;
    case 'learned':
      return <section aria-labelledby="learned-title" className="flex flex-col gap-4 border-t border-line py-10">
        <h2 id="learned-title" className="type-heading">What I learned</h2>
        <Blocks blocks={[{kind: 'list', items: part.items}]}/>
      </section>;
  }
}

function Intro({data}: {data: CaseStudyData}) {
  return <div className="flex min-w-0 flex-col gap-5">
    <div className="flex flex-col gap-3">
      {/* The page-title size on a narrow phone, where one long word at display size is wider than the screen. */}
      <h1 className="type-title sm:type-display">{data.name}</h1>
      <ul aria-label="About this project" className="flex flex-wrap gap-1.5">
        {data.tags.map((t, i) => <li key={t}><Tag variant={i === 0 ? 'outline' : 'neutral'}>{t}</Tag></li>)}
      </ul>
      <p className="type-body-sm text-text-2">{data.context}</p>
    </div>
    <p className="max-w-(--measure) type-heading-sm text-text-2">{data.lead}</p>
  </div>;
}

function Facts({data}: {data: CaseStudyData}) {
  return <DataList variant="framed" className="w-full">
    {data.facts.map(f => <DataListItem key={f.label}>
      <DataListLabel>{f.label}</DataListLabel>
      <DataListValue prose>{f.value}</DataListValue>
    </DataListItem>)}
  </DataList>;
}

/* ---------- The page ---------- */

export function CaseStudy({data}: {data: CaseStudyData}) {
  const back = `/#${data.homeAnchor}`;
  return <SiteShell>
    {/* One column, read top to bottom like an article. 800px less the gutters and the frame inset leaves the diagrams
        their full 720 units, so their labels show at real size. */}
    <div className="mx-auto flex max-w-200 flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between gap-4 border-b border-line py-4">
        <BreadcrumbTrail items={[
          {label: 'Home', href: '/'},
          {label: 'Projects', href: '/#projects'},
          {label: data.name},
        ]}/>
        {/* The breadcrumb comes first on a narrow phone, so the clock shows from 640px up. */}
        <div className="flex shrink-0 items-center gap-3">
          <SingaporeTime className="hidden sm:inline"/>
          <ThemeToggle/>
        </div>
      </header>

      <main id="main" className="flex flex-col">
        <div className="flex flex-col gap-8 pt-12 pb-10 lg:pt-16">
          <Intro data={data}/>
          <MediaView media={data.hero}/>
          <Facts data={data}/>
        </div>

        {data.stats && <div className="pb-10">
          <StatusStrip label="Results">
            {data.stats.map(s => <StatusStripCell key={s.label}>
              <StatusStripLabel>{s.label}</StatusStripLabel>
              <StatusStripValue>{s.value}</StatusStripValue>
            </StatusStripCell>)}
          </StatusStrip>
        </div>}

        {data.parts.map((p, i) => <PartView key={i} part={p}/>)}

        <nav aria-label="More projects" className="flex flex-col gap-4 border-t border-line py-10">
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle><ItemLink href={data.next.href}>{data.next.name}</ItemLink></ItemTitle>
                <ItemDescription>Next project</ItemDescription>
              </ItemContent>
              <ItemActions><Icon icon={ArrowRight} size={16} className="text-text-3"/></ItemActions>
            </Item>
          </ItemGroup>
          <div>
            <Button variant="secondary" size="sm" nativeButton={false} render={<a href={back}/>}>
              <Icon icon={ArrowLeft} size={16}/> Back to home
            </Button>
          </div>
        </nav>
      </main>

      <footer className="flex items-center justify-between gap-4 border-t border-line py-4">
        <span className="type-caption text-text-3">© {new Date().getFullYear()} Han Lwin Htoo</span>
        <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#top"/>}>
          Back to top <Icon icon={ArrowUp} size={16}/>
        </Button>
      </footer>
    </div>
  </SiteShell>;
}
