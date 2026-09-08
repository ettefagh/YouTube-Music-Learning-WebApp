import type { LocalLesson } from '../db/db';
import type { ChapterWorld, JourneyNode, NodeType, NodeStatus } from '../types/journey';

const WORLD_CONFIGS = [
    {
        title: "The Whispering Woods",
        subtitle: "Forest of first steps",
        themeKey: "woods",
        colorTheme: { light: "#F5F3FF", dark: "#0F0E17" },
        pipCostume: "pip-explorer",
        milestoneBadge: "badge-leaf"
    },
    {
        title: "Rhythm River",
        subtitle: "Flowing with the beat",
        themeKey: "river",
        colorTheme: { light: "#E0F2FE", dark: "#0C4A6E" },
        pipCostume: "pip-sailor",
        milestoneBadge: "badge-water"
    },
    {
        title: "Echo Valley",
        subtitle: "Listen closely",
        themeKey: "valley",
        colorTheme: { light: "#FEF3C7", dark: "#78350F" },
        pipCostume: "pip-hiker",
        milestoneBadge: "badge-mountain"
    },
    {
        title: "Enchanted Fairground",
        subtitle: "Magical melodies",
        themeKey: "fairground",
        colorTheme: { light: "#FCE7F3", dark: "#831843" },
        pipCostume: "pip-magician",
        milestoneBadge: "badge-ticket"
    },
    {
        title: "Starlight Citadel",
        subtitle: "The grand finale",
        themeKey: "citadel",
        colorTheme: { light: "#EDE9FE", dark: "#2E1065" },
        pipCostume: "pip-astronaut",
        milestoneBadge: "badge-star"
    }
];

export function partitionIntoWorlds(lessons: LocalLesson[], currentBookId: string): ChapterWorld[] {
    // Filter lessons by book if needed, assuming lessons are already sorted
    // For testing/mocking, just split into 5 equal-ish parts
    const worlds: ChapterWorld[] = [];
    const totalLessons = lessons.length;

    if (totalLessons === 0) return worlds;

    // Attempting a balanced split, but with 5 fixed biomes as requested
    const numWorlds = 5;
    const itemsPerWorld = Math.ceil(totalLessons / numWorlds);

    for (let i = 0; i < numWorlds; i++) {
        const start = i * itemsPerWorld;
        const end = Math.min((i + 1) * itemsPerWorld, totalLessons);

        if (start < totalLessons) {
            const worldConfig = WORLD_CONFIGS[i % WORLD_CONFIGS.length];
            worlds.push({
                id: `world-${i}`,
                worldIndex: i,
                title: worldConfig.title,
                subtitle: worldConfig.subtitle,
                themeKey: worldConfig.themeKey,
                colorTheme: worldConfig.colorTheme,
                pipCostume: worldConfig.pipCostume,
                milestoneBadge: worldConfig.milestoneBadge,
                pieces: lessons.slice(start, end)
            });
        }
    }

    return worlds;
}

export function calculateMapCoordinates(lessons: LocalLesson[], activeLessonId?: string): JourneyNode[] {
    const nodes: JourneyNode[] = [];

    // Centered Serpentine sine wave inside 420px track
    const X_CENTER = 210;
    const X_AMP = 105; // amplitude keeps stones within 105px..315px (safe from edges)
    const Y_SPACING = 150;
    const START_Y = 180; // generous headroom so Pip + speech bubble never clip top header
    const FREQUENCY = 0.5; // full wave every 2 / 0.5 = 4 items

    let activeFound = false;

    lessons.forEach((lesson, index) => {
        const isEnd = index === lessons.length - 1;
        const isMid = index > 0 && index % 10 === 0 && !isEnd;

        let nodeType: NodeType = 'lesson_stone';
        if (isEnd) nodeType = 'chapter_boss';
        else if (isMid) nodeType = 'star_checkpoint';

        let status: NodeStatus = 'locked';

        if (activeLessonId) {
            if (lesson.id === activeLessonId) {
                status = 'current';
                activeFound = true;
            } else if (!activeFound) {
                status = 'completed';
            } else if (index === lessons.findIndex(l => l.id === activeLessonId) + 1) {
                status = 'upcoming';
            }
        } else {
            // If no active id, first one is current
            if (index === 0) {
                status = 'current';
                activeFound = true;
            } else if (index === 1) {
                status = 'upcoming';
            }
        }

        // Use Math.sin for serpentine path
        const y = index * Y_SPACING + START_Y;
        const x = X_CENTER + Math.sin(index * FREQUENCY * Math.PI) * X_AMP;

        // Mock teacher takes based on some logic, or just a default list
        const takes = ["Anikó", "Gavin", "Vika"].slice(0, 1 + (index % 3));

        nodes.push({
            id: lesson.id || `node-${index}`,
            lesson,
            sequenceIndex: index,
            title: lesson.title,
            nodeType,
            status,
            x,
            y,
            teacherTakes: takes
        });
    });

    return nodes;
}

export function generateBezierPaths(nodes: JourneyNode[], activeIndex: number) {
    if (nodes.length < 2) return { completedPath: '', futurePath: '' };

    let completedPath = '';
    let futurePath = '';

    for (let i = 0; i < nodes.length - 1; i++) {
        const current = nodes[i];
        const next = nodes[i + 1];

        // Simple cubic bezier curve moving primarily downward
        const cp1x = current.x;
        const cp1y = current.y + (next.y - current.y) / 2;
        const cp2x = next.x;
        const cp2y = current.y + (next.y - current.y) / 2;

        const pathSegment = (i === 0 ? `M ${current.x} ${current.y} ` : '') +
                           `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `;

        if (i < activeIndex) {
            completedPath += pathSegment;
        } else {
            // First piece of future path needs a Move command if it's right after completed
            if (i === activeIndex && activeIndex > 0) {
                futurePath += `M ${current.x} ${current.y} `;
            } else if (i === 0) {
                futurePath += `M ${current.x} ${current.y} `;
            }
            futurePath += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `;
        }
    }

    return { completedPath, futurePath };
}
