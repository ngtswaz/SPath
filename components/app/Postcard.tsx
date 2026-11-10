import type { Destination, SceneKind } from "@/lib/app-data";
import PostcardScene from "@/components/paper/PostcardScene";

const SCENE_ALT: Record<SceneKind, string> = {
  harbour: "a low sun over hills, rooftops and a ship in the harbour",
  mountains: "snow capped mountains, a hilltop tower and a winding path",
  desert: "a high sun over desert mesas and cactus",
};

export function sceneLabel(d: Pick<Destination, "name" | "scene">): string {
  return `Illustration of ${d.name}: ${SCENE_ALT[d.scene]}`;
}

/**
 * The front of a postcard: a white card with a picture and whatever the
 * caller writes underneath it. Tilt and position are the caller's job, so
 * the same card can sit straight in a feed or crooked on a pinboard.
 */
export default function Postcard({
  destination,
  sceneClassName = "h-[130px]",
  className = "",
  children,
}: {
  destination: Pick<Destination, "name" | "scene">;
  sceneClassName?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative border border-ink/20 bg-bone p-2 shadow-card ${className}`}>
      <PostcardScene scene={destination.scene} label={sceneLabel(destination)} className={sceneClassName} />
      {children}
    </div>
  );
}
