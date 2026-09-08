<script lang="ts">
  import type { LocalLesson } from '#lib/db/db.js';

  interface Props {
    lessons: LocalLesson[];
    currentLessonId?: string;
    videoCurrentTime?: number;
    videoDuration?: number;
    onSelectChapter: (lesson: LocalLesson) => void;
  }

  let {
    lessons = [],
    currentLessonId = '',
    videoCurrentTime = 0,
    videoDuration = 0,
    onSelectChapter
  }: Props = $props();

  let activeLesson = $derived(lessons.find((l: LocalLesson) => l.id === currentLessonId) ?? lessons[0] ?? null);
  let activeIndex = $derived(lessons.findIndex((l: LocalLesson) => l.id === currentLessonId));

  // Compute effective duration of the master video across all chapters
  let totalVideoSpan = $derived.by(() => {
    if (videoDuration > 0) return videoDuration;
    const maxEnd = Math.max(...lessons.map((l: LocalLesson) => l.endTime), 0);
    return maxEnd > 0 ? maxEnd : 1;
  });

  function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div class="chapter-timeline-card neo-card">
  <div class="timeline-header">
    <div class="header-left">
      <span class="chapter-badge">🔖 Bookmarks</span>
      {#if activeLesson}
        <span class="active-title">
          Ch. {activeLesson.sequenceIndex}: <strong>{activeLesson.title}</strong>
        </span>
        <span class="time-range">
          ({formatTime(activeLesson.startTime)} – {formatTime(activeLesson.endTime)} · {activeLesson.endTime - activeLesson.startTime}s)
        </span>
      {/if}
    </div>

    <div class="header-right">
      <span class="chapter-counter">
        {activeIndex >= 0 ? activeIndex + 1 : 0} of {lessons.length}
      </span>
    </div>
  </div>

  <!-- Interactive Chapter Ribbon Bar -->
  <div class="timeline-ribbon-wrapper" role="region" aria-label="Chapter bookmarks ribbon">
    <div class="timeline-ribbon">
      {#each lessons as lesson}
        {@const chDuration = Math.max(1, lesson.endTime - lesson.startTime)}
        {@const widthPct = (chDuration / totalVideoSpan) * 100}
        <button
          class="chapter-segment {lesson.id === currentLessonId ? 'active' : ''} {lesson.isCompleted ? 'completed' : ''}"
          style="width: {Math.max(1.2, widthPct)}%;"
          onclick={() => onSelectChapter(lesson)}
          title="Ch. {lesson.sequenceIndex}: {lesson.title} ({formatTime(lesson.startTime)} - {formatTime(lesson.endTime)})"
          aria-label="Chapter {lesson.sequenceIndex}: {lesson.title}"
        >
          <span class="segment-num">{lesson.sequenceIndex}</span>
        </button>
      {/each}

      <!-- Playhead indicator -->
      {#if totalVideoSpan > 0}
        <div
          class="ribbon-playhead"
          style="left: {Math.min(100, Math.max(0, (videoCurrentTime / totalVideoSpan) * 100))}%"
        ></div>
      {/if}
    </div>
  </div>
</div>

<style>
  .chapter-timeline-card {
    background: #FFF8E1;
    border: 3px solid #000;
    border-radius: 12px;
    box-shadow: 4px 4px 0 #000;
    padding: 10px 14px;
    margin-bottom: 16px;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .chapter-badge {
    background: #FFB300;
    color: #000;
    font-weight: 900;
    font-size: 0.75rem;
    padding: 2px 8px;
    border: 2px solid #000;
    border-radius: 6px;
    text-transform: uppercase;
  }

  .active-title {
    font-size: 0.9rem;
    color: #121212;
  }

  .time-range {
    font-size: 0.8rem;
    font-weight: 700;
    color: #666;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .chapter-counter {
    font-size: 0.8rem;
    font-weight: 900;
    background: #fff;
    border: 2px solid #000;
    border-radius: 6px;
    padding: 2px 8px;
  }

  .timeline-ribbon-wrapper {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .timeline-ribbon {
    display: flex;
    height: 28px;
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .chapter-segment {
    height: 100%;
    border: none;
    border-right: 1px solid #000;
    background: #FFFDE7;
    cursor: pointer;
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s;
    flex-shrink: 0;
  }

  .chapter-segment:hover {
    background: #FFE082;
  }

  .chapter-segment.active {
    background: #FF9800;
    color: #ffffff;
    font-weight: 900;
    border-left: 2px solid #000;
    border-right: 2px solid #000;
    z-index: 2;
  }

  .chapter-segment.completed:not(.active) {
    background: #C8E6C9;
  }

  .segment-num {
    font-size: 0.7rem;
    font-weight: 800;
    pointer-events: none;
    line-height: 1;
  }

  .ribbon-playhead {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #D32F2F;
    box-shadow: 0 0 4px #D32F2F;
    pointer-events: none;
    z-index: 5;
    transform: translateX(-50%);
  }
</style>
