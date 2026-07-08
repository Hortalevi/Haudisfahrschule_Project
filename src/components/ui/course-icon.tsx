import { Bike, BookOpen, CarFront, ClipboardCheck, HeartPulse, Truck, Car } from "lucide-react";
import type { Course } from "@/content/courses";
import { cn } from "@/lib/utils";

const iconMap: Record<Course["icon"], typeof CarFront> = {
  "steering-wheel": CarFront,
  bike: Bike,
  "heart-pulse": HeartPulse,
  "book-open": BookOpen,
  "clipboard-check": ClipboardCheck,
  truck: Truck,
  "car-taxi": Car,
};

export function CourseIcon({
  icon,
  className,
}: {
  icon: Course["icon"];
  className?: string;
}) {
  const Icon = iconMap[icon];
  return <Icon className={cn("h-6 w-6", className)} strokeWidth={1.75} />;
}
