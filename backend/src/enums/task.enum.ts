export const TaskStatusEnum = {
    BACKLOG: 'BACKLOG',
    IN_PROGRESS: 'IN_PROGRESS',
    IN_REVIEW: 'IN_REVIEW',
    DONE: 'DONE',
    BLOCKED: 'BLOCKED',
    TO_DO: 'TO_DO',
} as const;

export const TaskPriorityEnum = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
} as const;

export type TaskStatusEnumType = keyof typeof TaskStatusEnum;
export type TaskPriorityEnumType = keyof typeof TaskPriorityEnum;