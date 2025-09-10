import { week1Images } from "../../../constants/preloadImages"
import { useImagePreloader } from "../../../hooks/useImagePreloader"
import { Lobby } from "../Lobby"

export const Lobby1 = () => {
    useImagePreloader(week1Images);

    return (
        <Lobby week={1} />
    )
}
