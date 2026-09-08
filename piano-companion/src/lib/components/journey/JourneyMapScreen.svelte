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
        return mapNodes[mapNodes.length - 1].y + 200;
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
    <!-- Background Patterns / Biomes could go here based on `worlds` -->
    <div class="absolute inset-0 pointer-events-none opacity-20">
        <!-- Mock background texture -->
    </div>

    <!-- The SVG Path Spine -->
    <svg
        class="absolute top-0 left-0 w-full pointer-events-none"
        style="height: {maxPathY}px; min-width: 320px;"
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

    <!-- Floating Action Button: Find Pip -->
    {#if showScrollToPip}
        <button
            class="fixed bottom-24 right-4 z-40 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] font-bold flex items-center gap-2 border-2 border-slate-200 transition-transform active:scale-95"
            onclick={scrollToActive}
        >
            <span>🐥</span> Find Pip
        </button>
    {/if}

    <!-- Node Practice Hub (Floating Preview Card) -->
    {#if selectedNode}
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity flex flex-col justify-end" onclick={() => selectedNode = null}>

            <!-- Drawer -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="bg-white dark:bg-[#1E1B4B] w-full rounded-t-[16px] p-6 shadow-2xl transform transition-transform"
                onclick={(e) => e.stopPropagation()}
            >
                <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>

                <div class="flex items-start justify-between mb-2">
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                        {selectedNode.title}
                    </h2>
                    <span class="text-sm font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        #{selectedNode.sequenceIndex + 1}
                    </span>
                </div>

                <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    {selectedNode.nodeType === 'chapter_boss' ? '🏆 Chapter Finale' :
                     selectedNode.nodeType === 'star_checkpoint' ? '🏕️ Checkpoint' : '🎵 Practice Piece'}
                </p>

                <!-- Teacher Chips -->
                <div class="flex flex-wrap gap-2 mb-8">
                    {#each selectedNode.teacherTakes as teacher}
                        <div class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 border border-indigo-100 dark:border-indigo-800">
                            {#if teacher === "Anikó"}👩‍🏫{:else if teacher === "Gavin"}👨‍🏫{:else}🎹{/if}
                            {teacher}
                        </div>
                    {/each}
                </div>

                <!-- Giant 56px Stadium Capsule Button -->
                <button
                    class="w-full h-[56px] rounded-full bg-slate-900 dark:bg-emerald-400 text-white dark:text-slate-900 font-bold text-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    onclick={handleStartPractice}
                >
                    <span class="text-xl">▶</span> START PRACTICE
                </button>
            </div>
        </div>
    {/if}
</div>
