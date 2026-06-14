"use client";

import { Player } from "@remotion/player";
import { SignatureComposition } from "./signature-composition";

export function Signature({
  width = 180,
  height = 120,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <Player
        component={SignatureComposition}
        durationInFrames={120}
        fps={30}
        compositionWidth={240}
        compositionHeight={160}
        loop
        autoPlay
        controls={false}
        acknowledgeRemotionLicense
        style={{ width, height, background: "transparent" }}
      />
    </div>
  );
}
