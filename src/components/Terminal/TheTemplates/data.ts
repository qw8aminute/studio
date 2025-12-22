export type TemplateId = "data" | "decks" | "demos"

export type TemplateExample = {
  id: string
  title: string
  description: string
}

export type TemplateCard = {
  id: TemplateId
  title: string
  subtitle: string
  blurb: string
  accent: string
  examples: TemplateExample[]
}

export const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: "data",
    title: "DATA",
    subtitle: "MSFT Proxy Dashboard",
    blurb: "Executive KPIs, market narrative, and a data dictionary—live, public, and clean.",
    accent: "linear-gradient(90deg, rgba(0,255,200,.45), rgba(255,200,0,.25), rgba(255,60,80,.20))",
    examples: [
      { id: "kpis", title: "Executive KPIs", description: "Proxy KPIs mapped to public financials." },
      { id: "narrative", title: "Market Narrative", description: "Flow + volatility context with headlines." },
      { id: "dictionary", title: "Data Dictionary", description: "Definitions, formulas, limits, tags." },
    ],
  },
  {
    id: "decks",
    title: "DECKS",
    subtitle: "HTML Render System",
    blurb: "Storytelling + analysis—two styles, one engine.",
    accent: "linear-gradient(90deg, rgba(120,180,255,.35), rgba(200,200,255,.15))",
    examples: [
      { id: "thirdai", title: "ThirdAI Pitch", description: "Dark, cinematic, high conviction." },
      { id: "vendor", title: "Vendor Selection", description: "Light, crisp, hierarchy-forward." },
    ],
  },
  {
    id: "demos",
    title: "DEMOS",
    subtitle: "Video Proof",
    blurb: "Product runaround + technical walk-through.",
    accent: "linear-gradient(90deg, rgba(255,120,200,.25), rgba(120,255,200,.20), rgba(255,200,0,.15))",
    examples: [
      { id: "runaround", title: "ThirdAI Runaround", description: "Fast product tour." },
      { id: "technical", title: "Technical Demo", description: "Under-the-hood walkthrough." },
    ],
  },
]
