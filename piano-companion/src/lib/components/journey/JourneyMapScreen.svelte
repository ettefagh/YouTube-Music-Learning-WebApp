<script lang="ts">
    import { onMount, tick } from 'svelte';
    import type { LocalLesson } from '../../db/db';
    import type { ChapterWorld, JourneyNode } from '../../types/journey';
    import { partitionIntoWorlds, calculateMapCoordinates, generateBezierPaths } from '../../utils/journeyAdapter';
    import JourneyNodeComponent from './JourneyNode.svelte';

    let {
        lessons,
        currentBookId,
        activeLessonId,
        onLessonSelect
    } = $props<{
        lessons: LocalLesson[];
        currentBookId: string;
        activeLessonId?: string;
        onLessonSelect: (lesson: LocalLesson) => void;
    }>();

    let scrollContainer: HTMLElement;

    // Internal State
    let selectedNode = $state<JourneyNode | null>(null);
    let showScrollToPip = $state(false);

    let worlds = $derived.by(() => partitionIntoWorlds(lessons, currentBookId));
    let mapNodes = $derived.by(() => calculateMapCoordinates(lessons, activeLessonId));

    let activeIndex = $derived.by(() => {
        const index = mapNodes.findIndex(n => n.status === 'current');
        return index !== -1 ? index : 0;
    });

    let paths = $derived.by(() => generateBezierPaths(mapNodes, activeIndex));

    let maxPathY = $derived.by(() => {
        if (mapNodes.length === 0) return 800;
        return mapNodes[mapNodes.length - 1].y + 260;
    });

    onMount(() => {
        // Hydration safety check
        if (typeof window !== 'undefined') {
            scrollToActive();
        }
    });

    // When the mapNodes change (e.g., book changed), re-center
    $effect(() => {
        if (mapNodes.length > 0) {
            scrollToActive();
        }
    });

    async function scrollToActive() {
        if (!scrollContainer || typeof window === 'undefined') return;

        await tick();
        const activeEl = scrollContainer.querySelector('.node-current');
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showScrollToPip = false;
        }
    }

    function handleScroll() {
        if (!scrollContainer) return;
        // Simple heuristic: if we scroll far from active node, show Pip button
        const activeEl = scrollContainer.querySelector('.node-current') as HTMLElement;
        if (activeEl) {
            const rect = activeEl.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            if (rect.top < containerRect.top - 100 || rect.bottom > containerRect.bottom + 100) {
                showScrollToPip = true;
            } else {
                showScrollToPip = false;
            }
        }
    }

    function handleNodeSelect(node: JourneyNode) {
        selectedNode = node;
    }

    function handleStartPractice() {
        if (selectedNode && onLessonSelect) {
            onLessonSelect(selectedNode.lesson);
        }
        selectedNode = null;
    }
</script>

<div
    class="relative w-full h-full bg-[#F5F3FF] dark:bg-[#0F0E17] overflow-y-auto overflow-x-hidden touch-pan-y"
    bind:this={scrollContainer}
    onscroll={handleScroll}
>
    <!-- Centered Journey Track Canvas -->
    <div class="relative mx-auto w-full max-w-[420px]" style="height: {maxPathY}px; padding-bottom: 140px;">
        <!-- The SVG Path Spine -->
        <svg
            class="absolute top-0 left-0 w-full pointer-events-none"
            style="height: {maxPathY}px;"
        >
            <defs>
                <linearGradient id="goldCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FBBF24" />
                    <stop offset="100%" stop-color="#22D3EE" />
                </linearGradient>
            </defs>

            <!-- Under-track shadow -->
            <path d="{paths.completedPath} {paths.futurePath}" stroke="black" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-10 dark:opacity-40" />

            <!-- Future Locked Track (Dashed) -->
            <path d={paths.futurePath} stroke="#CBD5E1" stroke-width="14" fill="none" stroke-dasharray="20 15" stroke-linecap="round" />

            <!-- Completed Track (Solid Gradient) -->
            <path d={paths.completedPath} stroke="url(#goldCyan)" stroke-width="14" fill="none" stroke-linecap="round" />
        </svg>

        <!-- Nodes -->
        <div class="relative w-full" style="height: {maxPathY}px;">
            {#each mapNodes as node (node.id)}
                <JourneyNodeComponent
                    {node}
                    isActive={selectedNode?.id === node.id}
                    onclick={handleNodeSelect}
                />
            {/each}
        </div>
    </div>

    <!-- Floating Action Button: Find Pip -->
    {#if showScrollToPip}
        <button
            class="fixed bottom-24 right-6 z-[1050] bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.3)] font-black flex items-center gap-2 border-2.5 border-black transition-transform active:scale-95 cursor-pointer"
            onclick={scrollToActive}
        >
            <span class="text-xl">🐥</span> Find Pip
        </button>
    {/if}

    <!-- Node Practice Hub (Floating Preview Card elevated above bottom dock) -->
    {#if selectedNode}
        <!-- Backdrop with z-[1100] to sit above fixed bottom dock (z-1000) -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1100] transition-opacity flex flex-col justify-end p-4 pb-24 md:pb-28" onclick={() => selectedNode = null}>

            <!-- Drawer Card -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="bg-white dark:bg-[#1E1B4B] w-full max-w-md mx-auto rounded-3xl p-6 shadow-2xl border-3 border-black transform transition-transform"
                onclick={(e) => e.stopPropagation()}
            >
                <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>

                <div class="flex items-start justify-between mb-2">
                    <h2 class="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {selectedNode.title}
                    </h2>
                    <span class="text-sm font-black text-slate-800 dark:text-slate-200 bg-amber-200 dark:bg-slate-800 px-3 py-1 rounded-full border-2 border-black">
                        #{selectedNode.sequenceIndex + 1}
                    </span>
                </div>

                <p class="text-slate-600 dark:text-slate-300 font-bold text-sm mb-4">
                    {selectedNode.nodeType === 'chapter_boss' ? '🏆 Chapter Finale' :
                     selectedNode.nodeType === 'star_checkpoint' ? '🏕️ Checkpoint' : '🎵 Practice Piece'}
                </p>

                <!-- Teacher Chips -->
                <div class="flex flex-wrap gap-2 mb-6">
                    {#each selectedNode.teacherTakes as teacher}
                        <div class="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 border-2 border-slate-300 dark:border-indigo-800">
                            {#if teacher === "Anikó"}👩‍🏫{:else if teacher === "Gavin"}👨‍🏫{:else}🎹{/if}
                            {teacher}
                        </div>
                    {/each}
                </div>

                <!-- Giant 56px Stadium Capsule Button (unblocked and completely visible) -->
                <button
                    class="w-full h-[56px] rounded-full bg-[#FF3366] text-white font-black text-lg shadow-[4px_4px_0_#000] border-3 border-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    onclick={handleStartPractice}
                >
                    <span class="text-xl">▶</span> START PRACTICE
                </button>
            </div>
        </div>
    {/if}
</div>
