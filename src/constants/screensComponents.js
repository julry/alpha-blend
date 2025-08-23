import { Blender1M } from "../components/screens/week1/Blender1M";
import { Game2048M } from "../components/screens/week1/Game2048M";
import { IntroRegistration } from "../components/screens/IntroRegistration";
import { IntroRules } from "../components/screens/IntroRules";
import { Lobby1M } from "../components/screens/week1/Lobby1M";
import { Planner1M } from "../components/screens/week1/Planner1M";
import { Registration1 } from "../components/screens/Registration1";
import { Registration2 } from "../components/screens/Registration2";
import { Start } from "../components/screens/Start";
import BasketballGame from "../components/shared/games/BasketballGame";
import { WeekLobby } from "../components/screens/WeekLobby";
import { Blender1W } from "../components/screens/week1/Blender1W";

import { SCREENS } from "./screens";

export const screens = {
    [SCREENS.INTRO_REG]: IntroRegistration,
    [SCREENS.REG_1]: Registration1,
    [SCREENS.REG_2]: Registration2,
    [SCREENS.LOBBY]: WeekLobby,
    [SCREENS.LOBBY1M]: Lobby1M,
    [SCREENS.START]: Start,
    [SCREENS.INTRO_RULES]: IntroRules,
    [SCREENS.PLANNER1M]: Planner1M,
    [SCREENS.GAME1M]: Game2048M,
    [SCREENS.GAME2M]: BasketballGame,
    [SCREENS.BLENDER1M]: Blender1M,
    [SCREENS.BLENDER1W]: Blender1W,
    // [SCREENS.FINISH]: Finish,
};

export const preloadImages = [];
