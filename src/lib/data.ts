import type { BeforeAfter, DropPoint, Service, Testimonial } from "@/lib/types";

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
    description: "Upper, midsole, dan outsole dibersihkan menyeluruh."
  },
  {
    title: "White Sole Recovery",
    service_name: "Unyellowing",
    description: "Treatment untuk mengurangi tampilan sol yang menguning."
  },
  {
    title: "Canvas Refresh",
    service_name: "Fast Clean",
    description: "Cleaning cepat untuk noda ringan pada sepatu harian."
  }
];
