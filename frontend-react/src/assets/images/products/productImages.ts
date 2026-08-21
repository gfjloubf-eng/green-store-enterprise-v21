/*
 * Product Images Registry
 *
 * Only verified local image assets belong here. The key name is the canonical
 * produce key used by the product catalog and education layer.
 */

import bellPeppersReal from './bell-peppers-real.jpg';
import carrotsReal from './carrots-real.jpg';
import mintReal from './mint-real.jpg';
import strawberryReal from './strawberry-real.jpg';
import bananasReal from './organic-bananas.jpg';
import placeholderImg from './placeholder.svg';

/** Verified local images, keyed by canonical produce identity. */
export const verifiedProductImages = {
  'bell-peppers': bellPeppersReal,
  carrot: carrotsReal,
  mint: mintReal,
  strawberry: strawberryReal,
  banana: bananasReal,
} as const;

/** Named exports retained for compatibility with existing screens. */
export const bellPeppers = verifiedProductImages['bell-peppers'];
export const carrots = verifiedProductImages.carrot;
export const mint = verifiedProductImages.mint;
export const strawberry = verifiedProductImages.strawberry;
export const bananas = verifiedProductImages.banana;

/** Non-produce legacy products remain explicitly unillustrated. */
export const wholeMilk = placeholderImg;
export const greenTea = placeholderImg;
export const appleJuice = placeholderImg;
export const freshBasil = placeholderImg;
export const greekYogurt = placeholderImg;
export const placeholderImage = placeholderImg;

/** Resolve only by canonical key; unknown keys never borrow another product's image. */
export function getVerifiedProductImage(produceKey?: string | null): string {
  if (!produceKey) return placeholderImage;
  return verifiedProductImages[produceKey as keyof typeof verifiedProductImages] || placeholderImage;
}

export const productImages = {
  ...verifiedProductImages,
  wholeMilk,
  greenTea,
  appleJuice,
  freshBasil,
  greekYogurt,
  bananas,
  placeholder: placeholderImage,
} as const;

export default productImages;
