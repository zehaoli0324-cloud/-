# Waterfall Typography — Remotion Kinetic Typography Video Generator

A fully automated vertical (1080×1920) kinetic typography / waterfall subtitle video generator powered by [Remotion](https://remotion.dev). Takes a Chinese text script and outputs a complete MP4 with synchronized TTS audio, 3-frame text entry animation, and camera tracking.

## Features

- **全自动流水线** — 输入一段中文文稿 → 自动切段 → TTS 配音 → Whisper 时序校正 → Remotion 渲染 → 自校验 → 交付 MP4
- **3 帧快速入场** — 当前句 3 帧内 fadeIn + scale(0.88→1) + slideUp(15px→0)
- **3 条历史句残留** — 逐层缩小变淡，保持上下文可见
- **摄像机追踪** — 当前句始终固定在画面 38% 高度
- **自适应字号** — 根据文字长度自动调整，避免溢出
- **进度条** — 底部渐变进度指示
- **MiniMax TTS** — `speech-2.8-hd` 模型，`presenter_male` 音色，铿锵有力

## Project Structure

```
waterfall-typography/
├── package.json                  Remotion ^4.0.473 + dependencies
├── tsconfig.json                 TypeScript config
├── README.md
├── scripts/
│   └── gen_audio.py              MiniMax TTS generation script
├── public/
│   └── fonts/
│       └── wqy-zenhei.ttc        Chinese font fallback
└── src/
    ├── index.ts                  Remotion entry (registerRoot)
    ├── Root.tsx                  Composition registration
    └── WaterfallVideo/
        ├── index.ts              Export WaterfallVideo + TOTAL_FRAMES
        ├── components/
        │   └── WaterfallVideo.tsx Main component (177 lines)
        ├── data/
        │   └── segments.ts       Segment timing data (42 entries)
        └── utils/
            └── transcript.ts     Segment types, font sizing, animation hooks
```

## Quick Start

```bash
# Install dependencies
npm install

# Start Remotion Studio (preview)
npm start

# Render video
npx remotion render src/index.ts WaterfallVideo out/output.mp4
```

## Workflow (Automated Pipeline)

The skill-atomated pipeline (via Hermes Agent) follows a 6-step self-correcting loop:

1. **切段** — Split text into 6-12 char segments, verify character-level consistency
2. **TTS** — Generate audio via MiniMax `speech-2.8-hd`, verify duration
3. **Whisper校正** — Align segment timing using Whisper tiny segmentation (direct boundary mapping, no proportional interpolation)
4. **组件同步** — Update `TOTAL_FRAMES` and audio reference
5. **渲染** — `npx remotion render`
6. **自校验** — 6 checks: text consistency, audio match, timing precision, animation correctness, render integrity, spot-check

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Audio Model | `speech-2.8-hd` | MiniMax TTS model |
| Voice | `presenter_male` | Speaker voice |
| Speed | 1.3–1.5 | TTS speed (auto-selected by text length) |
| Resolution | 1080×1920 | Vertical 9:16 (抖音 format) |
| FPS | 30 | Frame rate |
| Entry Animation | 3 frames | fadeIn + scale + slideUp |
| History Lines | 3 | Previous sentences remain visible |
| Font Sizes | 260→190→140→110→80 | Current→history cascade |

## Dependencies

- Remotion v4.0.473+
- MiniMax TTS API key
- Python 3 + `whisper-cpp` (for timing correction)
- Node.js 18+

## Environment

```bash
# Required for MiniMax TTS
export MINIMAX_API_KEY="sk-..."
```

## License

MIT
