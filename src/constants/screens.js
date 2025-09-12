import { DAYS } from "./days"

export const SCREENS = {
    INTRO: 'INTRO',
    INTRO_REG: 'INTRO_REG',
    REG_1: 'REG_1',
    WAITING: 'WAITING',
    INTRO_RULES: 'INTRO_RULES',
    LOBBY: 'LOBBY',
    LOBBY1: 'LOBBY1',
    PLANNER1M: 'PLAN1M',
    PLANNER1W: 'PLAN1W',
    PLANNER1F: 'PLAN1F',
    GAME1M: 'GAME1M',
    GAME1W: 'GAME1W',
    GAME1F: 'GAME1F',
    BLENDER1M: 'BLENDER1M',
    BLENDER1W: 'BLENDER1W',
    BLENDER1F: 'BLENDER1F',
    LOBBY2: 'LOBBY2',
    PLANNER2M: 'PLAN2M',
    PLANNER2W: 'PLAN2W',
    PLANNER2F: 'PLAN2F',
    GAME2M: 'GAME2M',
    GAME2W: 'GAME2W',
    GAME2F: 'GAME2F',
    BLENDER2M: 'BLENDER2M',
    BLENDER2W: 'BLENDER2W',
    BLENDER2F: 'BLENDER2F',
    LOBBY3: 'LOBBY3',
    PLANNER3M: 'PLAN3M',
    PLANNER3W: 'PLAN3W',
    PLANNER3F: 'PLAN3F',
    GAME3M: 'GAME3M',
    GAME3W: 'GAME3W',
    GAME3F: 'GAME3F',
    BLENDER3M: 'BLENDER3M',
    BLENDER3W: 'BLENDER3W',
    BLENDER3F: 'BLENDER3F',
    LOBBY4: 'LOBBY4',
    PLANNER4M: 'PLAN4M',
    PLANNER4W: 'PLAN4W',
    PLANNER4F: 'PLAN4F',
    GAME4M: 'GAME4M',
    GAME4W: 'GAME4W',
    GAME4F: 'GAME4F',
    BLENDER4M: 'BLENDER4M',
    BLENDER4W: 'BLENDER4W',
    BLENDER4F: 'BLENDER4F',
    DESKTOP: 'DESKTOP'
}

export const NEXT_SCREENS = {
    [SCREENS.INTRO_REG]: SCREENS.REG_1,
    [SCREENS.INTRO_RULES]: SCREENS.LOBBY1,
}

export const GAME_SCREENS_WEEK1 = {
    game: {
        [DAYS.Monday]: SCREENS.GAME1M,
        [DAYS.Wednesday]: SCREENS.GAME1W,
        [DAYS.Friday]: SCREENS.GAME1F,
    },
    blender: {
        [DAYS.Monday]: SCREENS.BLENDER1M,
        [DAYS.Wednesday]: SCREENS.BLENDER1W,
        [DAYS.Friday]: SCREENS.BLENDER1F,
    },
    planner: {
        [DAYS.Monday]: SCREENS.PLANNER1M,
        [DAYS.Wednesday]: SCREENS.PLANNER1W,
        [DAYS.Friday]: SCREENS.PLANNER1F,
    }
};

export const GAME_SCREENS_WEEK2 = {
    game: {
        [DAYS.Monday]: SCREENS.GAME2M,
        [DAYS.Wednesday]: SCREENS.GAME2W,
        [DAYS.Friday]: SCREENS.GAME2F,
    },
    blender: {
        [DAYS.Monday]: SCREENS.BLENDER2M,
        [DAYS.Wednesday]: SCREENS.BLENDER2W,
        [DAYS.Friday]: SCREENS.BLENDER2F,
    },
    planner: {
        [DAYS.Monday]: SCREENS.PLANNER2M,
        [DAYS.Wednesday]: SCREENS.PLANNER2W,
        [DAYS.Friday]: SCREENS.PLANNER2F,
    }
};

export const GAME_SCREENS_WEEK3 = {
    game: {
        [DAYS.Monday]: SCREENS.GAME3M,
        [DAYS.Wednesday]: SCREENS.GAME3W,
        [DAYS.Friday]: SCREENS.GAME3F,
    },
    blender: {
        [DAYS.Monday]: SCREENS.BLENDER3M,
        [DAYS.Wednesday]: SCREENS.BLENDER3W,
        [DAYS.Friday]: SCREENS.BLENDER3F,
    },
    planner: {
        [DAYS.Monday]: SCREENS.PLANNER3M,
        [DAYS.Wednesday]: SCREENS.PLANNER3W,
        [DAYS.Friday]: SCREENS.PLANNER3F,
    }
};

export const GAME_SCREENS_WEEK4 = {
    game: {
        [DAYS.Monday]: SCREENS.GAME4M,
        [DAYS.Wednesday]: SCREENS.GAME4W,
        [DAYS.Friday]: SCREENS.GAME4F,
    },
    blender: {
        [DAYS.Monday]: SCREENS.BLENDER4M,
        [DAYS.Wednesday]: SCREENS.BLENDER4W,
        [DAYS.Friday]: SCREENS.BLENDER4F,
    },
    planner: {
        [DAYS.Monday]: SCREENS.PLANNER4M,
        [DAYS.Wednesday]: SCREENS.PLANNER4W,
        [DAYS.Friday]: SCREENS.PLANNER4F,
    }
};
