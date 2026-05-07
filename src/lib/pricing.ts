export const SPECIAL_SHOE_SURCHARGE = 5000;
export const EXPRESS_SURCHARGE = 15000;
export const EXPRESS_EXCLUDED_SERVICE_SLUGS = ["unyellowing", "repaint"];

const surchargeKeywords = ["putih", "white", "suede", "kulit", "leather", "outdoor"];

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
  isExpress?: boolean | null;
}) {
  const quantity = Math.max(1, data.quantity || 1);
  const baseTotal = (data.servicePrice || 0) * quantity;
  const surchargePerPair = hasSpecialSurcharge(data) ? SPECIAL_SHOE_SURCHARGE : 0;
  const surchargeTotal = surchargePerPair * quantity;
  const isExpressEligible = !data.serviceSlug || !EXPRESS_EXCLUDED_SERVICE_SLUGS.includes(data.serviceSlug);
  const expressSurchargeTotal = data.isExpress && isExpressEligible ? EXPRESS_SURCHARGE * quantity : 0;

  return {
    baseTotal,
    surchargePerPair,
    surchargeTotal,
    isExpressEligible,
    expressSurchargeTotal,
    total: baseTotal + surchargeTotal + expressSurchargeTotal,
    reasons: getSurchargeReasons(data)
  };
}
