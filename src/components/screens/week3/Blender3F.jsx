import { DAYS } from "../../../constants/days";
import { drinks } from "../../../constants/drinks";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { BlenderGame } from "../../shared/games/Blender";

export const Blender3F = () => {
    const weekData = weekInfo.find((info) => info.week === 3);
    const collegueMessage = weekData.blenderCollegueMessage?.[DAYS.Friday];
    const drinkInfo = drinks.find(drink => drink.id === 10);

    return (
        <BlenderGame 
            lobbyScreen={SCREENS.LOBBY3} 
            collegueMessage={collegueMessage} 
            drinkInfo={drinkInfo}
            week={3}
            day={DAYS.Friday}
            gameName={'blender3'}
        />
    )
}