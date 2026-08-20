/* ============================================================
   Product Images Registry
   Exports all static product image assets for Green Store
   ============================================================ */

import bellPeppersImg from './Bell_Peppers__All_About_Them.jpg';
import productPhoto1 from './pinterest_1761835345414.jpg';
import productPhoto2 from './pinterest_1761835345414(1).jpg';
import productPhoto3 from './pinterest_1761835353985.jpg';
import bananasImg from './organic-bananas.jpg';
import placeholderImg from './placeholder.svg';

/* ── Named exports (per product) ──────────────────────────── */

/** Organic Bell Peppers */
export const bellPeppers = bellPeppersImg;
/** Fresh Strawberries */
export const strawberry = productPhoto1;
/** Fresh Mint Leaves */
export const mint = productPhoto2;
/** Organic Carrots */
export const carrots = productPhoto3;

/* ── Products without a dedicated photo use the placeholder ─ */

/** Organic Whole Milk */
export const wholeMilk = placeholderImg;
/** Green Tea Premium */
export const greenTea = placeholderImg;
/** Organic Apple Juice */
export const appleJuice = placeholderImg;
/** Fresh Basil */
export const freshBasil = placeholderImg;
/** Greek Yogurt */
export const greekYogurt = placeholderImg;
/** Organic Bananas */
export const bananas = bananasImg;

/** Generic placeholder fallback */
export const placeholderImage = placeholderImg;

/* ── Registry map ─────────────────────────────────────────── */

export const productImages = {
  bellPeppers: bellPeppersImg,
  strawberry: productPhoto1,
  mint: productPhoto2,
  carrots: productPhoto3,
  wholeMilk: placeholderImg,
  greenTea: placeholderImg,
  appleJuice: placeholderImg,
  freshBasil: placeholderImg,
  greekYogurt: placeholderImg,
  bananas: bananasImg,
  placeholder: placeholderImg,
} as const;

export default productImages;

