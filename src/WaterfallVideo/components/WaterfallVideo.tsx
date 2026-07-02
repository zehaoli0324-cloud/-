import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Audio } from "remotion";
import type { Segment } from "../utils/transcript";
import { fontSizeAtDistance } from "../utils/transcript";
import { SEGMENTS } from "../data/segments";

// ===== 常量 =====
const W = 1080;
const H = 1920;
const TOTAL_FRAMES = 2112;
const SCREEN_CENTER_Y = H * 0.38;

// ===== 文字块：3帧入场 + 历史残留 =====
// 当前句：3帧内 fadeIn + scale(0.88→1) + slideUp(15px→0)
// 历史句：缩小+变淡，保持可见
const TextBlock: React.FC<{
  segment: Segment;
  distance: number;
  frame: number;
  enterFrame: number;
}> = ({ segment, distance, frame, enterFrame }) => {
  const fs = fontSizeAtDistance(distance);
  if (fs <= 0) return null;

  // 自适应字号
  const maxTextWidth = W * 0.9;
  let totalW = 0;
  for (const ch of segment.text) {
    totalW += (ch >= "A" && ch <= "z") ? fs * 0.45 : fs * 0.82;
  }
  const adjustedFs = totalW > maxTextWidth ? Math.floor(maxTextWidth / totalW * fs) : fs;

  const localFrame = frame - enterFrame;

  // 入场动画（只有当前句）
  let opacity: number;
  let scale: number;
  let slideY: number;

  if (distance === 0) {
    // 3帧快速入场
    const enterProgress = Math.min(1, localFrame / 3);
    const easeOut = enterProgress * (2 - enterProgress);
    opacity = easeOut;
    scale = 0.88 + 0.12 * easeOut;
    slideY = (1 - easeOut) * 15;
  } else {
    // 历史句：无入场动画，固定缩小+变淡
    const historyOpacity = Math.max(0.08, 1 - distance * 0.28);
    const historyScale = Math.max(0.3, 1 - distance * 0.22);
    opacity = historyOpacity;
    scale = historyScale;
    slideY = 0;
  }

  const color = segment.highlight ? "#FFD700" : "#ffffff";
  const textShadow = segment.highlight
    ? "0 0 40px rgba(255,215,0,0.35)"
    : "0 0 20px rgba(255,255,255,0.06)";

  return (
    <div
      style={{
        width: maxTextWidth,
        display: "flex",
        justifyContent: "center",
        overflow: "visible",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: adjustedFs,
          fontWeight: 900,
          color,
          opacity,
          textShadow,
          whiteSpace: "pre-wrap",
          fontFamily: "'ZCOOL KuaiLe', 'Noto Sans SC', sans-serif",
          letterSpacing: "0.02em",
          lineHeight: 1.15,
          textAlign: "center",
          maxWidth: "100%",
          transform: `translateY(${slideY}px) scale(${scale})`,
        }}
      >
        {segment.text}
      </div>
    </div>
  );
};

// ===== 主组件 =====
export const WaterfallVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const currentTime = frame / 30;

  const segments: Segment[] = useMemo(() => SEGMENTS, []);

  // 找当前句
  const currentIdx = useMemo(() => {
    for (let i = segments.length - 1; i >= 0; i--) {
      if (currentTime >= segments[i].start && currentTime < segments[i].end) return i;
    }
    for (let i = segments.length - 1; i >= 0; i--) {
      if (currentTime >= segments[i].start) return i;
    }
    return 0;
  }, [currentTime, segments]);

  // 显示当前 + 前3句历史
  const visibleSegments = useMemo(() => {
    const result: { seg: Segment; dist: number; enterFrame: number }[] = [];
    for (let d = 0; d <= 3; d++) {
      const idx = currentIdx - d;
      if (idx >= 0 && idx < segments.length) {
        result.push({
          seg: segments[idx],
          dist: d,
          enterFrame: segments[idx].start * 30,
        });
      }
    }
    return result.reverse();
  }, [currentIdx, segments]);

  // 摄像机追踪：当前句始终在 SCREEN_CENTER_Y
  const cameraY = useMemo(() => {
    const paddingTop = H * 0.5;
    let totalH = 0;
    for (let d = 1; d <= 3; d++) {
      const idx = currentIdx - d;
      if (idx < 0) break;
      const fs = fontSizeAtDistance(d);
      totalH += fs * 1.3 + 30;
    }
    return paddingTop + totalH;
  }, [currentIdx]);

  return (
    <AbsoluteFill style={{ width: W, height: H, overflow: "hidden", background: "#0A0A0A" }}>
      <Audio src={staticFile("douyin_audio_v9.mp3")} />

      {/* 摄像机追踪层 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H * 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: H * 0.5,
          transform: `translateY(${-cameraY + SCREEN_CENTER_Y}px)`,
          opacity: interpolate(frame, [TOTAL_FRAMES - 15, TOTAL_FRAMES], [1, 0], { extrapolateLeft: "clamp" }),
        }}
      >
        {visibleSegments.map((vs) => (
          <TextBlock
            key={vs.seg.id}
            segment={vs.seg}
            distance={vs.dist}
            frame={frame}
            enterFrame={vs.enterFrame}
          />
        ))}
      </div>

      {/* 进度条 */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: W, height: 3, background: "rgba(255,255,255,0.05)" }}>
        <div style={{ width: `${(frame / TOTAL_FRAMES) * 100}%`, height: "100%", background: "linear-gradient(90deg, #FFD700, #FF6B35)" }} />
      </div>
    </AbsoluteFill>
  );
};