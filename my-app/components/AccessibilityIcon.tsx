import React from "react";
import {
  DoorOpen,
  Accessibility,
  ArrowUpDown,
  Bath,
  Maximize2,
  Car,
  Volume2,
  Languages,
  MessageSquare,
  Headphones,
  Eye,
  Footprints,
  HeartHandshake,
  VolumeX,
  Armchair,
  CheckCircle2,
} from "lucide-react";

interface AccessibilityIconProps {
  id?: string;
  name?: string;
  className?: string;
}

export function AccessibilityIcon({
  id = "",
  name = "",
  className = "h-4 w-4",
}: AccessibilityIconProps) {
  const key = (id || name).toLowerCase();

  if (key.includes("bezprog") || key.includes("drzwi") || key.includes("door")) {
    return <DoorOpen className={className} />;
  }
  if (key.includes("podjazd") || key.includes("rampa") || key.includes("wózk") || key.includes("ruch")) {
    return <Accessibility className={className} />;
  }
  if (key.includes("winda") || key.includes("schody") || key.includes("piętr")) {
    return <ArrowUpDown className={className} />;
  }
  if (key.includes("toalet") || key.includes("wc") || key.includes("łazienk")) {
    return <Bath className={className} />;
  }
  if (key.includes("szerok") || key.includes("przejsc") || key.includes("ciąg")) {
    return <Maximize2 className={className} />;
  }
  if (key.includes("park") || key.includes("postoj")) {
    return <Car className={className} />;
  }
  if (key.includes("indukcyjn") || key.includes("dźwięk") || key.includes("nagłośn")) {
    return <Volume2 className={className} />;
  }
  if (key.includes("pjm") || key.includes("migow") || key.includes("tłumacz")) {
    return <Languages className={className} />;
  }
  if (key.includes("napis") || key.includes("transkrypcj")) {
    return <MessageSquare className={className} />;
  }
  if (key.includes("audio") || key.includes("słuchawk")) {
    return <Headphones className={className} />;
  }
  if (key.includes("braille") || key.includes("wzrok") || key.includes("widzen")) {
    return <Eye className={className} />;
  }
  if (key.includes("sciezk") || key.includes("dotyk") || key.includes("faktur")) {
    return <Footprints className={className} />;
  }
  if (key.includes("pies") || key.includes("asyst")) {
    return <HeartHandshake className={className} />;
  }
  if (key.includes("cich") || key.includes("wycisz") || key.includes("sensoryczn")) {
    return <VolumeX className={className} />;
  }
  if (key.includes("odpoczynek") || key.includes("miejsce") || key.includes("siedząc") || key.includes("ław")) {
    return <Armchair className={className} />;
  }

  return <CheckCircle2 className={className} />;
}
