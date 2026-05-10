export type DeliveryMethod = "direct" | "pickup" | "drop_point";
export type OrderStatus =
  | "new"
  | "confirmed"
  | "picked_up"
  | "in_treatment"
  | "quality_check"
  | "ready"
  | "completed"
  | "cancelled";

export type FranchiseStatus = "new" | "contacted" | "qualified" | "rejected" | "closed";
export type PartnershipType =
  | "franchise_outlet"
  | "drop_point_partner"
  | "investor_partner"
  | "coffee_shop_community_collab";

export type Service = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  is_active?: boolean;
  sort_order?: number;
};

export type DropPoint = {
  id?: string;
  name: string;
  slug: string;
  address?: string | null;
  maps_url?: string | null;
  description: string | null;
  is_active?: boolean;
};

export type Testimonial = {
  id?: string;
  customer_name: string;
  rating: number;
  service_name?: string | null;
  comment: string | null;
  is_active?: boolean;
};

export type BeforeAfter = {
  id?: string;
  title: string;
  service_name?: string | null;
  before_image_url?: string | null;
  after_image_url?: string | null;
  description?: string | null;
  is_active?: boolean;
};

export type PromoBanner = {
  id?: string;
  slug?: string | null;
  title: string;
  subtitle?: string | null;
  badge_text?: string | null;
  image_url: string;
  mobile_image_url?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  sort_order?: number | null;
  is_active?: boolean;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address?: string | null;
  shoe_items?: import("@/lib/pricing").ShoeBookingItem[] | null;
  shoe_type?: string | null;
  shoe_material?: string | null;
  service_id?: string | null;
  service_name?: string | null;
  service_price?: number | null;
  quantity: number;
  surcharge_total?: number | null;
  is_express?: boolean | null;
  express_surcharge_total?: number | null;
  estimated_total?: number | null;
  delivery_method: DeliveryMethod;
  drop_point_id?: string | null;
  drop_point_name?: string | null;
  image_url?: string | null;
  order_images?: string[] | null;
  notes?: string | null;
  status: OrderStatus;
  created_at?: string | null;
  updated_at?: string | null;
};

export type FranchiseInquiry = {
  id: string;
  full_name: string;
  phone: string;
  city?: string | null;
  has_location?: boolean | null;
  estimated_capital?: string | null;
  partnership_type: PartnershipType;
  notes?: string | null;
  status: FranchiseStatus;
  created_at?: string | null;
  updated_at?: string | null;
};
