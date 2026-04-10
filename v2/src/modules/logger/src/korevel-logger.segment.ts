import { IKorevelLoggerModel, IKorevelLoggerSegment, KorevelLoggerUtil } from '../index.ts';

export class KorevelLoggerSegment {
  constructor(private util: KorevelLoggerUtil) {}
  getSegments(model: IKorevelLoggerModel) {
    const segments: IKorevelLoggerSegment[] = [
      // base segment
      this.generateTag(model.baseTag, model.baseTagColor),
      // timestamp segment
      this.generateTag(
        this.getTimpestamp(model.showSeconds, model.showMilliseconds),
        model.timestampColor,
        false
      ),

      // scope segment
      this.generateTag(this.getScopeTagName(model), model.scopeTagColor),
    ];

    return segments;
  }

  getPatternStyles(segments: IKorevelLoggerSegment[]) {
    return {
      pattern: `${this.util.getPattern(segments)}:`,
      styles: this.util.getStyles(segments),
    };
  }

  private generateTag(tag: string, color: string, isBold?: boolean) {
    return this.util.genBoxSegment(tag, color, { bold: isBold });
  }

  private getScopeTagName(model: IKorevelLoggerModel) {
    return model.scopeTag || model.instance?.constructor.name || 'Anonymous';
  }

  private getTimpestamp(showSeconds: boolean, showMilliseconds: boolean) {
    return this.util.getTimestamp({
      seconds: showSeconds,
      milliseconds: showMilliseconds,
    });
  }
}