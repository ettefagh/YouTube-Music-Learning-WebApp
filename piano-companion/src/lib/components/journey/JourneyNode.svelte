<script lang="ts">
    import type { JourneyNode } from '../../types/journey';

    let {
        node,
        isActive = false,
        onclick
    } = $props<{
        node: JourneyNode;
        isActive?: boolean;
        onclick?: (node: JourneyNode) => void;
    }>();

    let nodeClasses = $derived.by(() => {
        const base = 'journey-node group flex flex-col items-center justify-center relative cursor-pointer';
        const states = {
            completed: 'node-completed',
            current: 'node-current',
            upcoming: 'node-upcoming',
            locked: 'node-locked opacity-50 cursor-not-allowed'
        };
        return `${base} ${states[node.status]}`;
    });

    let tokenClasses = $derived.by(() => {
        const base = 'w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative z-10';
        const states = {
            completed: 'bg-gradient-to-br from-[#FEE75C] to-[#FBBF24] border-4 border-emerald-400',
            current: 'bg-gradient-to-br from-pink-500 to-cyan-400 border-4 border-white animate-pulse-border shadow-[0_0_20px_rgba(236,72,153,0.6)]',
            upcoming: 'bg-[#F5F3FF] border-4 border-[#C4B5FD] text-slate-400',
            locked: 'bg-slate-200 border-4 border-slate-300 text-slate-400 backdrop-blur-sm'
        };
        return `${base} ${states[node.status]} ${isActive ? 'scale-110' : 'hover:scale-105'}`;
    });
</script>

<style>
    @keyframes bob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    .animate-bob {
        animation: bob 2s ease-in-out infinite;
    }

    @keyframes pulse-border {
        0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(236, 72, 153, 0); }
        100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-border {
        animation: pulse-border 2s infinite;
    }
</style>

<button
    class={nodeClasses}
    style="position: absolute; left: {node.x}px; top: {node.y}px; transform: translate(-50%, -50%);"
    onclick={() => { if (node.status !== 'locked' && onclick) onclick(node); }}
    disabled={node.status === 'locked'}
    aria-label="Journey Node {node.sequenceIndex + 1}: {node.title}"
>
    <!-- Mascot Pip (Only on current node) -->
    {#if node.status === 'current'}
        <div class="absolute -top-16 z-20 animate-bob flex flex-col items-center">
            <div class="bg-white text-slate-800 text-xs font-bold py-1 px-3 rounded-2xl shadow-md mb-2 relative">
                Play me!
                <div class="absolute -bottom-1 left-1/2 w-2 h-2 bg-white transform -translate-x-1/2 rotate-45"></div>
            </div>
            <!-- Mock Mascot Image -->
            <div class="w-12 h-12 bg-yellow-300 rounded-full border-2 border-slate-800 flex items-center justify-center text-xl shadow-lg">
                🐥
            </div>
        </div>
    {/if}

    <!-- Badges -->
    {#if node.nodeType === 'star_checkpoint'}
        <div class="absolute -top-3 -right-3 z-20 text-2xl drop-shadow-md">🏕️</div>
    {/if}
    {#if node.nodeType === 'chapter_boss'}
        <div class="absolute -top-4 -right-3 z-20 text-3xl drop-shadow-lg">👑</div>
    {/if}

    <!-- The Token -->
    <div class={tokenClasses}>
        {#if node.status === 'locked'}
            <span class="text-2xl">🔒</span>
        {:else if node.status === 'completed'}
            <span class="text-3xl">⭐</span>
        {:else}
            <span class="font-bold text-xl {node.status === 'current' ? 'text-white' : 'text-slate-600'}">
                {node.sequenceIndex + 1}
            </span>
        {/if}
    </div>

    <!-- Title Label -->
    <div class="mt-3 text-center w-32">
        <span class="text-sm font-bold text-slate-800 block leading-tight drop-shadow-sm truncate">
            {node.title}
        </span>
        {#if node.status === 'completed' && node.teacherTakes && node.teacherTakes.length > 0}
            <span class="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                {node.teacherTakes.length} takes
            </span>
        {/if}
    </div>
</button>
