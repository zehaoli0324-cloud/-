import React from "react";
import { interpolate, useCurrentFrame, spring, Easing } from "remotion";

// ===== Segment type (matches transcript.json) =====
export interface Segment {
  id: number;
  text: string;
  start: number;
  end: number;
  rotation: boolean;
  highlight: boolean;
}

// ===== Keyword detection =====
const KEYWORDS = ["AI", "最值钱", "赋能", "流程", "落地", "节点", "路径", "接入", "Agent", "人+AI"];

export function hasKeyword(text: string): boolean {
  return KEYWORDS.some((kw) => text.includes(kw));
}

// ===== 瀑布字号 =====
// distance 0 = current (220px), distance 1 = 160px, distance 2 = 120px, distance 3 = 90px
export function fontSizeAtDistance(dist: number): number {
  const sizes = [260, 190, 140, 110, 80, 0];
  return sizes[Math.min(dist, sizes.length - 1)] || 0;
}

// ===== 半句旋转 =====
export function useHalfRotation(currentTime: number, segment: Segment): number {
  if (!segment || segment.end <= segment.start) return 0;
  
  const progress = (currentTime - segment.start) / (segment.end - segment.start);
  
  // Rotation triggers when progress crosses 0.5
  // Easing: 0° → 8° → -5° → 0° over ~6 frames (0.2s)
  // Map progress 0.5→0.7 into rotation
  const rotProgress = Math.max(0, Math.min(1, (progress - 0.45) / 0.2));
  
  if (rotProgress <= 0) return 0;
  if (rotProgress >= 1) return 0;
  
  // Custom ease: 0→8→-5→0
  if (rotProgress < 0.33) {
    const t = rotProgress / 0.33;
    return interpolate(t, [0, 1], [0, 8], { easing: Easing.out(Easing.quad) });
  } else if (rotProgress < 0.66) {
    const t = (rotProgress - 0.33) / 0.33;
    return interpolate(t, [0, 1], [8, -5], { easing: Easing.inOut(Easing.quad) });
  } else {
    const t = (rotProgress - 0.66) / 0.34;
    return interpolate(t, [0, 1], [-5, 0], { easing: Easing.in(Easing.quad) });
  }
}

// ===== 入场特效 (blur + scale bounce) =====
export function useEntryEffect(enterFrame: number, currentFrame: number) {
  const local = currentFrame - enterFrame;
  if (local < 0) return { blur: 0, scale: 1, opacity: 0 };

  const progress = Math.min(local / 12, 1);

  const blur = interpolate(progress, [0, 1], [12, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const scale = spring({
    fps: 30,
    frame: local,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });

  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });

  return { blur: Math.max(0, blur), scale, opacity };
}
