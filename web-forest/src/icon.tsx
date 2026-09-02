import type { CSSProperties } from "react";
import { icon, mark } from "./asset/kit";

type IconProps = { size?: number; active?: boolean; style?: CSSProperties };

function Glyph({ src, size, style }: { src: string; size: number; style?: CSSProperties }) {
  return <img src={src} width={size} height={size} alt="" aria-hidden="true" style={style} />;
}

export function HomeIcon({ size = 24, active }: IconProps) {
  return <Glyph src={icon.home} size={size} style={{ opacity: active === false ? 0.72 : 1 }} />;
}

export function MapIcon({ size = 24, active }: IconProps) {
  return <Glyph src={icon.map} size={size} style={{ opacity: active === false ? 0.72 : 1 }} />;
}

export function JournalIcon({ size = 24, active }: IconProps) {
  return <Glyph src={icon.journal} size={size} style={{ opacity: active === false ? 0.72 : 1 }} />;
}

export function PlanIcon({ size = 24, active }: IconProps) {
  return <Glyph src={icon.plan} size={size} style={{ opacity: active === false ? 0.72 : 1 }} />;
}

export function CheckIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.check} size={size} />;
}

export function PinIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.pin} size={size} />;
}

export function CameraIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.camera} size={size} />;
}

export function RestrictedIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.restricted} size={size} />;
}

export function CanopyIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.canopy} size={size} />;
}

/** Leaf inside viewfinder brackets — "identify this", never "we identified it". */
export function LeafScanIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.leaf_scan} size={size} />;
}

export function LocateIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.locate} size={size} />;
}

export function WalkIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.walk} size={size} />;
}

/** The big round capture control. Reads at 64px on the map, not in a list row. */
export function ShutterIcon({ size = 30 }: { size?: number }) {
  return <Glyph src={icon.shutter} size={size} />;
}

export function ExportIcon({ size = 20 }: { size?: number }) {
  return <Glyph src={icon.export} size={size} />;
}

export function EncounterDisc({ size = 32 }: { size?: number }) {
  return <Glyph src={icon.encounter} size={size} />;
}

export function PlayerMark({ size = 20 }: { size?: number }) {
  return <Glyph src={icon.player} size={size} />;
}

export function PlantMark({ size = 32 }: { size?: number }) {
  return <Glyph src={mark.plant} size={size} />;
}

/** @deprecated Field Guide header uses PlantMark. Kept for program chrome. */
export function FourPersonMark({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/brand/logo-upright.svg"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}

export function LeafMark({ size = 40 }: { size?: number; color?: string }) {
  return <PlantMark size={size} />;
}

export function CloseIcon({ size = 22 }: { size?: number }) {
  return <Glyph src={icon.close} size={size} />;
}
