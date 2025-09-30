import { useProgress } from "../../contexts/ProgressContext"
import { CommonModal } from "../shared/modals";
import { Bold } from "../shared/Spans";

export const FinishContinuesLastModal = ({isOpen, hasMore, endMessage, onClose, isAllDone}) => {
    const { user } = useProgress();

    const handleClose = () => {
        window.open('', '_blank');
    }

    const vipContent = () => (
        hasMore ? (
            <>
                <p><Bold>Отлично, ты прошёл все игры этой недели!</Bold></p>
                <p><Bold>Скоро подведём итоги розыгрыша — </Bold>следи за уведомлениями <Bold>в ТГ‑боте.</Bold></p>
                <p><Bold>Заодно загляни на стажировку в Альфа-Банк:</Bold> здесь ценят любопытство, самостоятельность и желание развиваться.</p>
                <p><Bold>Можешь вернуться к играм</Bold> прошлой недели, чтобы узнать ещё больше о работе в банке.</p>
            </>
        ) : (
                <>
                    <p><Bold>Все задания завершены!</Bold></p>
                    <p><Bold>Спасибо за участие в игре.</Bold></p>
                    <p><Bold>Остался последний этап — </Bold> впереди розыгрыш 4-й недели и финальный суперприз. Результаты увидишь <Bold>в ТГ‑боте.</Bold></p>
                    <p><Bold>А пока можешь узнать о стажировке в Альфа‑Банк: </Bold> здесь поддерживают инициативу, ценят свежие идеи и дают возможность пробовать новые подходы.</p>
            </>
        )
    )

    const unVipContent = () => (
         hasMore ? (
            <>
                <p><Bold>Ты прошёл все игры этой недели!</Bold></p>
                <p><Bold>Итоги </Bold>розыгрыша скоро будут <Bold>в ТГ‑боте.</Bold></p>
                <p><Bold>Посмотри стажировки в Альфа‑Банк:</Bold> здесь ценят инициативу и дают возможность учиться на практике.</p>
                <p><Bold>Если хочешь,</Bold> можешь вернуться к играм прошлой недели и собрать недостающие очки.</p>
            </>
        ) : (
              <>
                <p><Bold>Все задания на этой неделе завершены!</Bold></p>
                <p><Bold>Спасибо, что играли с нами.</Bold></p>
                <p>Итоги розыгрыша скоро будут <Bold>в ТГ‑боте.</Bold></p>
                <p><Bold>Пока можно ознакомиться со стажировкой в Альфа‑Банк: </Bold>место, где приветствуют новые идеи и дают шанс попробовать себя в разных задачах.</p>
            </>
        )
    );

    return (
        <CommonModal isDarken isOpen={isOpen} btnText={'Узнать о стажировке'} onClose={handleClose}>
            {user.isTargeted ? vipContent() : unVipContent()}
        </CommonModal>
    )
}
