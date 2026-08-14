import { useEffect, useId, useRef, useState } from "react";
import { Component, Download, Eye, GripVertical, MonitorSmartphone, PanelLeftClose, PanelLeftOpen, Pencil, Plus, Trash2, Upload, Wrench, X } from "lucide-react";
import heroDefinition from "../../components/hero/definition.json";
import feedDefinition from "../../components/feed/definition.json";
import steamDataDefinition from "../../components/steam-data/definition.json";
import verticalVideoDefinition from "../../components/vertical-video/definition.json";
import pageContentDefinition from "../../components/page-content/definition.json";
import imageGalleryDefinition from "../../components/image-gallery/definition.json";
import timelineDefinition from "../../components/timeline/definition.json";
import gameReviewDefinition from "../../components/game-review/definition.json";
import keyInfoDefinition from "../../components/key-info/definition.json";
import inlinePollDefinition from "../../components/inline-poll/definition.json";
import rankingsTableDefinition from "../../components/rankings-table/definition.json";
import contributionTrackerDefinition from "../../components/contribution-tracker/definition.json";
import featuredArticleDefinition from "../../components/featured-article/definition.json";
import stanceDefinition from "../../components/stance/definition.json";
import countdownDefinition from "../../components/countdown/definition.json";
import editorHighlightDefinition from "../../components/editor-highlight/definition.json";
import productsDefinition from "../../components/products/definition.json";
import discoverHubsDefinition from "../../components/discover-hubs/definition.json";
import fanHubDefinition from "../../components/fan-hub/definition.json";
// Component renderers remain source-owned. React only hosts their DOM output.
// @ts-ignore
import { renderHero } from "../../components/hero/renderer.js";
// @ts-ignore
import { renderFeed } from "../../components/feed/renderer.js";
// @ts-ignore
import { renderSteamData } from "../../components/steam-data/renderer.js";
// @ts-ignore
import { renderVerticalVideo } from "../../components/vertical-video/renderer.js";
// @ts-ignore
import { renderPageContent } from "../../components/page-content/renderer.js";
// @ts-ignore
import { renderImageGallery } from "../../components/image-gallery/renderer.js";
// @ts-ignore
import { renderTimeline } from "../../components/timeline/renderer.js";
// @ts-ignore
import { renderGameReview } from "../../components/game-review/renderer.js";
// @ts-ignore
import { renderKeyInfo } from "../../components/key-info/renderer.js";
// @ts-ignore
import { renderInlinePoll } from "../../components/inline-poll/renderer.js";
// @ts-ignore
import { renderRankingsTable } from "../../components/rankings-table/renderer.js";
// @ts-ignore
import { renderContributionTracker } from "../../components/contribution-tracker/renderer.js";
// @ts-ignore
import { renderFeaturedArticle } from "../../components/featured-article/renderer.js";
// @ts-ignore
import { renderStance } from "../../components/stance/renderer.js";
// @ts-ignore
import { renderCountdown } from "../../components/countdown/renderer.js";
// @ts-ignore
import { renderEditorHighlight } from "../../components/editor-highlight/renderer.js";
// @ts-ignore
import { renderProducts } from "../../components/products/renderer.js";
// @ts-ignore
import { renderDiscoverHubs } from "../../components/discover-hubs/renderer.js";
// @ts-ignore
import { renderFanHub } from "../../components/fan-hub/renderer.js";
// @ts-ignore
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { wireframeTheme } from "../../themes/wireframe";

