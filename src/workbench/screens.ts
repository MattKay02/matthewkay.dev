// Product screens come from the products themselves: each publishes its bare
// screens by id in its /studio.json, and scripts/fetch-screens.mjs reads them
// into src/data/screens.json on every build. The board asks for a screen by
// product and id; when the product doesn't list it (yet), or its image didn't
// load at build, the saved copy in public/work is used instead.
import feeds from '@/data/screens.json'
import { IMG } from './parts'

export type ProductKey = 'frunt' | 'mgkfitness'

export interface Saved { img: string; w: number; h: number; alt: string }
export interface ScreenSrc { src: string; w: number; h: number; alt: string; fromFeed: boolean }

type FeedScreen = { src: string; width: number; height: number; alt: string }
const products = feeds.products as Partial<Record<ProductKey, { screens: Record<string, FeedScreen> }>>

export function screen(product: ProductKey, id: string, saved: Saved): ScreenSrc {
  const f = products[product]?.screens?.[id]
  if (f && f.width && f.height) return { src: f.src, w: f.width, h: f.height, alt: f.alt || saved.alt, fromFeed: true }
  return { src: IMG(saved.img), w: saved.w, h: saved.h, alt: saved.alt, fromFeed: false }
}

/** frunt's screens on the board, by its ids (frunt-web src/lib/studio-screens.ts). */
export const FRUNT_SCREENS = {
  home: screen('frunt', 'home', { img: 'frunt-home', w: 1100, h: 619, alt: 'frunt manager dashboard, home' }),
  ask: screen('frunt', 'ask', { img: 'frunt-ask', w: 1280, h: 720, alt: 'Ask frunt: an answer about peanut allergen controls, citing three source documents' }),
  documents: screen('frunt', 'documents', { img: 'frunt-docs', w: 1100, h: 619, alt: 'frunt documents library' }),
  training: screen('frunt', 'training', { img: 'frunt-training', w: 1100, h: 619, alt: 'frunt training courses' }),
  staffAsk: screen('frunt', 'staff-ask', { img: 'frunt-m-ask', w: 334, h: 736, alt: 'frunt staff app, asking a question' }),
  staffTraining: screen('frunt', 'staff-training', { img: 'frunt-m-training', w: 334, h: 736, alt: 'frunt staff app, training' }),
}

/** MGKFitness's screens on the board, by its ids (mgk-fitness web/app/studio.json/screens.ts). Liftio 1.4 is retired and stays saved. */
export const MGK_SCREENS = {
  liftLog: screen('mgkfitness', 'lift-log', { img: 'lift-log', w: 560, h: 1212, alt: 'Lift 2.0 logging a workout' }),
  liftPlan: screen('mgkfitness', 'lift-plan', { img: 'lift-plan', w: 560, h: 1212, alt: 'Lift 2.0 plan' }),
  runRecord: screen('mgkfitness', 'run-record', { img: 'run-record', w: 560, h: 1214, alt: 'Run recording a run' }),
  runPlan: screen('mgkfitness', 'run-plan', { img: 'run-plan', w: 560, h: 1214, alt: 'Run training plan' }),
}

/** A screen as MacBook slide fields. */
export const slide = (s: ScreenSrc) => ({ src: s.src, w: s.w, h: s.h, alt: s.alt })

/** A screen as IPhone / Shot fields. */
export const phone = (s: ScreenSrc) => ({ src: s.src, iw: s.w, ih: s.h, alt: s.alt })
