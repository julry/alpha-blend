import { DAYS } from "../../../constants/days";
import { drinks } from "../../../constants/drinks";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { BlenderGame } from "../../shared/games/Blender";

export const Blender1M = () => {
    const weekData = weekInfo.find((info) => info.week === 1);
    const collegueMessage = weekData.blenderCollegueMessage?.[DAYS.Monday];
    const levelMessages = weekData.blenderEndMessage?.[DAYS.Monday];
    const drinkInfo = drinks.find(drink => drink.id === 0);

    return (
        <BlenderGame 
            lobbyScreen={SCREENS.LOBBY1} 
            collegueMessage={collegueMessage} 
            levelMessages={levelMessages} 
            drinkInfo={drinkInfo}
            isNeverPlayed
            week={1}
            day={DAYS.Monday}
            gameName={'blender1'}
        />
    )
}