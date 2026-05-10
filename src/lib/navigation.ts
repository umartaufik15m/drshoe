import { CalendarCheck, Home, MapPin, PackageCheck, Shirt, Store } from "lucide-react";

export const navItems = [
  { href: "/", label: "Home", description: "Kembali ke halaman utama DR. SHOE.", icon: Home },
  { href: "/#layanan", label: "Harga & Layanan", description: "Berbagai layanan cuci dan perawatan sepatu.", icon: Shirt },
  { href: "/drop-point", label: "Drop Point", description: "Temukan lokasi drop point terdekat.", icon: MapPin },
  { href: "/franchise", label: "Franchise", description: "Gabung jadi bagian dari keluarga DR. SHOE.", icon: Store },
  { href: "/booking", label: "Booking", description: "Booking layanan cuci sepatu dengan mudah.", icon: CalendarCheck },
  { href: "/status", label: "Cek Status", description: "Cek status pesananmu secara real-time.", icon: PackageCheck }
];
