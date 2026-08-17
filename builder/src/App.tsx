import { useEffect, useId, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Component,
  Copy,
  Download,
  Eye,
  GripVertical,
  MonitorSmartphone,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Undo2,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import heroDefinition from '../../components/hero/definition.json';
import feedDefinition from '../../components/feed/definition.json';
import steamDataDefinition from '../../components/steam-data/definition.json';
import verticalVideoDefinition from '../../components/vertical-video/definition.json';
import pageContentDefinition from '../../components/page-content/definition.json';
import imageGalleryDefinition from '../../components/image-gallery/definition.json';
import timelineDefinition from '../../components/timeline/definition.json';
import gameReviewDefinition from '../../components/game-review/definition.json';
import keyInfoDefinition from '../../components/key-info/definition.json';
import inlinePollDefinition from '../../components/inline-poll/definition.json';
import rankingsTableDefinition from '../../components/rankings-table/definition.json';
import contributionTrackerDefinition from '../../components/contribution-tracker/definition.json';
import featuredArticleDefinition from '../../components/featured-article/definition.json';
import stanceDefinition from '../../components/stance/definition.json';
import countdownDefinition from '../../components/countdown/definition.json';
import editorHighlightDefinition from '../../components/editor-highlight/definition.json';
import productsDefinition from '../../components/products/definition.json';
import discoverHubsDefinition from '../../components/discover-hubs/definition.json';
import fanHubDefinition from '../../components/fan-hub/definition.json';
// Component renderers remain source-owned. React only hosts their DOM output.
// @ts-ignore
import { renderHero } from '../../components/hero/renderer.js';
// @ts-ignore
import { renderFeed } from '../../components/feed/renderer.js';
// @ts-ignore
import { renderSteamData } from '../../components/steam-data/renderer.js';
// @ts-ignore
import { renderVerticalVideo } from '../../components/vertical-video/renderer.js';
// @ts-ignore
import { renderPageContent } from '../../components/page-content/renderer.js';
// @ts-ignore
import { renderImageGallery } from '../../components/image-gallery/renderer.js';
// @ts-ignore
import { renderTimeline } from '../../components/timeline/renderer.js';
// @ts-ignore
import { renderGameReview } from '../../components/game-review/renderer.js';
// @ts-ignore
import { renderKeyInfo } from '../../components/key-info/renderer.js';
// @ts-ignore
import { renderInlinePoll } from '../../components/inline-poll/renderer.js';
// @ts-ignore
import { renderRankingsTable } from '../../components/rankings-table/renderer.js';
// @ts-ignore
import { renderContributionTracker } from '../../components/contribution-tracker/renderer.js';
// @ts-ignore
import { renderFeaturedArticle } from '../../components/featured-article/renderer.js';
// @ts-ignore
import { renderStance } from '../../components/stance/renderer.js';
// @ts-ignore
import { renderCountdown } from '../../components/countdown/renderer.js';
// @ts-ignore
import { renderEditorHighlight } from '../../components/editor-highlight/renderer.js';
// @ts-ignore
import { renderProducts } from '../../components/products/renderer.js';
// @ts-ignore
import { renderDiscoverHubs } from '../../components/discover-hubs/renderer.js';
// @ts-ignore
import { renderFanHub } from '../../components/fan-hub/renderer.js';
// @ts-ignore
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { wireframeTheme } from '../../themes/wireframe';

type Values = Record<string, unknown>;
type Field = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  fields?: Field[];
  itemFields?: Field[];
  itemLabel?: string;
  maxItems?: number;
  fixedItems?: boolean;
  showWhen?: { field: string; equals: string };
};
type Definition = { id: string; name: string; category: string; fields: Field[]; defaults: Values };
type Instance = { id: string; componentId: string; values: Values };
type Draft = {
  version: number;
  brand: keyof typeof themes;
  scenario: string;
  pageTitle: string;
  instances: Instance[];
};

const definitions = [
  heroDefinition,
  countdownDefinition,
  featuredArticleDefinition,
  feedDefinition,
  pageContentDefinition,
  verticalVideoDefinition,
  imageGalleryDefinition,
  productsDefinition,
  discoverHubsDefinition,
  fanHubDefinition,
  inlinePollDefinition,
  rankingsTableDefinition,
  timelineDefinition,
  gameReviewDefinition,
  keyInfoDefinition,
  steamDataDefinition,
  editorHighlightDefinition,
  stanceDefinition,
  contributionTrackerDefinition,
] as Definition[];
const byId = new Map(definitions.map((definition) => [definition.id, definition]));
const renderers: Record<string, (values: Values, theme: unknown) => HTMLElement> = {
  hero: renderHero,
  feed: renderFeed,
  'steam-data': renderSteamData,
  'vertical-video': renderVerticalVideo,
  'page-content': renderPageContent,
  'image-gallery': renderImageGallery,
  products: renderProducts,
  'discover-hubs': renderDiscoverHubs,
  'fan-hub': renderFanHub,
  timeline: renderTimeline,
  'game-review': renderGameReview,
  'key-info': renderKeyInfo,
  'inline-poll': renderInlinePoll,
  'rankings-table': renderRankingsTable,
  'contribution-tracker': renderContributionTracker,
  'featured-article': renderFeaturedArticle,
  stance: renderStance,
  countdown: renderCountdown,
  'editor-highlight': renderEditorHighlight,
};
const themes = { wireframe: wireframeTheme };
const selectorPreviewSettings: Record<string, { scale: number; expand?: boolean }> = {
  hero: { scale: 1 },
  countdown: { scale: 0.96 },
  'featured-article': { scale: 0.98 },
  feed: { scale: 0.96 },
  'page-content': { scale: 1 },
  'vertical-video': { scale: 0.94 },
  'image-gallery': { scale: 1 },
  products: { scale: 0.9 },
  'discover-hubs': { scale: 0.88 },
  'fan-hub': { scale: 0.98 },
  'inline-poll': { scale: 0.98 },
  'rankings-table': { scale: 0.94 },
  timeline: { scale: 0.9 },
  'game-review': { scale: 1 },
  'key-info': { scale: 0.94, expand: true },
  'steam-data': { scale: 0.94 },
  'editor-highlight': { scale: 0.92 },
  stance: { scale: 0.92 },
  'contribution-tracker': { scale: 0.92 },
};

