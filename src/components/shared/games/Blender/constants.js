import girl0 from './assets/girl0.png';
import girl1 from './assets/girl1.png';
import man0 from './assets/man0.png';

export const CONTAINER_SIZE = 330;

export const TILE_COUNT_PER_DIMENSION = 4;

export const MERGE_ANIMATION_DURATION = 100;

export const MOVE_ANIMATION_DURATION = 200;

export const DELETE_ANIMATION_DURATION = MOVE_ANIMATION_DURATION + MERGE_ANIMATION_DURATION + 100;

export const FINISH_SCORE = 256;

export const MAX_TIME = 1 * 60 + 30;

export const BLENDER_TIME = 2;
export const QUEUE_TO_PERSON_TIME = {
    1: 15,
    2: 15,
    3: 16,
}

export const persons = [
    {
        id: 'girl0',
        pic: girl0,
        width: 132,
        height: 285,
        bottom: 82,
    },
    {
        id: 'girl1',
        pic: girl1,
        width: 154,
        height: 290,
        bottom: 59,
    },
    {
        id: 'man0',
        pic: man0,
        width: 172,
        height: 280,
        bottom: 109,
    },
]

export const LEVEL_TO_PEOPLE_AMOUNT = {
    1: 8,
    2: 10,
    3: 12,
    4: 15,
}

export const LEVEL_TO_SIZE_PROBABILITY = {
    1: 2,
    2: 3,
    3: 3,
    4: 3,
}

export const LEVEL_TO_PEOPLE_PROBABILITY = {
    1: {
        p1: 0.6,
        p2: 0.4,
        p3: 0
    },
    2: {
        p1: 0,
        p2: 0.7,
        p3: 0.3
    },
    3: {
        p1: 0,
        p2: 0.3,
        p3: 0.7
    },
    4: {
        p1: 0,
        p2: 0,
        p3: 1,
    }
}

export const LEVEL_TO_INGREDIENTS_PROBABILITY = {
    1: {
        p1: 1,
        p2: 0
    },
    2: {
        p1: 1,
        p2: 0
    },
    3: {
        p1: 0.5,
        p2: 0.5
    },
    4: {
        p1: 0,
        p2: 1,
    }
}