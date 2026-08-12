import { useEffect, useId, useRef, useState } from "react";
import { Component, Download, Eye, GripVertical, MonitorSmartphone, Plus, Trash2, Upload, Wrench, X } from "lucide-react";
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
const renderers: Record<string, (values: Values, theme: unknown) => HTMLElement> = { hero: renderHero, feed: renderFeed, "steam-data": renderSteamData, "vertical-video": renderVerticalVideo, "page-content": renderPageContent, "image-gallery": renderImageGallery, timeline: renderTimeline, "game-review": renderGameReview, "key-info": renderKeyInfo, "inline-poll": renderInlinePoll, "rankings-table": renderRankingsTable, "contribution-tracker": renderContributionTracker, "featured-article": renderFeaturedArticle, stance: renderStance, countdown: renderCountdown, "editor-highlight": renderEditorHighlight };
const themes = { wireframe: wireframeTheme };

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
function upgradeInstanceValues(componentId: string, values: Values): Values {
  if (componentId === "stance") return upgradeStanceValues(values);
  if (componentId === "feed") return upgradeFeedValues(values);
  if (componentId === "featured-article" && !values.contentType) return { ...values, contentType: "Article" };
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
function ComponentHost({ componentId, values, theme }: { componentId: string; values: Values; theme: unknown }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const renderer = renderers[componentId];
    if (!host.current || !renderer) return;
    const component = renderer(values, theme) as HTMLElement & { cleanup?: () => void };
    const scale = (theme as { typeScale?: Record<string, string> } | undefined)?.typeScale;
    if (scale) Object.entries({ display: scale.display, h2: scale.h2, h3: scale.h3, body: scale.body, small: scale.small, label: scale.label }).forEach(([name, value]) => component.style.setProperty(`--hub-type-${name}`, value));
    host.current.replaceChildren(component);
    return () => component.cleanup?.();
  }, [componentId, values, theme]);
  return <div ref={host} />;
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
  const [fullPreview, setFullPreview] = useState(false);
  const [draft, setDraft] = useState<Draft>(storedDraft);
  const [selectedComponentId, setSelectedComponentId] = useState("hero");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [draggedInstanceId, setDraggedInstanceId] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const [newValues, setNewValues] = useState<Record<string, Values>>(() => Object.fromEntries(definitions.map((definition) => [definition.id, clone(definition.defaults)])));
  const [viewerValues, setViewerValues] = useState<Record<string, Values>>(() => Object.fromEntries(definitions.map((definition) => [definition.id, clone(definition.defaults)])));
  useEffect(() => { setDraft((current) => ({ ...current, instances: current.instances.map((instance) => ({ ...instance, values: upgradeInstanceValues(instance.componentId, instance.values) })) })); }, []);
  useEffect(() => { localStorage.setItem("content-hub-workshop-draft", JSON.stringify(draft)); }, [draft]);
  const selectedDefinition = byId.get(selectedComponentId)!;
  const selectedInstance = draft.instances.find((instance) => instance.id === selectedInstanceId);
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
  const addComponent = (componentId: string) => { const instance = { id: crypto.randomUUID(), componentId, values: clone(newValues[componentId]) }; setDraft((current) => ({ ...current, instances: [...current.instances, instance] })); setSelectedComponentId(componentId); setSelectedInstanceId(null); };
  const selectInstance = (instance: Instance) => {
    setSelectedInstanceId(instance.id);
    setSelectedComponentId(instance.componentId);
    requestAnimationFrame(() => document.querySelector(`[data-preview-instance="${instance.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
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
      const button = Array.from(document.querySelectorAll("button")).find((element) => element.firstElementChild?.textContent === definition.name);
      const renderer = renderers[definition.id];
      if (!button || !renderer) return;
      const preview = document.createElement("div");
      preview.className = "pointer-events-none mb-2 h-64 overflow-hidden rounded border border-zinc-100 bg-zinc-50";
      preview.setAttribute("aria-hidden", "true");
      const canvas = document.createElement("div");
      canvas.style.width = "390px";
      canvas.style.transform = "scale(.245)";
      canvas.style.transformOrigin = "top left";
      const component = renderer(clone(definition.defaults), theme) as HTMLElement & { cleanup?: () => void };
      canvas.append(component);
      preview.append(canvas);
      button.prepend(preview);
      button.parentElement?.classList.replace("grid-cols-3", "grid-cols-2");
      button.classList.remove("min-h-14", "px-2", "py-1.5");
      button.classList.add("h-80", "p-2");
      cleanups.push(() => { component.cleanup?.(); preview.remove(); button.classList.remove("h-80", "p-2"); button.classList.add("min-h-14", "px-2", "py-1.5"); });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [mode, selectedComponentId, selectedInstanceId, theme]);
  const title = mode === "builder" ? "Builder" : "Component viewer";
  if (fullPreview) return <div className="relative flex h-screen items-center justify-center bg-zinc-950 p-8"><Button className="absolute left-6 top-6" variant="outline" onClick={() => setFullPreview(false)}><X className="size-4" /> Return to builder</Button><div className="h-[min(860px,calc(100vh-64px))] w-[390px] overflow-hidden rounded-[42px] border-[8px] border-zinc-800 bg-white shadow-2xl"><div className="h-full overflow-y-auto">{draft.instances.map((instance) => <ComponentHost key={instance.id} componentId={instance.componentId} values={instance.values} theme={theme} />)}</div></div></div>;
  return <div className="grid h-screen grid-cols-[248px_minmax(340px,1fr)_minmax(580px,2fr)] overflow-hidden bg-zinc-100">
    <aside className="flex h-screen flex-col overflow-y-auto border-r border-zinc-200 bg-white p-4"><div className="mb-6 flex items-center gap-2 font-bold"><Component className="size-5" /> Content hub workshop</div><nav className="grid gap-1"><Button variant={mode === "builder" ? "default" : "ghost"} className="justify-start" onClick={() => setMode("builder")}><Wrench className="size-4" /> Builder</Button><Button variant={mode === "viewer" ? "default" : "ghost"} className="justify-start" onClick={() => setMode("viewer")}><Eye className="size-4" /> Component viewer</Button></nav></aside>
    <section className="flex h-screen min-h-0 flex-col border-r border-zinc-200 bg-white"><header className="border-b px-5 py-4"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{mode === "builder" ? "Page authoring" : "Isolated catalogue"}</p><h1 className="mt-1 text-lg font-bold">{title}</h1></header><div className="min-h-0 flex-1 overflow-y-auto p-5">{mode === "builder" && <details className="mb-5 rounded-md border border-zinc-200 bg-white" open><summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">Page setup</summary><div className="grid gap-3 border-t border-zinc-100 p-3"><div className="grid gap-1.5"><label className="text-xs font-semibold text-zinc-700" htmlFor="page-title">Page name</label><input id="page-title" className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm" value={draft.pageTitle} onChange={(event) => setDraft((current) => ({ ...current, pageTitle: event.target.value }))} /></div><div className="grid grid-cols-2 gap-2"><Button variant="outline" size="sm" onClick={exportDraft}><Download className="size-3.5" /> Export JSON</Button><Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()}><Upload className="size-3.5" /> Import JSON</Button><input ref={importInputRef} className="hidden" type="file" accept="application/json,.json" onChange={(event) => { void importDraft(event.target.files?.[0]); event.target.value = ""; }} /></div>{importMessage && <p className="text-xs text-zinc-500" role="status">{importMessage}</p>}</div></details>}<details className="rounded-md border border-zinc-200 bg-white" open><summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">Components</summary><div className="border-t border-zinc-100 p-3"><div className="grid grid-cols-3 gap-2">{definitions.map((definition) => <button key={definition.id} className={cn("min-h-14 rounded-md border px-2 py-1.5 text-left", selectedComponentId === definition.id && !selectedInstance ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:bg-zinc-50")} onClick={() => { setSelectedComponentId(definition.id); if (mode === "builder") setSelectedInstanceId(null); }}><span className="block text-sm font-semibold leading-tight">{definition.name}</span><span className="mt-0.5 block text-[10px] text-zinc-500">{definition.category}</span></button>)}</div>{mode === "builder" && <Button className="mt-3 w-full" variant="outline" onClick={() => addComponent(selectedComponentId)}><Plus className="size-4" /> Add {selectedDefinition.name}</Button>}</div></details>
      {mode === "builder" && <details className="mt-5 rounded-md border border-zinc-200 bg-white" open><summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600">Added to page <span className="normal-case font-normal text-zinc-500">({draft.instances.length})</span></summary><div className="grid gap-2 border-t border-zinc-100 p-3">{draft.instances.map((instance, index) => { const definition = byId.get(instance.componentId)!; const heading = instanceHeading(instance); return <button key={instance.id} draggable onDragStart={() => setDraggedInstanceId(instance.id)} onDragEnd={() => setDraggedInstanceId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderInstance(instance.id)} className={cn("flex items-center gap-2 rounded-md border px-2 py-2 text-left", selectedInstanceId === instance.id ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white hover:bg-zinc-50", draggedInstanceId === instance.id && "opacity-40")} onClick={() => selectInstance(instance)}><GripVertical className="size-4 shrink-0 text-zinc-400" aria-hidden="true" /><span className="min-w-0 flex-1 truncate text-xs"><span className="font-semibold">{index + 1}. {definition.name}</span>{heading && <span className="ml-2 text-zinc-500">{heading}</span>}</span></button>; })}</div></details>}
      <details className="mt-5 rounded-lg border-2 border-blue-600 bg-blue-50"><summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-wide text-blue-800">{selectedInstance ? "Editing page instance" : mode === "builder" ? "New component configuration" : "Component preview controls"}: {selectedDefinition.name}</summary><div className="border-t border-blue-200 p-4">{mode === "builder" && selectedInstance && <div className="mb-3 flex justify-end"><Button variant="destructive" size="sm" onClick={() => { setDraft((current) => ({ ...current, instances: current.instances.filter((instance) => instance.id !== selectedInstance.id) })); setSelectedInstanceId(null); }}><Trash2 className="size-4" /> Delete</Button></div>}<FieldEditor fields={selectedDefinition.fields} values={currentValues} onChange={updateValues} /></div></details></div></section>
    <main className="flex h-screen min-h-0 flex-col overflow-y-auto p-8"><div className="mx-auto w-full max-w-4xl"><header className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Wireframe theme</p><h2 className="mt-1 text-2xl font-bold">{mode === "builder" ? draft.pageTitle : selectedDefinition.name}</h2></div><Button variant="outline" size="sm" onClick={() => setFullPreview(true)}><MonitorSmartphone className="size-4" /> Full preview</Button></header><div className="mx-auto max-w-[390px] overflow-hidden bg-white shadow-xl">{mode === "builder" ? draft.instances.length ? draft.instances.map((instance) => <button key={instance.id} data-preview-instance={instance.id} className={cn("block w-full scroll-mt-[30vh] border-2 text-left transition", selectedInstanceId === instance.id ? "border-blue-500 bg-blue-50" : "border-transparent")} onClick={() => selectInstance(instance)}><ComponentHost componentId={instance.componentId} values={instance.values} theme={theme} /></button>) : <div className="p-10 text-center text-sm text-zinc-500">Add component from left.</div> : <ComponentHost componentId={selectedComponentId} values={currentValues} theme={theme} />}</div>{mode === "builder" && <div className="mx-auto mt-4 max-w-[390px] text-center text-xs text-zinc-500">Click component in preview to edit it. Draft autosaves locally.</div>}</div></main>
  </div>;
}
