import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronDown, ClipboardPlus, Component, Copy, Eye, GripVertical, MonitorSmartphone, Plus, Trash2, Wrench } from "lucide-react";
import heroDefinition from "../../components/hero/definition.json";
import feedDefinition from "../../components/feed/definition.json";
// Component renderers remain source-owned. React only hosts their DOM output.
// @ts-ignore
import { renderHero } from "../../components/hero/renderer.js";
// @ts-ignore
import { renderFeed } from "../../components/feed/renderer.js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Primitive = string | number | boolean | null;
type Values = Record<string, unknown>;
type Field = { id: string; label: string; type: string; required?: boolean; options?: string[]; fields?: Field[]; itemFields?: Field[] };
type Definition = { id: string; name: string; category: string; fields: Field[]; defaults: Values };
type Instance = { id: string; componentId: string; values: Values };
type Draft = { version: number; brand: keyof typeof themes; scenario: string; pageTitle: string; instances: Instance[] };

const definitions = [heroDefinition, feedDefinition] as Definition[];
const byId = new Map(definitions.map((definition) => [definition.id, definition]));
const renderers: Record<string, (values: Values, theme: unknown) => HTMLElement> = { hero: renderHero, feed: renderFeed };
const themes = {
  gamesradar: { brand: "gamesradar", color: { accent: "#ff6600", surface: "#161616", text: "#ffffff", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#008a80", labelAnalysis: "#7156c8", labelGuide: "#a85c00" }, font: { display: "Figtree, sans-serif", body: "Figtree, sans-serif" }, typography: { h1: { fontFamily: "Figtree, sans-serif", fontSize: "clamp(40px, 13vw, 64px)", fontWeight: 400, lineHeight: ".9", letterSpacing: "-.04em" } }, radius: { card: "16px" } },
  pcgamer: { brand: "pcgamer", color: { accent: "#e31b23", surface: "#111111", text: "#ffffff", background: "#ffffff", ink: "#1a1a1a", muted: "#737373", border: "#e6e6e6", labelNews: "#b11f26", labelAnalysis: "#6b55ab", labelGuide: "#9c5900" }, font: { display: "Roboto Condensed, sans-serif", body: "Arial, sans-serif" }, typography: { h1: { fontFamily: "Roboto Condensed, sans-serif", fontSize: "clamp(40px, 13vw, 62px)", fontWeight: 700, lineHeight: ".92", letterSpacing: "-.025em" } }, radius: { card: "0px" } },
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const initialDraft = (): Draft => ({ version: 1, brand: "gamesradar", scenario: "GTA 6", pageTitle: "GTA 6 hub", instances: [{ id: crypto.randomUUID(), componentId: "hero", values: clone(heroDefinition.defaults) }] });
function storedDraft(): Draft { try { return JSON.parse(localStorage.getItem("content-hub-workshop-draft") || "") as Draft; } catch { return initialDraft(); } }
function setAtPath(value: Values, path: string[], next: unknown): Values { const copy = clone(value); let cursor: Record<string, unknown> = copy; path.slice(0, -1).forEach((key) => { cursor[key] = typeof cursor[key] === "object" && cursor[key] ? clone(cursor[key]) : {}; cursor = cursor[key] as Record<string, unknown>; }); cursor[path.at(-1)!] = next; return copy; }
function emptyValues(fields: Field[]): Values { return Object.fromEntries(fields.map((field) => [field.id, field.type === "object" ? emptyValues(field.fields || []) : field.type === "collection" ? [] : ""])); }

function ComponentHost({ componentId, values, theme }: { componentId: string; values: Values; theme: unknown }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => { const renderer = renderers[componentId]; if (host.current && renderer) host.current.replaceChildren(renderer(values, theme)); }, [componentId, values, theme]);
  return <div ref={host} />;
}

function FieldEditor({ fields, values, onChange }: { fields: Field[]; values: Values; onChange: (next: Values) => void }) {
  const update = (path: string[], value: unknown) => onChange(setAtPath(values, path, value));
  return <div className="grid gap-4">{fields.map((field) => <div key={field.id} className="grid gap-1.5">
    {field.type !== "object" && field.type !== "collection" && <label className="text-xs font-semibold text-zinc-700" htmlFor={field.id}>{field.label}{field.required && <span className="text-red-600"> *</span>}</label>}
    {field.type === "textarea" ? <textarea id={field.id} className="min-h-20 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm" value={String(values[field.id] || "")} onChange={(event) => update([field.id], event.target.value)} /> : null}
    {field.type === "select" ? <select id={field.id} className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm" value={String(values[field.id] || "")} onChange={(event) => update([field.id], event.target.value)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : null}
    {!["textarea", "select", "object", "collection"].includes(field.type) ? <input id={field.id} className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm" type={field.type === "url" ? "url" : "text"} value={String(values[field.id] || "")} onChange={(event) => update([field.id], event.target.value)} /> : null}
    {field.type === "object" && <fieldset className="grid gap-3 rounded-md border border-zinc-200 p-3"><legend className="px-1 text-xs font-semibold">{field.label}</legend><FieldEditor fields={field.fields || []} values={(values[field.id] as Values) || {}} onChange={(next) => update([field.id], next)} /></fieldset>}
    {field.type === "collection" && <fieldset className="grid gap-3 rounded-md border border-zinc-200 p-3"><legend className="px-1 text-xs font-semibold">{field.label}</legend>{((values[field.id] as Values[]) || []).map((item, index) => <div key={index} className="rounded border border-zinc-100 p-3"><div className="mb-2 flex items-center justify-between text-xs font-medium">Article {index + 1}<Button variant="ghost" size="sm" onClick={() => update([field.id], ((values[field.id] as Values[]) || []).filter((_, itemIndex) => itemIndex !== index))}>Remove</Button></div><FieldEditor fields={field.itemFields || []} values={item} onChange={(next) => { const items = [...((values[field.id] as Values[]) || [])]; items[index] = next; update([field.id], items); }} /></div>)}<Button variant="outline" size="sm" onClick={() => update([field.id], [...((values[field.id] as Values[]) || []), emptyValues(field.itemFields || [])])}><Plus className="size-3" /> Add article</Button></fieldset>}
  </div>)}</div>;
}

export default function App() {
  const [mode, setMode] = useState<"builder" | "viewer">("builder");
  const [draft, setDraft] = useState<Draft>(storedDraft);
  const [selectedComponentId, setSelectedComponentId] = useState("hero");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(draft.instances[0]?.id || null);
  const [viewerValues, setViewerValues] = useState<Record<string, Values>>(() => Object.fromEntries(definitions.map((definition) => [definition.id, clone(definition.defaults)])));
  useEffect(() => { localStorage.setItem("content-hub-workshop-draft", JSON.stringify(draft)); }, [draft]);
  const selectedDefinition = byId.get(selectedComponentId)!;
  const selectedInstance = draft.instances.find((instance) => instance.id === selectedInstanceId);
  const currentValues = mode === "builder" && selectedInstance ? selectedInstance.values : viewerValues[selectedComponentId];
  const updateValues = (values: Values) => mode === "builder" && selectedInstance ? setDraft((current) => ({ ...current, instances: current.instances.map((instance) => instance.id === selectedInstance.id ? { ...instance, values } : instance) })) : setViewerValues((current) => ({ ...current, [selectedComponentId]: values }));
  const addComponent = (componentId: string) => { const definition = byId.get(componentId)!; const instance = { id: crypto.randomUUID(), componentId, values: clone(definition.defaults) }; setDraft((current) => ({ ...current, instances: [...current.instances, instance] })); setSelectedComponentId(componentId); setSelectedInstanceId(instance.id); };
  const theme = themes[draft.brand];
  const title = mode === "builder" ? "Builder" : "Component viewer";
  return <div className="grid min-h-screen grid-cols-[248px_minmax(340px,1fr)_minmax(580px,2fr)] bg-zinc-100">
    <aside className="flex min-h-screen flex-col border-r border-zinc-200 bg-white p-4"><div className="mb-5 flex items-center gap-2 font-bold"><Component className="size-5" /> Content hub workshop</div><div className="mb-6 grid gap-2"><label className="text-xs font-semibold text-zinc-600">Brand theme</label><select className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm" value={draft.brand} onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value as Draft["brand"] }))}><option value="gamesradar">GamesRadar+</option><option value="pcgamer">PC Gamer</option></select><p className="text-xs leading-5 text-zinc-500">Saved with page draft.</p></div><nav className="grid gap-1"><Button variant={mode === "builder" ? "default" : "ghost"} className="justify-start" onClick={() => setMode("builder")}><Wrench className="size-4" /> Builder</Button><Button variant={mode === "viewer" ? "default" : "ghost"} className="justify-start" onClick={() => setMode("viewer")}><Eye className="size-4" /> Component viewer</Button></nav></aside>
    <section className="flex min-h-screen flex-col border-r border-zinc-200 bg-white"><header className="border-b px-5 py-4"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{mode === "builder" ? "Page authoring" : "Isolated catalogue"}</p><h1 className="mt-1 text-lg font-bold">{title}</h1></header><div className="min-h-0 flex-1 overflow-y-auto p-5"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Components</p><div className="grid gap-2">{definitions.map((definition) => <button key={definition.id} className={cn("rounded-md border p-3 text-left", selectedComponentId === definition.id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:bg-zinc-50")} onClick={() => { setSelectedComponentId(definition.id); if (mode === "builder") { const match = draft.instances.find((instance) => instance.componentId === definition.id); setSelectedInstanceId(match?.id || null); } }}><div className="flex items-center justify-between"><span className="font-semibold">{definition.name}</span><ChevronDown className="size-4 text-zinc-400" /></div><span className="text-xs text-zinc-500">{definition.category}</span></button>)}</div>{mode === "builder" && <Button className="mt-3 w-full" variant="outline" onClick={() => addComponent(selectedComponentId)}><Plus className="size-4" /> Add {selectedDefinition.name}</Button>}<div className="mt-6 border-t pt-5"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{selectedInstance ? "Edit selected instance" : "Edit preview"}</p>{mode === "builder" && selectedInstance && <Button variant="ghost" size="sm" onClick={() => setDraft((current) => ({ ...current, instances: current.instances.filter((instance) => instance.id !== selectedInstance.id) }))}><Trash2 className="size-4" /></Button>}</div><FieldEditor fields={selectedDefinition.fields} values={currentValues} onChange={updateValues} /></div></div></section>
    <main className="min-h-screen overflow-y-auto p-8"><div className="mx-auto max-w-4xl"><header className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{draft.brand === "gamesradar" ? "GamesRadar+" : "PC Gamer"}</p><h2 className="mt-1 text-2xl font-bold">{mode === "builder" ? draft.pageTitle : selectedDefinition.name}</h2></div><span className="inline-flex items-center gap-2 text-sm text-zinc-500"><MonitorSmartphone className="size-4" /> Mobile preview</span></header><div className="mx-auto max-w-[390px] overflow-hidden bg-white shadow-xl">{mode === "builder" ? draft.instances.length ? draft.instances.map((instance) => <button key={instance.id} className={cn("block w-full border-2 text-left", selectedInstanceId === instance.id ? "border-blue-500" : "border-transparent")} onClick={() => { setSelectedInstanceId(instance.id); setSelectedComponentId(instance.componentId); }}><ComponentHost componentId={instance.componentId} values={instance.values} theme={theme} /></button>) : <div className="p-10 text-center text-sm text-zinc-500">Add component from left.</div> : <ComponentHost componentId={selectedComponentId} values={currentValues} theme={theme} />}</div>{mode === "builder" && <div className="mx-auto mt-4 max-w-[390px] text-center text-xs text-zinc-500">Click component in preview to edit it. Draft autosaves locally.</div>}</div></main>
  </div>;
}