const sectionPurposes: Record<string, string> = {
  hero: 'Introduce the page and give readers a reason to follow it.',
  countdown: 'Build anticipation around an important date.',
  'featured-article': 'Give one important story extra attention.',
  feed: 'Show a browsable list of related stories.',
  'page-content': 'Add a block of supporting editorial copy.',
  'vertical-video': 'Show a short, mobile-first video.',
  'image-gallery': 'Let readers browse a set of images.',
  products: 'Highlight products, games, or recommended items.',
  'discover-hubs': 'Help readers find related content hubs.',
  'fan-hub': 'Collect fan-focused content and community links.',
  'inline-poll': 'Ask readers one quick question.',
  'rankings-table': 'Compare items in a ranked list.',
  timeline: 'Explain events in chronological order.',
  'game-review': 'Summarise a review with a clear verdict.',
  'key-info': 'Surface important facts at a glance.',
  'steam-data': 'Show live or recent game data.',
  'editor-highlight': 'Add a short editorial recommendation.',
  stance: 'Invite readers to choose between two opinions.',
  'contribution-tracker': 'Show progress towards a shared goal.',
};
const fieldHints: Record<string, string> = {
  Headline: 'Keep it short and clear. Aim for one strong idea.',
  Subheadline: 'Explain what readers will find here in one or two sentences.',
  'Image description': 'Describe what is visible for readers using a screen reader.',
  'Image or video URL': 'Paste a direct media URL.',
  'Last updated': 'Example: Updated today or Updated 12 August 2026.',
  'Follow button text': 'Use a clear action, such as Follow or Get updates.',
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const initialDraft = (): Draft => ({
  version: 1,
  brand: 'wireframe',
  scenario: 'GTA 6',
  pageTitle: 'GTA 6 hub',
  instances: [
    { id: crypto.randomUUID(), componentId: 'hero', values: clone(heroDefinition.defaults) },
  ],
});
function upgradeStanceValues(values: Values): Values {
  const firstStance = Array.isArray(values.stances)
    ? (values.stances[0] as Values | undefined)
    : undefined;
  return {
    ...values,
    twoChoices: Array.isArray(values.twoChoices)
      ? values.twoChoices
      : Array.isArray(firstStance?.twoChoices)
        ? firstStance.twoChoices
        : clone(stanceDefinition.defaults.twoChoices),
    spiceChoices: Array.isArray(values.spiceChoices)
      ? values.spiceChoices
      : Array.isArray(firstStance?.spiceChoices)
        ? firstStance.spiceChoices
        : clone(stanceDefinition.defaults.spiceChoices),
  };
}
function upgradeFeedValues(values: Values): Values {
  const featured = isValues(values.featured) ? values.featured : {};
  const feedItems = Array.isArray(values.articles)
    ? values.articles.map((item) =>
        isValues(item) && !item.contentType ? { ...item, contentType: 'Article' } : item,
      )
    : values.articles;
  return {
    ...values,
    showFilters: typeof values.showFilters === 'boolean' ? values.showFilters : true,
    filters: Array.isArray(values.filters)
      ? values.filters
      : clone(feedDefinition.defaults.filters),
    featured: !featured.contentType ? { ...featured, contentType: 'Article' } : featured,
    articles: feedItems,
  };
}
function upgradeDiscoverHubsValues(values: Values): Values {
  const defaults = Array.isArray(discoverHubsDefinition.defaults.hubs)
    ? (discoverHubsDefinition.defaults.hubs as Values[])
    : [];
  const hubs = Array.isArray(values.hubs)
    ? values.hubs.map((hub) => {
        if (!isValues(hub)) return hub;
        const fallback = defaults.find((item) => item.name === hub.name);
        return fallback ? { ...fallback, ...hub } : hub;
      })
    : values.hubs;
  return { ...values, hubs };
}
function upgradeFeaturedArticleValues(values: Values): Values {
  return {
    ...values,
    contentType: values.contentType || 'Article',
    presentation: values.presentation === 'Standard' ? 'Standard' : 'Featured',
  };
}
function upgradeInstanceValues(componentId: string, values: Values): Values {
  if (componentId === 'stance') return upgradeStanceValues(values);
  if (componentId === 'feed') return upgradeFeedValues(values);
  if (componentId === 'discover-hubs') return upgradeDiscoverHubsValues(values);
  if (componentId === 'featured-article') return upgradeFeaturedArticleValues(values);
  return values;
}
function storedDraft(): Draft {
  try {
    const draft = JSON.parse(localStorage.getItem('content-hub-workshop-draft') || '') as Draft;
    return {
      ...draft,
      brand: 'wireframe',
      instances: Array.isArray(draft.instances)
        ? draft.instances.filter((instance) => isValues(instance) && typeof instance.componentId === 'string' && byId.has(instance.componentId)).map((instance) => ({
            ...instance,
            values: upgradeInstanceValues(instance.componentId, instance.values),
          }))
        : [],
    };
  } catch {
    return initialDraft();
  }
}
function setAtPath(value: Values, path: string[], next: unknown): Values {
  const copy = clone(value);
  let cursor: Record<string, unknown> = copy;
  path.slice(0, -1).forEach((key) => {
    cursor[key] = typeof cursor[key] === 'object' && cursor[key] ? clone(cursor[key]) : {};
    cursor = cursor[key] as Record<string, unknown>;
  });
  cursor[path.at(-1)!] = next;
  return copy;
}
function emptyValues(fields: Field[]): Values {
  return Object.fromEntries(
    fields.map((field) => [
      field.id,
      field.type === 'object'
        ? emptyValues(field.fields || [])
        : ['collection', 'checkboxes'].includes(field.type)
          ? []
          : '',
    ]),
  );
}
function isValues(value: unknown): value is Values {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function fieldValueEmpty(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0);
}
function validateFields(fields: Field[], values: Values, path = ''): string[] {
  const errors: string[] = [];
  fields.forEach((field) => {
    if (field.showWhen && values[field.showWhen.field] !== field.showWhen.equals) return;
    const label = path ? `${path} / ${field.label}` : field.label;
    const value = values[field.id];
    if (field.required && fieldValueEmpty(value)) errors.push(`${label} is required.`);
    if (field.type === 'url' && typeof value === 'string' && value.trim()) {
      try { new URL(value); } catch { errors.push(`${label} must be a valid URL.`); }
    }
    if (field.type === 'object' && isValues(value)) errors.push(...validateFields(field.fields || [], value, label));
    if (field.type === 'collection' && Array.isArray(value)) value.forEach((item, index) => { if (isValues(item)) errors.push(...validateFields(field.itemFields || [], item, `${label} ${index + 1}`)); });
  });
  return errors;
}
function validateDraftValue(draft: Draft): string[] {
  if (!draft.instances.length) return ['Add at least one component before previewing or downloading the page.'];
  return draft.instances.flatMap((instance, index) => { const definition = byId.get(instance.componentId); return definition ? validateFields(definition.fields, instance.values, `Component ${index + 1} (${definition.name})`) : []; });
}
function parseDraft(value: unknown): Draft | null {
  if (
    !isValues(value) ||
    !['gamesradar', 'pcgamer', 'wireframe'].includes(String(value.brand)) ||
    typeof value.pageTitle !== 'string' ||
    !Array.isArray(value.instances)
  )
    return null;
  const ids = new Set<string>();
  const instances: Instance[] = [];
  for (const instance of value.instances) {
    if (
      !isValues(instance) ||
      typeof instance.id !== 'string' ||
      !instance.id ||
      ids.has(instance.id) ||
      typeof instance.componentId !== 'string' ||
      !byId.has(instance.componentId) ||
      !isValues(instance.values)
    )
      return null;
    ids.add(instance.id);
    instances.push({
      id: instance.id,
      componentId: instance.componentId,
      values: upgradeInstanceValues(instance.componentId, instance.values),
    });
  }
  return {
    version: typeof value.version === 'number' ? value.version : 1,
    brand: 'wireframe',
    scenario: typeof value.scenario === 'string' ? value.scenario : '',
    pageTitle: value.pageTitle,
    instances,
  };
}
function instanceHeading(instance: Instance): string {
  const values = instance.values;
  const candidates = [
    values.heading,
    values.headline,
    values.title,
    (values.feature as Values | undefined)?.headline,
  ];
  return (candidates.find((value) => typeof value === 'string' && value.trim()) as string) || '';
}
function ComponentHost({
  componentId,
  values,
  theme,
  onSelect,
}: {
  componentId: string;
  values: Values;
  theme: unknown;
  onSelect?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  useEffect(() => {
    const renderer = renderers[componentId];
    if (!host.current || !renderer) return;
    const component = renderer(values, theme) as HTMLElement & { cleanup?: () => void };
    const scale = (theme as { typeScale?: Record<string, string> } | undefined)?.typeScale;
    if (scale)
      Object.entries({
        display: scale.display,
        h2: scale.h2,
        h3: scale.h3,
        body: scale.body,
        small: scale.small,
        label: scale.label,
      }).forEach(([name, value]) => component.style.setProperty(`--hub-type-${name}`, value));
    host.current.replaceChildren(component);
    return () => component.cleanup?.();
  }, [componentId, values, theme]);
  return (
    <div
      ref={(element) => {
        host.current = element;
        if (element) element.onclick = onSelect ? () => onSelectRef.current?.() : null;
      }}
    />
  );
}

function SelectorPreview({ definition, theme }: { definition: Definition; theme: unknown }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const renderer = renderers[definition.id];
    if (!host.current || !renderer) return;
    const canvas = document.createElement('div');
    canvas.style.width = '390px';
    canvas.style.transformOrigin = 'top left';
    const component = renderer(clone(definition.defaults), theme) as HTMLElement & { cleanup?: () => void };
    canvas.append(component);
    host.current.replaceChildren(canvas);
    const settings = selectorPreviewSettings[definition.id] ?? { scale: 0.85 };
    if (settings.expand) {
      component.classList.remove('is-collapsed');
      component.querySelector('.hub-key-info__trigger')?.setAttribute('aria-expanded', 'true');
    }
    canvas.style.transform = `scale(${(host.current.clientWidth / 390) * settings.scale})`;
    return () => component.cleanup?.();
  }, [definition, theme]);
  return <div ref={host} aria-hidden="true" className="pointer-events-none mb-2 h-64 overflow-hidden rounded border border-zinc-100 bg-zinc-50" />;
}