type Values = Record<string, unknown>;
type Field = { id: string; label: string; type: string; required?: boolean; options?: string[]; fields?: Field[]; itemFields?: Field[]; itemLabel?: string; maxItems?: number; fixedItems?: boolean; showWhen?: { field: string; equals: string } };
type Definition = { id: string; name: string; category: string; fields: Field[]; defaults: Values };
type Instance = { id: string; componentId: string; values: Values };
type Draft = { version: number; brand: keyof typeof themes; scenario: string; pageTitle: string; instances: Instance[] };

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
const renderers: Record<string, (values: Values, theme: unknown) => HTMLElement> = { hero: renderHero, feed: renderFeed, "steam-data": renderSteamData, "vertical-video": renderVerticalVideo, "page-content": renderPageContent, "image-gallery": renderImageGallery, products: renderProducts, "discover-hubs": renderDiscoverHubs, "fan-hub": renderFanHub, timeline: renderTimeline, "game-review": renderGameReview, "key-info": renderKeyInfo, "inline-poll": renderInlinePoll, "rankings-table": renderRankingsTable, "contribution-tracker": renderContributionTracker, "featured-article": renderFeaturedArticle, stance: renderStance, countdown: renderCountdown, "editor-highlight": renderEditorHighlight };
const themes = { wireframe: wireframeTheme };
const selectorPreviewSettings: Record<string, { scale: number; expand?: boolean }> = {
  hero: { scale: 1 }, countdown: { scale: 0.96 }, "featured-article": { scale: 0.98 }, feed: { scale: 0.96 },
  "page-content": { scale: 1 }, "vertical-video": { scale: 0.94 }, "image-gallery": { scale: 1 }, products: { scale: 0.9 }, "discover-hubs": { scale: 0.88 }, "fan-hub": { scale: 0.98 }, "inline-poll": { scale: 0.98 },
  "rankings-table": { scale: 0.94 }, timeline: { scale: 0.9 }, "game-review": { scale: 1 }, "key-info": { scale: 0.94, expand: true },
  "steam-data": { scale: 0.94 }, "editor-highlight": { scale: 0.92 }, stance: { scale: 0.92 }, "contribution-tracker": { scale: 0.92 },
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const initialDraft = (): Draft => ({ version: 1, brand: "wireframe", scenario: "GTA 6", pageTitle: "GTA 6 hub", instances: [{ id: crypto.randomUUID(), componentId: "hero", values: clone(heroDefinition.defaults) }] });
function upgradeStanceValues(values: Values): Values {
  const firstStance = Array.isArray(values.stances) ? values.stances[0] as Values | undefined : undefined;
  return {
    ...values,
    twoChoices: Array.isArray(values.twoChoices) ? values.twoChoices : Array.isArray(firstStance?.twoChoices) ? firstStance.twoChoices : clone(stanceDefinition.defaults.twoChoices),
    spiceChoices: Array.isArray(values.spiceChoices) ? values.spiceChoices : Array.isArray(firstStance?.spiceChoices) ? firstStance.spiceChoices : clone(stanceDefinition.defaults.spiceChoices),
  };
}
function upgradeFeedValues(values: Values): Values {
  const featured = isValues(values.featured) ? values.featured : {};
  const feedItems = Array.isArray(values.articles) ? values.articles.map((item) => isValues(item) && !item.contentType ? { ...item, contentType: "Article" } : item) : values.articles;
  return { ...values, showFilters: typeof values.showFilters === "boolean" ? values.showFilters : true, filters: Array.isArray(values.filters) ? values.filters : clone(feedDefinition.defaults.filters), featured: !featured.contentType ? { ...featured, contentType: "Article" } : featured, articles: feedItems };
}
function upgradeDiscoverHubsValues(values: Values): Values {
  const defaults = Array.isArray(discoverHubsDefinition.defaults.hubs) ? discoverHubsDefinition.defaults.hubs as Values[] : [];
  const hubs = Array.isArray(values.hubs) ? values.hubs.map((hub) => {
    if (!isValues(hub)) return hub;
    const fallback = defaults.find((item) => item.name === hub.name);
    return fallback ? { ...fallback, ...hub } : hub;
  }) : values.hubs;
  return { ...values, hubs };
}
function upgradeFeaturedArticleValues(values: Values): Values {
  return { ...values, contentType: values.contentType || "Article", presentation: values.presentation === "Standard" ? "Standard" : "Featured" };
}
function upgradeInstanceValues(componentId: string, values: Values): Values {
  if (componentId === "stance") return upgradeStanceValues(values);
  if (componentId === "feed") return upgradeFeedValues(values);
  if (componentId === "discover-hubs") return upgradeDiscoverHubsValues(values);
  if (componentId === "featured-article") return upgradeFeaturedArticleValues(values);
  return values;
}
function storedDraft(): Draft { try { const draft = JSON.parse(localStorage.getItem("content-hub-workshop-draft") || "") as Draft; return { ...draft, brand: "wireframe", instances: Array.isArray(draft.instances) ? draft.instances.map((instance) => ({ ...instance, values: upgradeInstanceValues(instance.componentId, instance.values) })) : [] }; } catch { return initialDraft(); } }
function setAtPath(value: Values, path: string[], next: unknown): Values { const copy = clone(value); let cursor: Record<string, unknown> = copy; path.slice(0, -1).forEach((key) => { cursor[key] = typeof cursor[key] === "object" && cursor[key] ? clone(cursor[key]) : {}; cursor = cursor[key] as Record<string, unknown>; }); cursor[path.at(-1)!] = next; return copy; }
function emptyValues(fields: Field[]): Values { return Object.fromEntries(fields.map((field) => [field.id, field.type === "object" ? emptyValues(field.fields || []) : ["collection", "checkboxes"].includes(field.type) ? [] : ""])); }
function isValues(value: unknown): value is Values { return typeof value === "object" && value !== null && !Array.isArray(value); }
function parseDraft(value: unknown): Draft | null {
  if (!isValues(value) || !["gamesradar", "pcgamer", "wireframe"].includes(String(value.brand)) || typeof value.pageTitle !== "string" || !Array.isArray(value.instances)) return null;
  const ids = new Set<string>();
  const instances: Instance[] = [];
  for (const instance of value.instances) {
    if (!isValues(instance) || typeof instance.id !== "string" || !instance.id || ids.has(instance.id) || typeof instance.componentId !== "string" || !byId.has(instance.componentId) || !isValues(instance.values)) return null;
    ids.add(instance.id);
    instances.push({ id: instance.id, componentId: instance.componentId, values: upgradeInstanceValues(instance.componentId, instance.values) });
  }
  return { version: typeof value.version === "number" ? value.version : 1, brand: "wireframe", scenario: typeof value.scenario === "string" ? value.scenario : "", pageTitle: value.pageTitle, instances };
}
function instanceHeading(instance: Instance): string {
  const values = instance.values;
  const candidates = [values.heading, values.headline, values.title, (values.feature as Values | undefined)?.headline];
  return candidates.find((value) => typeof value === "string" && value.trim()) as string || "";
}
function ComponentHost({ componentId, values, theme, onSelect }: { componentId: string; values: Values; theme: unknown; onSelect?: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  useEffect(() => {
    const renderer = renderers[componentId];
    if (!host.current || !renderer) return;
    const component = renderer(values, theme) as HTMLElement & { cleanup?: () => void };
    const scale = (theme as { typeScale?: Record<string, string> } | undefined)?.typeScale;
    if (scale) Object.entries({ display: scale.display, h2: scale.h2, h3: scale.h3, body: scale.body, small: scale.small, label: scale.label }).forEach(([name, value]) => component.style.setProperty(`--hub-type-${name}`, value));
    host.current.replaceChildren(component);
    return () => component.cleanup?.();
  }, [componentId, values, theme]);
  return <div ref={(element) => {
    host.current = element;
    if (element) element.onclick = onSelect ? () => onSelectRef.current?.() : null;
  }} />;
}

function FieldEditor({ fields, values, onChange }: { fields: Field[]; values: Values; onChange: (next: Values) => void }) {
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
  return <div className="grid gap-4">{fields.filter((field) => !field.showWhen || values[field.showWhen.field] === field.showWhen.equals).map((field) => <div key={field.id} className="grid gap-1.5">
    {!["object", "collection", "toggle", "radio"].includes(field.type) && <label className="text-xs font-semibold text-zinc-700" htmlFor={field.id}>{field.label}{field.required && <span className="text-red-600"> *</span>}</label>}
    {field.type === "textarea" ? <textarea id={field.id} className="min-h-20 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" value={String(values[field.id] || "")} onChange={(event) => update([field.id], event.target.value)} /> : null}
    {field.type === "select" ? <select id={field.id} className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm" value={String(values[field.id] || "")} onChange={(event) => update([field.id], event.target.value)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : null}
    {field.type === "radio" ? <fieldset className="grid gap-2 rounded-md border border-zinc-200 p-3"><legend className="px-1 text-xs font-semibold">{field.label}</legend><div className="grid grid-cols-2 gap-2">{field.options?.map((option) => <label key={option} className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-2 text-xs"><input type="radio" name={`${radioGroup}-${field.id}`} value={option} checked={values[field.id] === option} onChange={() => update([field.id], option)} />{option}</label>)}</div></fieldset> : null}
    {field.type === "checkboxes" ? <div className="grid grid-cols-2 gap-2">{field.options?.map((option) => { const current = Array.isArray(values[field.id]) ? values[field.id] as string[] : []; const selected = current.includes(option); return <label key={option} className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-2 text-xs"><input type="checkbox" checked={selected} onChange={() => update([field.id], selected ? current.filter((item) => item !== option) : [...current, option])} />{option}</label>; })}</div> : null}
    {field.type === "toggle" ? <label className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"><input id={field.id} type="checkbox" checked={Boolean(values[field.id])} onChange={(event) => update([field.id], event.target.checked)} />{field.label}</label> : null}
    {!["textarea", "select", "radio", "checkboxes", "toggle", "object", "collection"].includes(field.type) ? <input id={field.id} className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm" type={field.type === "color" ? "color" : field.type === "url" ? "url" : field.type === "datetime-local" ? "datetime-local" : "text"} min={field.type === "datetime-local" ? new Date().toISOString().slice(0, 16) : undefined} value={field.type === "color" ? String(values[field.id] || "#000000") : String(values[field.id] || "")} onChange={(event) => update([field.id], event.target.value)} /> : null}
    {field.type === "object" && <details className="rounded-md border border-zinc-200 bg-white"><summary className="cursor-pointer px-3 py-2 text-xs font-semibold">{field.label}</summary><div className="border-t border-zinc-100 p-3"><FieldEditor fields={field.fields || []} values={(values[field.id] as Values) || {}} onChange={(next) => update([field.id], next)} /></div></details>}
    {field.type === "collection" && <details className="rounded-md border border-zinc-200 bg-white"><summary className="cursor-pointer px-3 py-2 text-xs font-semibold">{field.label} <span className="font-normal text-zinc-500">({((values[field.id] as Values[]) || []).length})</span>{["articles", "events"].includes(field.id) && <span className="ml-2 font-normal text-zinc-500">Drag to reorder</span>}</summary><div className="grid gap-3 border-t border-zinc-100 p-3">{((values[field.id] as Values[]) || []).map((item, index) => { const reorderable = ["articles", "events"].includes(field.id); return <details key={index} className={cn("rounded border border-zinc-100", draggedIndex === index && reorderable && "opacity-40")} open draggable={reorderable} onDragStart={() => reorderable && setDraggedIndex(index)} onDragEnd={() => setDraggedIndex(null)} onDragOver={(event) => reorderable && event.preventDefault()} onDrop={() => reorderable && reorderCollection(field.id, index)}><summary className="cursor-pointer px-3 py-2 text-xs font-medium">{reorderable && <GripVertical className="mr-1 inline size-3 text-zinc-400" aria-hidden="true" />}{field.itemLabel || "Item"} {index + 1}</summary><div className="border-t border-zinc-100 p-3">{!field.fixedItems && <div className="mb-2 flex justify-end"><Button variant="ghost" size="sm" onClick={() => update([field.id], ((values[field.id] as Values[]) || []).filter((_, itemIndex) => itemIndex !== index))}>Remove</Button></div>}<FieldEditor fields={field.itemFields || []} values={item} onChange={(next) => { const items = [...((values[field.id] as Values[]) || [])]; items[index] = next; update([field.id], items); }} /></div></details>; })}{!field.fixedItems && <Button variant="outline" size="sm" disabled={((values[field.id] as Values[]) || []).length >= (field.maxItems || Infinity)} onClick={() => update([field.id], [...((values[field.id] as Values[]) || []), emptyValues(field.itemFields || [])])}><Plus className="size-3" /> Add {field.itemLabel?.toLowerCase() || "item"}</Button>}</div></details>}
  </div>)}</div>;
}

export default function App() {
  const [mode, setMode] = useState<"builder" | "viewer">("builder");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const [draft, setDraft] = useState<Draft>(storedDraft);
  const [selectedComponentId, setSelectedComponentId] = useState("hero");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [draggedInstanceId, setDraggedInstanceId] = useState<string | null>(null);
  const [instancePendingDelete, setInstancePendingDelete] = useState<Instance | null>(null);
  const [addedPanelCompact, setAddedPanelCompact] = useState(false);
  const [addedPanelOpen, setAddedPanelOpen] = useState(false);
  const [addedPanelLeft, setAddedPanelLeft] = useState(0);
  const [importMessage, setImportMessage] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const builderPaneRef = useRef<HTMLDivElement>(null);
  const authoringSectionRef = useRef<HTMLElement>(null);
  const addedPanelRef = useRef<HTMLElement>(null);
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const editPanelRef = useRef<HTMLDivElement>(null);
  const [newValues, setNewValues] = useState<Record<string, Values>>(() => Object.fromEntries(definitions.map((definition) => [definition.id, clone(definition.defaults)])));
  const [viewerValues, setViewerValues] = useState<Record<string, Values>>(() => Object.fromEntries(definitions.map((definition) => [definition.id, clone(definition.defaults)])));
  useEffect(() => { setDraft((current) => ({ ...current, instances: current.instances.map((instance) => ({ ...instance, values: upgradeInstanceValues(instance.componentId, instance.values) })) })); }, []);
  useEffect(() => { localStorage.setItem("content-hub-workshop-draft", JSON.stringify(draft)); }, [draft]);
  const selectedDefinition = byId.get(selectedComponentId)!;
  const selectedInstance = draft.instances.find((instance) => instance.id === selectedInstanceId);
  useEffect(() => {
    const authoring = authoringSectionRef.current;
    const panel = addedPanelRef.current;
    if (!authoring || !panel || mode !== "builder") return;
    const positionPanel = () => {
      const authoringRight = authoring.getBoundingClientRect().right;
      const left = authoringRight + 16;
      setAddedPanelLeft(left);
      const previewLeft = previewFrameRef.current?.getBoundingClientRect().left;
      setAddedPanelCompact(Boolean(previewLeft && left + 376 > previewLeft));
      panel.style.left = `${left}px`;
    };
    positionPanel();
    const observer = new ResizeObserver(positionPanel);
    observer.observe(authoring);
    if (previewFrameRef.current) observer.observe(previewFrameRef.current);
    window.addEventListener("resize", positionPanel);
    return () => { observer.disconnect(); window.removeEventListener("resize", positionPanel); };
  }, [mode, sidebarCollapsed]);
  useEffect(() => {
    if (!selectedInstanceId) return;
    requestAnimationFrame(() => {
      document.querySelector(`[data-preview-instance="${selectedInstanceId}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      const pane = builderPaneRef.current;
      const panel = editPanelRef.current;
      if (!pane || !panel) return;
      const top = panel.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - 16;
      pane.scrollTo({ top, behavior: "smooth" });
    });
  }, [selectedInstanceId]);
  const currentValues = mode === "builder" ? selectedInstance?.values || newValues[selectedComponentId] : viewerValues[selectedComponentId];
  const updateValues = (values: Values) => {
    if (mode === "builder" && selectedInstance) {
      setDraft((current) => ({ ...current, instances: current.instances.map((instance) => instance.id === selectedInstance.id ? { ...instance, values } : instance) }));
    } else if (mode === "builder") {
      setNewValues((current) => ({ ...current, [selectedComponentId]: values }));
    } else {
      setViewerValues((current) => ({ ...current, [selectedComponentId]: values }));
    }
  };
  const addComponent = (componentId: string) => { const instance = { id: crypto.randomUUID(), componentId, values: clone(newValues[componentId]) }; setDraft((current) => ({ ...current, instances: [...current.instances, instance] })); setSelectedComponentId(componentId); setSelectedInstanceId(instance.id); };
  const selectInstance = (instance: Instance) => {
    setSelectedInstanceId(instance.id);
    setSelectedComponentId(instance.componentId);
  };
  const deleteInstance = (instance: Instance) => {
    setDraft((current) => ({ ...current, instances: current.instances.filter((item) => item.id !== instance.id) }));
    if (selectedInstanceId === instance.id) setSelectedInstanceId(null);
    setInstancePendingDelete(null);
  };
  const reorderInstance = (targetId: string) => {
    if (!draggedInstanceId || draggedInstanceId === targetId) return;
    setDraft((current) => {
      const sourceIndex = current.instances.findIndex((instance) => instance.id === draggedInstanceId);
      const targetIndex = current.instances.findIndex((instance) => instance.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const instances = [...current.instances];
      const [moved] = instances.splice(sourceIndex, 1);
      instances.splice(targetIndex, 0, moved);
      return { ...current, instances };
    });
    setDraggedInstanceId(null);
  };
  const exportDraft = () => {
    const file = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${draft.pageTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "content-hub"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const importDraft = async (file?: File) => {
    if (!file) return;
    try {
      const next = parseDraft(JSON.parse(await file.text()));
      if (!next) throw new Error("invalid");
      setDraft(next);
      setSelectedInstanceId(null);
      setImportMessage("Page imported.");
    } catch { setImportMessage("Could not import this JSON file."); }
  };
  const theme = themes[draft.brand];
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    definitions.forEach((definition) => {
      const button = document.querySelector<HTMLButtonElement>(`button[data-component-selector="${definition.id}"]`);
      const renderer = renderers[definition.id];
      if (!button || !renderer) return;
      const preview = document.createElement("div");
      preview.className = "pointer-events-none mb-2 h-64 overflow-hidden rounded border border-zinc-100 bg-zinc-50";
      preview.setAttribute("aria-hidden", "true");
      const canvas = document.createElement("div");
      canvas.style.transformOrigin = "top left";
      const component = renderer(clone(definition.defaults), theme) as HTMLElement & { cleanup?: () => void };
      canvas.append(component);
      preview.append(canvas);
      button.parentElement?.classList.replace("grid-cols-3", "grid-cols-2");
      button.classList.remove("min-h-14", "px-2", "py-1.5");
      button.classList.add("h-72", "p-2");
      button.prepend(preview);
      canvas.style.width = "390px";
      const settings = selectorPreviewSettings[definition.id] ?? { scale: 0.85 };
      if (settings.expand) {
        component.classList.remove("is-collapsed");
        component.querySelector(".hub-key-info__trigger")?.setAttribute("aria-expanded", "true");
      }
      canvas.style.transform = `scale(${(preview.clientWidth / 390) * settings.scale})`;
      cleanups.push(() => { component.cleanup?.(); preview.remove(); button.classList.remove("h-72", "p-2"); button.classList.add("min-h-14", "px-2", "py-1.5"); });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [mode, theme]);
  const title = mode === "builder" ? "Builder" : "Component viewer";
  if (fullPreview) return <div className="relative flex h-screen items-center justify-center bg-zinc-950 p-8"><Button className="absolute left-6 top-6" variant="outline" onClick={() => setFullPreview(false)}><X className="size-4" /> Return to builder</Button><div className="h-[min(860px,calc(100vh-64px))] w-[390px] overflow-hidden rounded-[42px] border-[8px] border-zinc-800 bg-white shadow-2xl"><div className="h-full overflow-y-auto">{draft.instances.map((instance) => <ComponentHost key={instance.id} componentId={instance.componentId} values={instance.values} theme={theme} />)}</div></div></div>;
  return <div className={cn("grid h-screen overflow-hidden bg-zinc-100", sidebarCollapsed ? "grid-cols-[64px_minmax(340px,1fr)_minmax(580px,2fr)]" : "grid-cols-[248px_minmax(340px,1fr)_minmax(580px,2fr)]")}>
    <aside className="flex h-screen flex-col overflow-y-auto border-r border-zinc-200 bg-white p-3"><div className={cn("mb-6 flex items-center", sidebarCollapsed ? "justify-center" : "justify-between gap-2")}><div className="flex min-w-0 items-center gap-2 font-bold"><Component className="size-5 shrink-0" />{!sidebarCollapsed && <span className="truncate">Content hub workshop</span>}</div><Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setSidebarCollapsed((current) => !current)}>{sidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}</Button></div><nav className="grid gap-1"><Button variant={mode === "builder" ? "default" : "ghost"} className={cn(sidebarCollapsed ? "justify-center px-0" : "justify-start")} aria-label="Builder" title={sidebarCollapsed ? "Builder" : undefined} onClick={() => setMode("builder")}><Wrench className="size-4" />{!sidebarCollapsed && "Builder"}</Button><Button variant={mode === "viewer" ? "default" : "ghost"} className={cn(sidebarCollapsed ? "justify-center px-0" : "justify-start")} aria-label="Component viewer" title={sidebarCollapsed ? "Component viewer" : undefined} onClick={() => setMode("viewer")}><Eye className="size-4" />{!sidebarCollapsed && "Component viewer"}</Button></nav></aside>
    <section ref={authoringSectionRef} className="flex h-screen min-h-0 flex-col border-r border-zinc-200 bg-white"><header className="border-b px-5 py-4">{mode === "builder" ? <div className="grid gap-2"><input id="page-title" aria-label="Page name" className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold" value={draft.pageTitle} onChange={(event) => setDraft((current) => ({ ...current, pageTitle: event.target.value }))} /><div className="grid grid-cols-2 gap-2"><Button variant="outline" size="sm" onClick={exportDraft}><Download className="size-3.5" /> Export JSON</Button><Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()}><Upload className="size-3.5" /> Import JSON</Button><input ref={importInputRef} className="hidden" type="file" accept="application/json,.json" onChange={(event) => { void importDraft(event.target.files?.[0]); event.target.value = ""; }} /></div>{importMessage && <p className="text-xs text-zinc-500" role="status">{importMessage}</p>}</div> : <><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Isolated catalogue</p><h1 className="mt-1 text-lg font-bold">{title}</h1></>}</header>{mode === "builder" && <aside ref={addedPanelRef} className={cn("fixed top-1/2 z-30 w-[min(360px,calc(100vw-88px))] -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg", addedPanelCompact && "hidden")}><p className="px-2 pb-1 pt-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">Added to page <span className="normal-case font-normal">({draft.instances.length})</span></p><div className="grid max-h-[70vh] gap-1 overflow-y-auto pr-0.5">{draft.instances.length ? draft.instances.map((instance, index) => { const definition = byId.get(instance.componentId)!; const heading = instanceHeading(instance); return <div key={instance.id} draggable onDragStart={() => setDraggedInstanceId(instance.id)} onDragEnd={() => setDraggedInstanceId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderInstance(instance.id)} className={cn("grid w-full grid-cols-[14px_minmax(0,1fr)_28px_28px] items-center gap-1 rounded-md border px-2 py-1.5", selectedInstanceId === instance.id ? "border-sky-300 bg-sky-50" : "border-transparent hover:bg-zinc-50", draggedInstanceId === instance.id && "opacity-40")}><GripVertical className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" /><button type="button" className="min-w-0 truncate text-left text-xs" onClick={() => selectInstance(instance)}><span className="font-semibold">{index + 1}. {definition.name}</span>{heading && <span className="ml-1 text-zinc-500">{heading}</span>}</button><Button type="button" size="icon" variant="ghost" className="size-7" aria-label={`Edit ${definition.name}`} title={`Edit ${definition.name}`} onClick={() => selectInstance(instance)}><Pencil className="size-3.5" /></Button><Button type="button" size="icon" variant="ghost" className="size-7 text-red-600 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${definition.name}`} title={`Delete ${definition.name}`} onClick={() => setInstancePendingDelete(instance)}><Trash2 className="size-3.5" /></Button></div>; }) : <p className="px-2 py-1 text-xs text-zinc-500">No components yet.</p>}</div></aside>}{mode === "builder" && addedPanelCompact && <Button type="button" size="sm" className="fixed top-1/2 z-30 -translate-y-1/2 shadow-lg" style={{ left: addedPanelLeft }} onClick={() => setAddedPanelOpen(true)}>Added ({draft.instances.length})</Button>}<div ref={builderPaneRef} className="min-h-0 flex-1 overflow-y-auto p-5"><details className="rounded-md border border-zinc-200 bg-white" open><summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">Components</summary><div className="h-[560px] overflow-y-auto border-t border-zinc-100 p-3"><div className="grid grid-cols-2 gap-2">{definitions.map((definition) => <div key={definition.id} className={cn("rounded-md border p-2", selectedComponentId === definition.id && !selectedInstance ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white")}><button type="button" data-component-selector={definition.id} className="block min-h-14 w-full text-left" aria-label={`Preview ${definition.name}`} onClick={() => { setSelectedComponentId(definition.id); if (mode === "builder") setSelectedInstanceId(null); }} /><div className="mt-2 flex items-start justify-between gap-2"><div className="min-w-0"><span className="block text-sm font-semibold leading-tight">{definition.name}</span><span className="mt-0.5 block text-[10px] text-zinc-500">{definition.category}</span></div>{mode === "builder" && <Button type="button" size="sm" variant="outline" className="shrink-0" onClick={() => addComponent(definition.id)}><Plus className="size-3" /> Add</Button>}</div></div>)}</div></div></details>
      <div ref={editPanelRef} className="mt-5 rounded-lg border-2 border-blue-600 bg-blue-50"><div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-blue-800">{selectedInstance ? "Editing page instance" : mode === "builder" ? "New component configuration" : "Component preview controls"}: {selectedDefinition.name}</div><div className="border-t border-blue-200 p-4"><FieldEditor fields={selectedDefinition.fields} values={currentValues} onChange={updateValues} /></div></div></div></section>
    <main className="flex h-screen min-h-0 flex-col overflow-y-auto p-8"><div className="mx-auto w-full max-w-4xl"><header className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Wireframe theme</p><h2 className="mt-1 text-2xl font-bold">{mode === "builder" ? draft.pageTitle : selectedDefinition.name}</h2></div><Button variant="outline" size="sm" onClick={() => setFullPreview(true)}><MonitorSmartphone className="size-4" /> Full preview</Button></header><div ref={previewFrameRef} className={cn("max-w-[390px] overflow-hidden bg-white shadow-xl", mode === "builder" && sidebarCollapsed ? "ml-auto mr-0" : "mx-auto")}>{mode === "builder" ? draft.instances.length ? draft.instances.map((instance) => <div key={instance.id} data-preview-instance={instance.id} role="button" tabIndex={0} className={cn("relative block w-full scroll-mt-[30vh] border-2 text-left transition", selectedInstanceId === instance.id ? "border-sky-300" : "border-transparent")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectInstance(instance); } }}><ComponentHost componentId={instance.componentId} values={instance.values} theme={theme} onSelect={() => selectInstance(instance)} />{selectedInstanceId === instance.id && <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-sky-100/20 ring-1 ring-inset ring-sky-300" />}</div>) : <div className="p-10 text-center text-sm text-zinc-500">Add component from left.</div> : <ComponentHost componentId={selectedComponentId} values={currentValues} theme={theme} />}</div>{mode === "builder" && <div className="mx-auto mt-4 max-w-[390px] text-center text-xs text-zinc-500">Click component in preview to edit it. Draft autosaves locally.</div>}</div></main>{addedPanelCompact && addedPanelOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/30 p-4" role="presentation" onMouseDown={() => setAddedPanelOpen(false)}><div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-3 shadow-xl" role="dialog" aria-modal="true" aria-label="Added to page" onMouseDown={(event) => event.stopPropagation()}><div className="mb-2 flex items-center justify-between px-1"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Added to page ({draft.instances.length})</p><Button type="button" size="icon" variant="ghost" className="size-7" aria-label="Close added components" onClick={() => setAddedPanelOpen(false)}><X className="size-4" /></Button></div><div className="grid max-h-[70vh] gap-1 overflow-y-auto">{draft.instances.map((instance, index) => { const definition = byId.get(instance.componentId)!; const heading = instanceHeading(instance); return <div key={instance.id} className={cn("grid grid-cols-[minmax(0,1fr)_28px_28px] items-center gap-1 rounded-md border px-2 py-2", selectedInstanceId === instance.id ? "border-sky-300 bg-sky-50" : "border-transparent hover:bg-zinc-50")}><button type="button" className="min-w-0 truncate text-left text-sm" onClick={() => { selectInstance(instance); setAddedPanelOpen(false); }}><span className="font-semibold">{index + 1}. {definition.name}</span>{heading && <span className="ml-1 text-zinc-500">{heading}</span>}</button><Button type="button" size="icon" variant="ghost" className="size-7" aria-label="Edit component" onClick={() => { selectInstance(instance); setAddedPanelOpen(false); }}><Pencil className="size-3.5" /></Button><Button type="button" size="icon" variant="ghost" className="size-7 text-red-600 hover:bg-red-50 hover:text-red-700" aria-label="Delete component" onClick={() => { setInstancePendingDelete(instance); setAddedPanelOpen(false); }}><Trash2 className="size-3.5" /></Button></div>; })}</div></div></div>}{instancePendingDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/30 p-4" role="presentation"><div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><h2 id="delete-title" className="text-base font-bold">Delete {byId.get(instancePendingDelete.componentId)?.name}?</h2><p className="mt-2 text-sm text-zinc-600">This removes it from the page. You cannot undo this action.</p><div className="mt-5 flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => setInstancePendingDelete(null)}>Cancel</Button><Button variant="destructive" size="sm" onClick={() => deleteInstance(instancePendingDelete)}>Delete</Button></div></div></div>}
  </div>;
}
