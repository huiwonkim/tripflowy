// AUTO-GENERATED aggregator for data/spots/

import type { Spot } from "@/types/spot";
import { antalyaSpots } from "./antalya";
import { baliSpots } from "./bali";
import { bangkokSpots } from "./bangkok";
import { barcelonaSpots } from "./barcelona";
import { beijingSpots } from "./beijing";
import { bostonSpots } from "./boston";
import { cappadociaSpots } from "./cappadocia";
import { chiangmaiSpots } from "./chiangmai";
import { danangSpots } from "./danang";
import { florenceSpots } from "./florence";
import { fukuokaSpots } from "./fukuoka";
import { istanbulSpots } from "./istanbul";
import { kyotoSpots } from "./kyoto";
import { laSpots } from "./la";
import { lasvegasSpots } from "./lasvegas";
import { londonSpots } from "./london";
import { newyorkSpots } from "./newyork";
import { nhatrangSpots } from "./nhatrang";
import { osakaSpots } from "./osaka";
import { parisSpots } from "./paris";
import { pattayaSpots } from "./pattaya";
import { phuketSpots } from "./phuket";
import { romeSpots } from "./rome";
import { seattleSpots } from "./seattle";
import { shanghaiSpots } from "./shanghai";
import { tokyoSpots } from "./tokyo";
import { veniceSpots } from "./venice";

export const allSpots: Spot[] = [
  ...antalyaSpots,
  ...baliSpots,
  ...bangkokSpots,
  ...barcelonaSpots,
  ...beijingSpots,
  ...bostonSpots,
  ...cappadociaSpots,
  ...chiangmaiSpots,
  ...danangSpots,
  ...florenceSpots,
  ...fukuokaSpots,
  ...istanbulSpots,
  ...kyotoSpots,
  ...laSpots,
  ...lasvegasSpots,
  ...londonSpots,
  ...newyorkSpots,
  ...nhatrangSpots,
  ...osakaSpots,
  ...parisSpots,
  ...pattayaSpots,
  ...phuketSpots,
  ...romeSpots,
  ...seattleSpots,
  ...shanghaiSpots,
  ...tokyoSpots,
  ...veniceSpots,
];

export function getSpotsByCity(city: string): Spot[] {
  return allSpots.filter((s) => s.city === city);
}

export function getSpotById(id: string): Spot | undefined {
  return allSpots.find((s) => s.id === id);
}
