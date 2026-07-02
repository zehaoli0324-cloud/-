import { Composition } from "remotion";
import { GithubIntro } from "./GithubIntro";
import { KeynoteClip } from "./KeynoteClip/KeynoteClip";
import { NvidiaCard } from "./NvidiaCard/NvidiaCard";
import { NvidiaClipperPromo } from "./NvidiaClipperPromo";
import { PromoVideo } from "./shared/promo/PromoVideo";
import { PromoNvidiaVertical } from "./shared/promo/PromoNvidiaVertical";
import nvidiaPromoConfig from "./promo-nvidia";
import careerOpsPromoConfig from "./promo-career-ops";
import { PromoCareerOpsVertical } from "./shared/promo/PromoCareerOpsVertical";
import { LLMRanking } from "./LLMRanking";
import { TOTAL_FRAMES } from "./LLMRanking/constants";
import type { PolishInput } from "./KeynoteClip/types";
import type { NvidiaCardProps } from "./NvidiaCard/types";
import { ClaudeCode5Modes } from "./ClaudeCode5Modes";
import { TOTAL_FRAMES as CC5M_TOTAL } from "./ClaudeCode5Modes/constants";
import { CovidDrugTarget } from "./CovidDrugTarget";
import { MitoSegment } from "./MitoSegment";
import { TOTAL_FRAMES as MITO_TOTAL } from "./MitoSegment/constants";
import { JobScoutPromo, TOTAL_FRAMES as JS_TOTAL } from "./JobScoutPromo";
import { KineticTypography, TOTAL_FRAMES as KT_TOTAL } from "./KineticTypography";
import { WaterfallVideo, TOTAL_FRAMES as WV_TOTAL } from "./WaterfallVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GithubIntro"
        component={GithubIntro}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KeynoteClip"
        component={KeynoteClip}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={({ props }) => {
          const input = (props as { input?: PolishInput }).input;
          if (input && input.durationInFrames > 0) {
            return {
              durationInFrames: input.durationInFrames,
              fps: input.fps,
              width: input.width,
              height: input.height,
            };
          }
          return undefined;
        }}
      />
      <Composition
        id="NvidiaCard"
        component={NvidiaCard}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NvidiaClipperPromo"
        component={NvidiaClipperPromo}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* 通用推广视频引擎 — config 驱动 */}
      <Composition
        id="PromoNvidia"
        component={PromoVideo}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ config: nvidiaPromoConfig }}
      />
      {/* 竖版 9:16 推广视频 */}
      <Composition
        id="PromoNvidiaVertical"
        component={PromoNvidiaVertical}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* 竖版 9:16 推广视频 — Career-Ops */}
      <Composition
        id="PromoCareerOpsVertical"
        component={PromoCareerOpsVertical}
        durationInFrames={1590}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* LLM Ranking Video */}
      <Composition
        id="LLMRanking"
        component={LLMRanking}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Claude Code 5 模式说明视频 */}
      <Composition
        id="ClaudeCode5Modes"
        component={ClaudeCode5Modes}
        durationInFrames={CC5M_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* SARS-CoV-2 Drug Target Analysis Video */}
      <Composition
        id="CovidDrugTarget"
        component={CovidDrugTarget}
        durationInFrames={5400}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* 线粒体分割技术视频 */}
      <Composition
        id="MitoSegment"
        component={MitoSegment}
        durationInFrames={MITO_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* JobScout 求职猎手推广视频 */}
      <Composition
        id="JobScoutPromo"
        component={JobScoutPromo}
        durationInFrames={JS_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* 倒鸭子 Kinetic Typography */}
      <Composition
        id="KineticTypography"
        component={KineticTypography}
        durationInFrames={KT_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* 瀑布流字幕 Waterfall Video */}
      <Composition
        id="WaterfallVideo"
        component={WaterfallVideo}
        durationInFrames={WV_TOTAL}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};