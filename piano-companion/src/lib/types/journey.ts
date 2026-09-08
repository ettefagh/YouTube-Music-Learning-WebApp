import type { LocalLesson } from '../db/db';

export type NodeType = 'lesson_stone' | 'listening_oasis' | 'star_checkpoint' | 'chapter_boss';
export type NodeStatus = 'completed' | 'current' | 'upcoming' | 'locked';

export interface ChapterWorld {
    id: string;
    worldIndex: number;
    title: string;
    subtitle: string;
    themeKey: string;
    colorTheme: {
        light: string;
        dark: string;
    };
    pipCostume: string;
    milestoneBadge: string;
    pieces: LocalLesson[];
}

export interface JourneyNode {
    id: string;
    lesson: LocalLesson;
    sequenceIndex: number;
    title: string;
    nodeType: NodeType;
    status: NodeStatus;
    x: number;
    y: number;
    chapterTimeFormatted?: string;
    teacherTakes: string[]; // e.g., ["Anikó", "Gavin", "Vika"]
}
