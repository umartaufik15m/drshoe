export const SPECIAL_SHOE_SURCHARGE = 5000;
export const EXPRESS_SURCHARGE = 15000;
export const EXPRESS_EXCLUDED_SERVICE_SLUGS = ["unyellowing", "repaint"];

const surchargeKeywords = ["putih", "white", "suede", "kulit", "leather", "outdoor"];

export type ShoeBookingItem = {
  brand?: string | null;
  shoeType?: string | null;
  materials?: string[] | null;
  otherMaterial?: string | null;
  color?: string | null;
};

function itemText(item: ShoeBookingItem) {
  return [
    item.brand,
    item.shoeType,
    item.color,
    ...(item.materials || []),
    item.otherMaterial
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getSurchargeReasonsForItem(item: ShoeBookingItem) {
  const text = itemText(item);
  const reasons = new Set<string>();

  if (text.includes("putih") || text.includes("white")) reasons.add("warna putih");
  if (text.includes("suede")) reasons.add("bahan suede");
  if (text.includes("kulit") || text.includes("leather")) reasons.add("bahan kulit");
  if (text.includes("outdoor")) reasons.add("jenis outdoor");

  return Array.from(reasons);
}

export function getSurchargeReasons(data: { shoeType?: string | null; shoeMaterial?: string | null }) {
  const text = `${data.shoeType || ""} ${data.shoeMaterial || ""}`.toLowerCase();
  const reasons = new Set<string>();

  if (text.includes("putih") || text.includes("white")) reasons.add("warna putih");
  if (text.includes("suede")) reasons.add("bahan suede");
  if (text.includes("kulit") || text.includes("leather")) reasons.add("bahan kulit");
  if (text.includes("outdoor")) reasons.add("jenis outdoor");

  return Array.from(reasons);
}

export function hasSpecialSurcharge(data: { shoeType?: string | null; shoeMaterial?: string | null }) {
  return surchargeKeywords.some((keyword) =>
    `${data.shoeType || ""} ${data.shoeMaterial || ""}`.toLowerCase().includes(keyword)
  );
}

export function calculateBookingPrice(data: {
  servicePrice?: number;
  serviceSlug?: string | null;
  quantity: number;
  shoeType?: string | null;
  shoeMaterial?: string | null;
  shoeItems?: ShoeBookingItem[] | null;
  isExpress?: boolean | null;
}) {
  const items = data.shoeItems?.length
    ? data.shoeItems
    : Array.from({ length: Math.max(1, data.quantity || 1) }).map(() => ({
        shoeType: data.shoeType,
        materials: data.shoeMaterial ? [data.shoeMaterial] : [],
        color: ""
      }));
  const quantity = Math.max(1, items.length);
  const baseTotal = (data.servicePrice || 0) * quantity;
  const itemDetails = items.map((item, index) => {
    const reasons = getSurchargeReasonsForItem(item);
    return {
      index: index + 1,
      ...item,
      reasons,
      surcharge: reasons.length > 0 ? SPECIAL_SHOE_SURCHARGE : 0
    };
  });
  const surchargeTotal = itemDetails.reduce((total, item) => total + item.surcharge, 0);
  const isExpressEligible = !data.serviceSlug || !EXPRESS_EXCLUDED_SERVICE_SLUGS.includes(data.serviceSlug);
  const expressSurchargeTotal = data.isExpress && isExpressEligible ? EXPRESS_SURCHARGE * quantity : 0;

  return {
    quantity,
    baseTotal,
    surchargePerPair: SPECIAL_SHOE_SURCHARGE,
    surchargeTotal,
    isExpressEligible,
    expressSurchargeTotal,
    total: baseTotal + surchargeTotal + expressSurchargeTotal,
    reasons: Array.from(new Set(itemDetails.flatMap((item) => item.reasons))),
    itemDetails
  };
}
