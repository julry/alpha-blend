
import { IntroRegistration } from "../components/screens/IntroRegistration";
import { IntroRules } from "../components/screens/IntroRules";
import { WaitingGameScreen } from "../components/screens/Waiting";
import { WeekLobby } from "../components/screens/WeekLobby";
import { Registration1 } from "../components/screens/Registration1";
import { DesktopScreen } from "../components/screens/DesktopScreen";

import { 
    Blender1F, Blender1M, Blender1W, Game2048F, Game2048M, 
    Game2048W, Planner1F, Planner1M, Planner1W, Lobby1 
} from '../components/screens/week1';

import { 
    Blender2F, Blender2M, Blender2W, Planner2F, Planner2M, Planner2W, Lobby2,
    GameBasketM, GameBasketW, GameBasketF
} from '../components/screens/week2';

import { 
    Blender3F, Blender3M, Blender3W, Planner3F, Planner3M, Planner3W, Lobby3 
} from '../components/screens/week3';

import { SCREENS } from "./screens";

export const screens = {
    [SCREENS.INTRO_REG]: IntroRegistration,
    [SCREENS.REG_1]: Registration1,
    [SCREENS.WAITING]: WaitingGameScreen,
    [SCREENS.INTRO_RULES]: IntroRules,
    [SCREENS.DESKTOP]: DesktopScreen,
    [SCREENS.LOBBY]: WeekLobby,
    [SCREENS.LOBBY1]: Lobby1,
    [SCREENS.PLANNER1M]: Planner1M,
    [SCREENS.PLANNER1W]: Planner1W,
    [SCREENS.PLANNER1F]: Planner1F,
    [SCREENS.GAME1M]: Game2048M,
    [SCREENS.GAME1W]: Game2048W,
    [SCREENS.GAME1F]: Game2048F,
    [SCREENS.BLENDER1M]: Blender1M,
    [SCREENS.BLENDER1W]: Blender1W,
    [SCREENS.BLENDER1F]: Blender1F,
    [SCREENS.LOBBY2]: Lobby2,
    [SCREENS.PLANNER2M]: Planner2M,
    [SCREENS.PLANNER2W]: Planner2W,
    [SCREENS.PLANNER2F]: Planner2F,
    [SCREENS.BLENDER2M]: Blender2M,
    [SCREENS.BLENDER2W]: Blender2W,
    [SCREENS.BLENDER2F]: Blender2F,
    [SCREENS.GAME2M]: GameBasketM,
    [SCREENS.GAME2W]: GameBasketW,
    [SCREENS.GAME2F]: GameBasketF,
    [SCREENS.LOBBY3]: Lobby3,
    [SCREENS.PLANNER3M]: Planner3M,
    [SCREENS.PLANNER3W]: Planner3W,
    [SCREENS.PLANNER3F]: Planner3F,
    [SCREENS.BLENDER3M]: Blender3M,
    [SCREENS.BLENDER3W]: Blender3W,
    [SCREENS.BLENDER3F]: Blender3F,

};

export const preloadImages = [];
