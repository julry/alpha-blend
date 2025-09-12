import { DAYS } from "../../../constants/days";
import { drinks } from "../../../constants/drinks";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { BlenderGame } from "../../shared/games/Blender";

export const Blender2F = () => {
    const weekData = weekInfo.find((info) => info.week === 2);
    const collegueMessage = weekData.blenderCollegueMessage?.[DAYS.Friday];
    //TODO: поменять айди
    const drinkInfo = drinks.find(drink => drink.id === 5);

    return (
        <BlenderGame 
            lobbyScreen={SCREENS.LOBBY2} 
            collegueMessage={collegueMessage} 
            drinkInfo={drinkInfo}
            week={2}
            day={DAYS.Friday}
            gameName={'blender2'}
        />
    )
}