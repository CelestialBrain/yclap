import { species_art } from "./asset/kit";

type Props = { species_code: string; is_silhouette?: boolean; size?: number };

export default function Botanical({ species_code, is_silhouette, size }: Props) {
  const src = !is_silhouette && species_art[species_code] ? species_art[species_code] : species_art.silhouette;
  return (
    <div style={{ width: size ?? "100%", aspectRatio: "1 / 1" }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
