import { DAYS } from "../../../constants/days";
import { drinks } from "../../../constants/drinks";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { BlenderGame } from "../../shared/games/Blender";

export const Blender4F = () => {
    const weekData = weekInfo.find((info) => info.week === 4);
    const collegueMessage = weekData.blenderCollegueMessage?.[DAYS.Friday];
    const drinkInfo = drinks.find(drink => drink.id === 9);

    return (
        <BlenderGame 
            lobbyScreen={SCREENS.LOBBY4} 
            collegueMessage={collegueMessage} 
            drinkInfo={drinkInfo}
            week={4}
            day={DAYS.Friday}
            gameName={'blender4'}
        />
    )
}