function FieldEditor({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Values;
  onChange: (next: Values) => void;
}) {
  const update = (path: string[], value: unknown) => onChange(setAtPath(values, path, value));
  const radioGroup = useId();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const reorderCollection = (fieldId: string, targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const items = [...((values[fieldId] as Values[]) || [])];
    const [moved] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, moved);
    update([fieldId], items);
    setDraggedIndex(null);
  };
  return (
    <div className="grid gap-4">
      {fields
        .filter(
          (field) => !field.showWhen || values[field.showWhen.field] === field.showWhen.equals,
        )
        .map((field) => (
          <div key={field.id} className="grid gap-1.5">
            {!['object', 'collection', 'toggle', 'radio'].includes(field.type) && (
              <div>
                <label className="text-xs font-semibold text-zinc-700" htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-red-600"> *<span className="sr-only"> required</span></span>}
                </label>
                {fieldHints[field.label] && <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{fieldHints[field.label]}</p>}
              </div>
            )}
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                className="min-h-20 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                value={String(values[field.id] || '')}
                onChange={(event) => update([field.id], event.target.value)}
              />
            ) : null}
            {field.type === 'select' ? (
              <select
                id={field.id}
                className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm"
                value={String(values[field.id] || '')}
                onChange={(event) => update([field.id], event.target.value)}
              >
                {field.options?.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : null}
            {field.type === 'radio' ? (
              <fieldset className="grid gap-2 rounded-md border border-zinc-200 p-3">
                <legend className="px-1 text-xs font-semibold">{field.label}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {field.options?.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-2 text-xs"
                    >
                      <input
                        type="radio"
                        name={`${radioGroup}-${field.id}`}
                        value={option}
                        checked={values[field.id] === option}
                        onChange={() => update([field.id], option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
            {field.type === 'checkboxes' ? (
              <div className="grid grid-cols-2 gap-2">
                {field.options?.map((option) => {
                  const current = Array.isArray(values[field.id])
                    ? (values[field.id] as string[])
                    : [];
                  const selected = current.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-2 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          update(
                            [field.id],
                            selected
                              ? current.filter((item) => item !== option)
                              : [...current, option],
                          )
                        }
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            ) : null}
            {field.type === 'toggle' ? (
              <label className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
                <input
                  id={field.id}
                  type="checkbox"
                  checked={Boolean(values[field.id])}
                  onChange={(event) => update([field.id], event.target.checked)}
                />
                {field.label}
              </label>
            ) : null}
            {![
              'textarea',
              'select',
              'radio',
              'checkboxes',
              'toggle',
              'object',
              'collection',
            ].includes(field.type) ? (
              <input
                id={field.id}
                aria-required={field.required}
                className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm"
                type={
                  field.type === 'color'
                    ? 'color'
                    : field.type === 'url'
                      ? 'url'
                      : field.type === 'datetime-local'
                        ? 'datetime-local'
                        : 'text'
                }
                min={
                  field.type === 'datetime-local'
                    ? new Date().toISOString().slice(0, 16)
                    : undefined
                }
                value={
                  field.type === 'color'
                    ? String(values[field.id] || '#000000')
                    : String(values[field.id] || '')
                }
                onChange={(event) => update([field.id], event.target.value)}
              />
            ) : null}
            {field.type === 'object' && (
              <details className="rounded-md border border-zinc-200 bg-white">
                <summary className="cursor-pointer px-3 py-2 text-xs font-semibold">
                  {field.label}
                </summary>
                <div className="border-t border-zinc-100 p-3">
                  <FieldEditor
                    fields={field.fields || []}
                    values={(values[field.id] as Values) || {}}
                    onChange={(next) => update([field.id], next)}
                  />
                </div>
              </details>
            )}
            {field.type === 'collection' && (
              <details className="rounded-md border border-zinc-200 bg-white">
                <summary className="cursor-pointer px-3 py-2 text-xs font-semibold">
                  {field.label}{' '}
                  <span className="font-normal text-zinc-500">
                    ({((values[field.id] as Values[]) || []).length})
                  </span>
                  {['articles', 'events'].includes(field.id) && (
                    <span className="ml-2 font-normal text-zinc-500">Drag to reorder</span>
                  )}
                </summary>
                <div className="grid gap-3 border-t border-zinc-100 p-3">
                  {((values[field.id] as Values[]) || []).map((item, index) => {
                    const reorderable = ['articles', 'events'].includes(field.id);
                    return (
                      <details
                        key={index}
                        className={cn(
                          'relative rounded border border-zinc-100',
                          draggedIndex === index && reorderable && 'opacity-40',
                        )}
                        open
                        draggable={reorderable}
                        onDragStart={() => reorderable && setDraggedIndex(index)}
                        onDragEnd={() => setDraggedIndex(null)}
                        onDragOver={(event) => reorderable && event.preventDefault()}
                        onDrop={() => reorderable && reorderCollection(field.id, index)}
                      >
                        <summary className="cursor-pointer py-2 pl-3 pr-20 text-xs font-medium">
                          {reorderable && (
                            <GripVertical
                              className="mr-1 inline size-3 text-zinc-400"
                              aria-hidden="true"
                            />
                          )}
                          {field.itemLabel || 'Item'} {index + 1}
                        </summary>
                        {!field.fixedItems && <Button variant="ghost" size="sm" className="absolute right-1 top-0 h-7 px-2 text-xs font-medium" onClick={(event) => { event.preventDefault(); event.stopPropagation(); update([field.id], ((values[field.id] as Values[]) || []).filter((_, itemIndex) => itemIndex !== index)); }}>Remove</Button>}
                        <div className="border-t border-zinc-100 p-3">
                          <FieldEditor
                            fields={field.itemFields || []}
                            values={item}
                            onChange={(next) => {
                              const items = [...((values[field.id] as Values[]) || [])];
                              items[index] = next;
                              update([field.id], items);
                            }}
                          />
                        </div>
                      </details>
                    );
                  })}
                  {!field.fixedItems && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        ((values[field.id] as Values[]) || []).length >=
                        (field.maxItems || Infinity)
                      }
                      onClick={() =>
                        update(
                          [field.id],
                          [
                            ...((values[field.id] as Values[]) || []),
                            emptyValues(field.itemFields || []),
                          ],
                        )
                      }
                    >
                      <Plus className="size-3" /> Add {field.itemLabel?.toLowerCase() || 'item'}
                    </Button>
                  )}
                </div>
              </details>
            )}
          </div>
        ))}
    </div>
  );
}

export default function App() {
  const isComponentViewer = window.location.pathname.replace(/\/$/, '') === '/component-viewer';
  const [activePanel, setActivePanel] = useState<'add' | 'outline' | 'edit'>('add');
  const [fullPreview, setFullPreview] = useState(false);
  const [draft, setDraft] = useState<Draft>(storedDraft);
  const [selectedComponentId, setSelectedComponentId] = useState('hero');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [draggedInstanceId, setDraggedInstanceId] = useState<string | null>(null);
  const [instancePendingDelete, setInstancePendingDelete] = useState<Instance | null>(null);
  const [addedPanelOpen, setAddedPanelOpen] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved locally');
  const [history, setHistory] = useState<Draft[]>([]);
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All components');
  const importInputRef = useRef<HTMLInputElement>(null);
  const builderPaneRef = useRef<HTMLDivElement>(null);
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const editPanelRef = useRef<HTMLDivElement>(null);
  const [newValues, setNewValues] = useState<Record<string, Values>>(() =>
    Object.fromEntries(
      definitions.map((definition) => [definition.id, clone(definition.defaults)]),
    ),
  );
  const [viewerValues, setViewerValues] = useState<Record<string, Values>>(() =>
    Object.fromEntries(
      definitions.map((definition) => [definition.id, clone(definition.defaults)]),
    ),
  );
  useEffect(() => {
    setDraft((current) => ({
      ...current,
      instances: current.instances.map((instance) => ({
        ...instance,
        values: upgradeInstanceValues(instance.componentId, instance.values),
      })),
    }));
  }, []);
  useEffect(() => {
    localStorage.setItem('content-hub-workshop-draft', JSON.stringify(draft));
    setSaveStatus('Saved locally');
  }, [draft]);
  const selectedDefinition = byId.get(selectedComponentId)!;
  const selectedInstance = draft.instances.find((instance) => instance.id === selectedInstanceId);
  useEffect(() => {
    if (!selectedInstanceId) return;
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-preview-instance="${selectedInstanceId}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const pane = builderPaneRef.current;
      const panel = editPanelRef.current;
      if (!pane || !panel) return;
      const top =
        panel.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - 16;
      pane.scrollTo({ top, behavior: 'smooth' });
    });
  }, [selectedInstanceId]);
  const currentValues = selectedInstance?.values || newValues[selectedComponentId];
  const commitDraft = (next: Draft) => {
    setHistory((current) => [...current.slice(-19), draft]);
    setSaveStatus('Saving…');
    setDraft(next);
  };
  const updateValues = (values: Values) => {
    if (!isComponentViewer && selectedInstance) {
      commitDraft({
        ...draft,
        instances: draft.instances.map((instance) =>
          instance.id === selectedInstance.id ? { ...instance, values } : instance,
        ),
      });
    } else if (!isComponentViewer) {
      setNewValues((current) => ({ ...current, [selectedComponentId]: values }));
    } else {
      setViewerValues((current) => ({ ...current, [selectedComponentId]: values }));
    }
  };
  const addComponent = (componentId: string) => {
    const instance = {
      id: crypto.randomUUID(),
      componentId,
      values: clone(newValues[componentId]),
    };
    commitDraft({ ...draft, instances: [...draft.instances, instance] });
    setSelectedComponentId(componentId);
    setSelectedInstanceId(instance.id);
    setActivePanel('edit');
    setActionMessage(`${byId.get(componentId)?.name} component added.`);
  };
  const selectInstance = (instance: Instance) => {
    setSelectedInstanceId(instance.id);
    setSelectedComponentId(instance.componentId);
    setActivePanel('edit');
  };
  const deleteInstance = (instance: Instance) => {
    commitDraft({ ...draft, instances: draft.instances.filter((item) => item.id !== instance.id) });
    if (selectedInstanceId === instance.id) setSelectedInstanceId(null);
    setInstancePendingDelete(null);
  };
  const duplicateInstance = (instance: Instance) => {
    const duplicate = {
      id: crypto.randomUUID(),
      componentId: instance.componentId,
      values: clone(instance.values),
    };
    const index = draft.instances.findIndex((item) => item.id === instance.id);
    if (index >= 0) {
      const instances = [...draft.instances];
      instances.splice(index + 1, 0, duplicate);
      commitDraft({ ...draft, instances });
    }
    setSelectedComponentId(duplicate.componentId);
    setSelectedInstanceId(duplicate.id);
  };
  const reorderInstance = (targetId: string) => {
    if (!draggedInstanceId || draggedInstanceId === targetId) return;
    const sourceIndex = draft.instances.findIndex(
        (instance) => instance.id === draggedInstanceId,
      );
    const targetIndex = draft.instances.findIndex((instance) => instance.id === targetId);
    if (sourceIndex >= 0 && targetIndex >= 0) {
      const instances = [...draft.instances];
      const [moved] = instances.splice(sourceIndex, 1);
      instances.splice(targetIndex, 0, moved);
      commitDraft({ ...draft, instances });
    }
    setDraggedInstanceId(null);
  };
  const moveInstance = (instanceId: string, direction: -1 | 1) => {
    const index = draft.instances.findIndex((item) => item.id === instanceId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= draft.instances.length) return;
    const instances = [...draft.instances];
    [instances[index], instances[target]] = [instances[target], instances[index]];
    commitDraft({ ...draft, instances });
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory((current) => current.slice(0, -1));
    setDraft(previous);
    setActionMessage('Last change undone.');
  };
  const resetSelected = () => {
    if (!selectedInstance) return;
    const definition = byId.get(selectedInstance.componentId);
    if (!definition) return;
    commitDraft({ ...draft, instances: draft.instances.map((item) => item.id === selectedInstance.id ? { ...item, values: clone(definition.defaults) } : item) });
    setActionMessage('Component reset to its starting content.');
  };
  const validationErrors = validateDraftValue(draft);
  const guardValid = (action: string) => {
    if (!validationErrors.length) return true;
    setActionMessage(`Fix ${validationErrors.length} content issue${validationErrors.length === 1 ? '' : 's'} before you ${action}.`);
    return false;
  };
  const exportDraft = () => {
    if (!guardValid('download this page')) return;
    const file = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${
      draft.pageTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'content-hub'
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const importDraft = async (file?: File) => {
    if (!file) return;
    try {
      const next = parseDraft(JSON.parse(await file.text()));
      if (!next) throw new Error('invalid');
      if (!window.confirm('Open this page and replace your current draft?')) return;
      setDraft(next);
      setSelectedInstanceId(null);
      setImportMessage('Page imported.');
    } catch {
      setImportMessage('Could not import this JSON file.');
    }
  };
  const theme = themes[draft.brand];
  const categories = ['All components', ...Array.from(new Set(definitions.map((definition) => definition.category)))];
  const visibleDefinitions = definitions.filter((definition) => {
    const text = `${definition.name} ${definition.category} ${sectionPurposes[definition.id] || ''}`.toLowerCase();
    return text.includes(catalogueSearch.toLowerCase()) && (categoryFilter === 'All components' || definition.category === categoryFilter);
  });
  if (isComponentViewer)
    return (
      <div className="grid h-screen min-w-[900px] grid-cols-[minmax(340px,1fr)_minmax(580px,2fr)] overflow-hidden bg-zinc-100">
        <section className="min-h-0 overflow-y-auto border-r border-zinc-200 bg-white p-5">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Component viewer</p><h1 className="mt-1 text-lg font-bold">Preview a component</h1></div><Button asChild variant="outline" size="sm"><a href="../">Back to builder</a></Button></div>
          <label className="text-xs font-semibold text-zinc-700" htmlFor="viewer-component">Component</label>
          <select id="viewer-component" className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm" value={selectedComponentId} onChange={(event) => setSelectedComponentId(event.target.value)}>{definitions.map((definition) => <option key={definition.id} value={definition.id}>{definition.name}</option>)}</select>
          <p className="mt-2 text-xs text-zinc-500">{sectionPurposes[selectedComponentId]}</p>
          <div className="mt-5 rounded-lg border-2 border-blue-600 bg-blue-50"><div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-blue-800">Edit component: {selectedDefinition.name}</div><div className="border-t border-blue-200 p-4"><FieldEditor fields={selectedDefinition.fields} values={viewerValues[selectedComponentId]} onChange={updateValues} /></div></div>
        </section>
        <main className="flex min-h-0 flex-col overflow-y-auto p-8"><div className="mx-auto w-full max-w-4xl"><header className="mb-6"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Wireframe theme</p><h2 className="mt-1 text-2xl font-bold">{selectedDefinition.name}</h2></header><div className="mx-auto max-w-[390px] overflow-hidden bg-white shadow-xl"><ComponentHost componentId={selectedComponentId} values={viewerValues[selectedComponentId]} theme={theme} /></div></div></main>
      </div>
    );
  if (fullPreview)
    return (
      <div className="relative flex h-screen items-center justify-center bg-zinc-950 p-8">
        <Button
          className="absolute left-6 top-6"
          variant="outline"
          onClick={() => setFullPreview(false)}
        >
          <X className="size-4" /> Back to editing
        </Button>
        <div className="h-[min(860px,calc(100vh-64px))] w-[390px] overflow-hidden rounded-[42px] border-[8px] border-zinc-800 bg-white shadow-2xl">
          <div className="h-full overflow-y-auto">
            {draft.instances.map((instance) => (
              <ComponentHost
                key={instance.id}
                componentId={instance.componentId}
                values={instance.values}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div
      className={cn(
        'grid h-screen overflow-hidden bg-zinc-100',
        'grid-cols-[220px_minmax(340px,1fr)_minmax(580px,2fr)]',
      )}
    >
      <aside className="flex h-screen flex-col border-r border-zinc-200 bg-white p-3">
        <div className="mb-6 flex items-center gap-2 font-bold"><Component className="size-5 shrink-0" /><span className="truncate">Content hub workshop</span></div>
        <nav className="grid gap-1" aria-label="Builder components">
          <Button variant={activePanel === 'add' ? 'default' : 'ghost'} className="justify-start" onClick={() => setActivePanel('add')}><Plus className="size-4" /> Add new component</Button>
          <Button variant={activePanel === 'outline' ? 'default' : 'ghost'} className="justify-start" onClick={() => setActivePanel('outline')}><GripVertical className="size-4" /> Page outline</Button>
          <Button variant={activePanel === 'edit' ? 'default' : 'ghost'} className="justify-start" onClick={() => setActivePanel('edit')} disabled={!selectedInstance}><Pencil className="size-4" /> Edit component</Button>
        </nav>
      </aside>
      <section
        className="flex h-screen min-h-0 flex-col border-r border-zinc-200 bg-white"
      >
        <header className="border-b px-5 py-4">
          {activePanel === 'outline' ? (
            <div className="grid gap-2">
              <label htmlFor="page-title" className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Page name</label>
              <input
                id="page-title"
                aria-label="Page name"
                className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold"
                value={draft.pageTitle}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, pageTitle: event.target.value }))
                }
              />
              <p className="rounded-md bg-zinc-50 p-2 text-[11px] text-zinc-600"><strong className="text-zinc-800">How to build:</strong> 1 Choose component → 2 Add to page → 3 Edit content → 4 Preview.</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={exportDraft}>
                  <Download className="size-3.5" /> Download page
                </Button>
                <Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()}>
                  <Upload className="size-3.5" /> Open page
                </Button>
                <input
                  ref={importInputRef}
                  className="hidden"
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => {
                    void importDraft(event.target.files?.[0]);
                    event.target.value = '';
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500"><span className="inline-flex items-center gap-1"><Check className="size-3.5 text-emerald-600" /> {saveStatus}</span><Button variant="ghost" size="sm" onClick={undo} disabled={!history.length}><Undo2 className="size-3.5" /> Undo</Button></div>
              {importMessage && (
                <p className="text-xs text-zinc-500" role="status">
                  {importMessage}
                </p>
              )}
              {actionMessage && <p className="text-xs text-blue-700" role="status">{actionMessage}</p>}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{activePanel === 'add' ? 'Build your page' : 'Edit content'}</p><h1 className="mt-1 text-lg font-bold">{activePanel === 'add' ? 'Add new component' : selectedDefinition.name}</h1></div>{activePanel === 'add' && <a href="./component-viewer/" target="_blank" rel="noreferrer" className="shrink-0 text-sm font-medium text-blue-700 hover:underline">Open component viewer ↗</a>}</div>
          )}
        </header>
        <div ref={builderPaneRef} className="min-h-0 flex-1 overflow-y-auto p-5">
          {activePanel === 'outline' && <div className="grid gap-2"><p className="text-sm text-zinc-600">Drag components to reorder, or use the arrow buttons.</p>{draft.instances.map((instance, index) => { const definition = byId.get(instance.componentId)!; const heading = instanceHeading(instance); return <div key={instance.id} draggable onDragStart={() => setDraggedInstanceId(instance.id)} onDragEnd={() => setDraggedInstanceId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderInstance(instance.id)} className={cn('grid grid-cols-[16px_minmax(0,1fr)_28px_28px] items-center gap-2 rounded-md border p-2', selectedInstanceId === instance.id ? 'border-sky-300 bg-sky-50' : 'border-zinc-200 bg-white', draggedInstanceId === instance.id && 'opacity-40')}><GripVertical className="size-4 text-zinc-400" aria-hidden="true" /><button type="button" className="min-w-0 text-left" onClick={() => selectInstance(instance)}><span className="block text-sm font-semibold">{index + 1}. {definition.name}</span>{heading && <span className="block truncate text-xs text-zinc-500">{heading}</span>}</button><div className="grid gap-1"><Button type="button" size="icon" variant="ghost" className="size-7" aria-label="Move component up" disabled={index === 0} onClick={() => moveInstance(instance.id, -1)}><ArrowUp className="size-3.5" /></Button><Button type="button" size="icon" variant="ghost" className="size-7" aria-label="Move component down" disabled={index === draft.instances.length - 1} onClick={() => moveInstance(instance.id, 1)}><ArrowDown className="size-3.5" /></Button></div><Button type="button" size="icon" variant="ghost" className="size-7" aria-label={`Edit ${definition.name}`} onClick={() => selectInstance(instance)}><Pencil className="size-3.5" /></Button></div>})}</div>}
          {activePanel === 'add' && <div className="flex h-full min-h-0 flex-col">
            <div className="grid gap-2 pb-3">
              <label className="sr-only" htmlFor="section-search">Search components</label>
              <div className="relative"><Search className="pointer-events-none absolute left-2 top-2.5 size-4 text-zinc-400" aria-hidden="true" /><input id="section-search" className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm" placeholder="Search components" value={catalogueSearch} onChange={(event) => setCatalogueSearch(event.target.value)} /></div>
              <label className="sr-only" htmlFor="section-category">Filter components</label>
              <select id="section-category" className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-zinc-100 pt-3">
              <div className="grid grid-cols-2 gap-2">
                {visibleDefinitions.map((definition) => (
                  <div
                    key={definition.id}
                    className={cn(
                      'rounded-md border p-2',
                      selectedComponentId === definition.id && !selectedInstance
                        ? 'border-zinc-900 bg-zinc-50'
                        : 'border-zinc-200 bg-white',
                    )}
                  >
                    <button
                      type="button"
                      className="block w-full text-left"
                      aria-label={`Preview ${definition.name}`}
                      onClick={() => {
                        setSelectedComponentId(definition.id);
                        setSelectedInstanceId(null);
                      }}
                    ><SelectorPreview definition={definition} theme={theme} /></button>
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold leading-tight">
                          {definition.name}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-zinc-500">
                          {sectionPurposes[definition.id] || definition.category}
                        </span>
                      </div>
                      <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          onClick={() => addComponent(definition.id)}
                        >
                          <Plus className="size-3" /> Add
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>}
          {activePanel === 'edit' && <div ref={editPanelRef} className="rounded-lg border-2 border-blue-600 bg-blue-50">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-blue-800">
              Edit component: {selectedDefinition.name}
            </div>
            <div className="border-t border-blue-200 p-4">
              {selectedInstance && <div className="mb-3 flex flex-wrap justify-end gap-1"><Button type="button" variant="ghost" size="sm" onClick={() => duplicateInstance(selectedInstance)}><Copy className="size-3.5" /> Duplicate</Button><Button type="button" variant="ghost" size="sm" onClick={resetSelected}><RotateCcw className="size-3.5" /> Reset</Button><Button type="button" variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setInstancePendingDelete(selectedInstance)}><Trash2 className="size-3.5" /> Delete</Button></div>}
              <FieldEditor
                fields={selectedDefinition.fields}
                values={currentValues}
                onChange={updateValues}
              />
            </div>
          </div>}
        </div>
      </section>
      <main className="flex h-screen min-h-0 flex-col overflow-y-auto p-8">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Wireframe theme
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {draft.pageTitle}
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => guardValid('preview the page') && setFullPreview(true)}>
              <MonitorSmartphone className="size-4" /> Full preview
            </Button>
          </header>
          <div
            ref={previewFrameRef}
            className={cn(
              'max-w-[390px] overflow-hidden bg-white shadow-xl',
              'mx-auto',
            )}
          >
            {draft.instances.length ? (
                draft.instances.map((instance) => (
                  <div
                    key={instance.id}
                    data-preview-instance={instance.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'relative block w-full scroll-mt-[30vh] border-2 text-left transition',
                      selectedInstanceId === instance.id ? 'border-sky-300' : 'border-transparent',
                    )}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectInstance(instance);
                      }
                    }}
                  >
                    <ComponentHost
                      componentId={instance.componentId}
                      values={instance.values}
                      theme={theme}
                      onSelect={() => selectInstance(instance)}
                    />
                    {selectedInstanceId === instance.id && (
                      <>
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-sky-100/10 ring-1 ring-inset ring-sky-300" />
                        <span className="absolute right-2 top-2 z-20 rounded-md bg-white px-2 py-1 text-xs font-semibold shadow">Editing this component</span>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-sm text-zinc-500">
                  Add component from left.
                </div>
              )
            }
          </div>
          <div className="mx-auto mt-4 max-w-[390px] text-center text-xs text-zinc-500">Choose a component, add it to your page, edit the content, then preview. Saved locally.</div>
        </div>
      </main>
      {false && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/30 p-4"
          role="presentation"
          onMouseDown={() => setAddedPanelOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-3 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Page outline"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Page outline ({draft.instances.length})
              </p>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-7"
                aria-label="Close added components"
                onClick={() => setAddedPanelOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="grid max-h-[70vh] gap-1 overflow-y-auto">
              {draft.instances.map((instance, index) => {
                const definition = byId.get(instance.componentId)!;
                const heading = instanceHeading(instance);
                return (
                  <div
                    key={instance.id}
                    className={cn(
                      'grid grid-cols-[minmax(0,1fr)_28px_28px_28px] items-center gap-1 rounded-md border px-2 py-2',
                      selectedInstanceId === instance.id
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-transparent hover:bg-zinc-50',
                    )}
                  >
                    <button
                      type="button"
                      className="min-w-0 truncate text-left text-sm"
                      onClick={() => {
                        selectInstance(instance);
                        setAddedPanelOpen(false);
                      }}
                    >
                      <span className="font-semibold">
                        {index + 1}. {definition.name}
                      </span>
                    </button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      aria-label="Edit component"
                      onClick={() => {
                        selectInstance(instance);
                        setAddedPanelOpen(false);
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      aria-label="Duplicate component"
                      title="Duplicate component"
                      onClick={() => duplicateInstance(instance)}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                      aria-label="Delete component"
                      onClick={() => {
                        setInstancePendingDelete(instance);
                        setAddedPanelOpen(false);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {instancePendingDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/30 p-4"
          role="presentation"
        >
          <div
            className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title" className="text-base font-bold">
              Delete {byId.get(instancePendingDelete.componentId)?.name}?
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              This removes it from the page. You cannot undo this action.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setInstancePendingDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteInstance(instancePendingDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
