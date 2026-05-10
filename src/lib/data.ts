import type { BeforeAfter, DropPoint, PromoBanner, Service, Testimonial } from "@/lib/types";

export const fallbackPromoBanners: PromoBanner[] = [
  {
    title: "Fresh Kicks, Fresh Move",
    subtitle: "Promo treatment sepatu harian untuk kamu yang aktif, street-ready, dan anti tampil kusam.",
    badge_text: "Promo Drop",
    image_url: "/images/hero-after.jpg",
    cta_label: "Booking Sekarang",
    cta_href: "/booking",
    sort_order: 1,
    is_active: true
  },
  {
    title: "Before Kotor, After Pop",
    subtitle: "Deep Clean, Fast Clean, dan Repaint dengan sentuhan rapi dari tim DR. SHOE Bekasi.",
    badge_text: "Street Care",
    image_url: "/images/hero-before.jpg",
    cta_label: "Lihat Layanan",
    cta_href: "/#layanan",
    sort_order: 2,
    is_active: true
  }
];

export const fallbackServices: Service[] = [
  {
    name: "Fast Clean",
    slug: "fast-clean",
    description: "Cleaning cepat untuk sepatu dengan kotoran ringan.",
    price: 40000,
    sort_order: 1
  },
  {
    name: "Deep Clean",
    slug: "deep-clean",
    description: "Pembersihan menyeluruh bagian luar, dalam, midsole, dan outsole.",
    price: 45000,
    sort_order: 2
  },
  {
    name: "Extra Dirty",
    slug: "extra-dirty",
    description: "Treatment untuk sepatu dengan kondisi sangat kotor.",
    price: 60000,
    sort_order: 3
  },
  {
    name: "Unyellowing",
    slug: "unyellowing",
    description: "Treatment untuk sol atau bagian sepatu yang menguning.",
    price: 60000,
    sort_order: 4
  },
  {
    name: "Repaint",
    slug: "repaint",
    description: "Cat ulang bagian sepatu tertentu agar terlihat lebih segar.",
    price: 150000,
    sort_order: 5
  }
];

export const fallbackDropPoints: DropPoint[] = [
  {
    name: "Kopi Peneleh",
    slug: "kopi-peneleh",
    maps_url: "https://maps.app.goo.gl/MqY5fdgP135bJnY16",
    description: "Titip sepatu lebih mudah melalui partner resmi DR. SHOE.",
    is_active: true
  },
  {
    name: "Coffee Studio",
    slug: "coffee-studio",
    maps_url: "https://maps.app.goo.gl/T5MWyFhLBETNnB3v5",
    description:
      "Drop sepatu di lokasi partner dan tim DR. SHOE akan memproses treatment sesuai layanan yang dipilih.",
    is_active: true
  }
];

export const fallbackTestimonials: Testimonial[] = [
  {
    customer_name: "Rafi",
    rating: 5,
    service_name: "Deep Clean",
    comment: "Sepatu harian jadi wangi dan bersih lagi. Adminnya responsif.",
    is_active: true
  },
  {
    customer_name: "Nadia",
    rating: 5,
    service_name: "Unyellowing",
    comment: "Bagian sol yang menguning jauh lebih rapi. Hasilnya kelihatan banget.",
    is_active: true
  },
  {
    customer_name: "Dimas",
    rating: 5,
    service_name: "Fast Clean",
    comment: "Cocok buat sepatu kerja yang perlu bersih cepat.",
    is_active: true
  }
];

export const fallbackBeforeAfter: BeforeAfter[] = [
  {
    title: "Sneakers Daily Wear",
    service_name: "Deep Clean",
    before_image_url: "/images/results/deep-clean-before.png",
    after_image_url: "/images/results/deep-clean-after.png",
    description: "Upper, midsole, dan outsole dibersihkan menyeluruh."
  },
  {
    title: "Canvas Refresh",
    service_name: "Fast Clean",
    before_image_url: "/images/results/fastclean-before.png",
    after_image_url: "/images/results/fastclean-after.png",
    description: "Cleaning cepat untuk noda ringan pada sepatu harian."
  },
  {
    title: "Repaint Restoration",
    service_name: "Repaint",
    before_image_url: "/images/results/repaint-before.png",
    after_image_url: "/images/results/repaint-after.png",
    description: "Warna sepatu diperbarui agar tampil lebih bersih dan rapi."
  }
];
