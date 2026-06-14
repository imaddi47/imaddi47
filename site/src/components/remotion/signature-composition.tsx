import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

function drawOffset(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [1, 0], clamp);
}

export const SignatureComposition: React.FC = () => {
  const frame = useCurrentFrame();

  const aLeftOffset = drawOffset(frame, 0, 20);
  const aRightOffset = drawOffset(frame, 15, 30);
  const aBarOffset = drawOffset(frame, 25, 40);
  const kStemOffset = drawOffset(frame, 40, 60);
  const kUpperOffset = drawOffset(frame, 50, 65);
  const kLowerOffset = drawOffset(frame, 60, 80);

  const groupOpacity = interpolate(frame, [100, 120], [1, 0], clamp);

  const labelOpacity = interpolate(
    frame,
    [80, 95, 100, 120],
    [0, 1, 1, 0],
    clamp
  );

  return (
    <AbsoluteFill style={{ background: "transparent", justifyContent: "center", alignItems: "center" }}>
      <svg
        viewBox="0 0 240 160"
        width={240}
        height={160}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity={groupOpacity} stroke="#b8410e" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path
            d="M 28 130 L 68 30"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={aLeftOffset}
          />
          <path
            d="M 68 30 L 108 130"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={aRightOffset}
          />
          <path
            d="M 43 93 L 93 93"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={aBarOffset}
          />

          <path
            d="M 136 30 L 136 130"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={kStemOffset}
          />
          <path
            d="M 136 82 L 204 30"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={kUpperOffset}
          />
          <path
            d="M 136 82 L 212 130"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={kLowerOffset}
          />
        </g>

        <text
          x="120"
          y="152"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={10}
          letterSpacing={3}
          fill="#b8410e"
          opacity={labelOpacity}
        >
          imaddi47
        </text>
      </svg>
    </AbsoluteFill>
  );
};
