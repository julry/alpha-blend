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
    1: 10,
    2: 18,
    3: 25,
}

//TODO: доделать 
export const persons = [
    {
        id: 'girl0',
        pic: girl0,
        width: 195,
        height: 292,
        bottom: 75,
        headLeft: 30,
        headTop: 0,
        headWidth: 97,
        headHeight: 89,
        bodyLeft: 30,
        bodyTop: 89,
        bodyWidth: 106,
        bodyHeight: 89,
    },
    {
        id: 'girl1',
        pic: girl1,
        width: 186,
        height: 279,
        bottom: 78,
        headLeft: 30,
        headTop: 0,
        headWidth: 97,
        headHeight: 89,
        bodyLeft: 30,
        bodyTop: 89,
        bodyWidth: 106,
        bodyHeight: 89,
    },
    {
        id: 'man0',
        pic: man0,
        width: 174,
        height: 260,
        bottom: 133,
         headLeft: 30,
        headTop: 0,
        headWidth: 97,
        headHeight: 89,
        bodyLeft: 30,
        bodyTop: 89,
        bodyWidth: 106,
        bodyHeight: 89,
    },
]

export const LEVEL_TO_PEOPLE_AMOUNT = {
    1: 6,
    2: 10,
    3: 14,
}

export const LEVEL_TO_PROBABILITY = {
    1: {
        p1: 1,
        p2: 0
    },
    2: {
        p1: 0.8,
        p2: 0.2
    },
    3: {
        p1: 0.4,
        p2: 0.6
    }
}