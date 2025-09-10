import { useProgress } from "../../contexts/ProgressContext"
import { CommonModal } from "../shared/modals/CommonModal";
import { Bold } from "../shared/Spans";

export const FinishContinuesModal = ({isOpen, hasMore, endMessage, onClose}) => {
    const { changeDay } = useProgress();

    const handleClose = () => {
        if (hasMore) changeDay();

        onClose?.();
    }

    return (
        <CommonModal isDarken isOpen={isOpen} btnText={'Понятно'} onClose={handleClose}>
            {hasMore ? (
                <>
                    <p><Bold>Ты прошёл все игры этого дня!</Bold></p>
                    <p>Игры других дней тоже открыты — самое время заработать как можно больше баллов.</p>
                </>
            ) : (
                typeof endMessage === 'function' ? endMessage?.() : endMessage
            )}
        </CommonModal>
    )
}
