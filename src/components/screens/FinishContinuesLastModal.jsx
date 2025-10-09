import styled from "styled-components";
import { useProgress } from "../../contexts/ProgressContext"
import { CommonModal } from "../shared/modals";
import { Bold } from "../shared/Spans";
import { reachMetrikaGoal } from "../../utils/reachMetrikaGoal";


const FirstP = styled.p`
    margin-top: var(--spacing_x2);
`;

export const FinishContinuesLastModal = ({isOpen, hasMore, onClose}) => {
    const { user } = useProgress();

    const handleOpenLink = () => {
        reachMetrikaGoal('start career');
        window.open('https://fut.ru/s/alfa0910', '_blank');
    }

    const vipContent = () => (
        hasMore ? (
            <>
                <FirstP><Bold>Отлично, ты прошёл все игры этой недели!</Bold></FirstP>
                <p><Bold>Скоро подведём итоги розыгрыша — </Bold>следи за уведомлениями <Bold>в ТГ‑боте.</Bold></p>
                <p><Bold>Заодно загляни на стажировку в Альфа-Банк:</Bold> здесь ценят любопытство, самостоятельность и желание развиваться.</p>
                <p><Bold>Можешь вернуться к играм</Bold> прошлой недели, чтобы узнать ещё больше о работе в банке.</p>
            </>
        ) : (
                <>
                    <FirstP><Bold>Все задания завершены!</Bold></FirstP>
                    <p><Bold>Спасибо за участие в игре.</Bold></p>
                    <p><Bold>Остался последний этап — </Bold> впереди розыгрыш 4-й недели и финальный суперприз. Результаты увидишь <Bold>в ТГ‑боте.</Bold></p>
                    <p><Bold>А пока можешь узнать о стажировке в Альфа‑Банк: </Bold> здесь поддерживают инициативу, ценят свежие идеи и дают возможность пробовать новые подходы.</p>
            </>
        )
    )

    const unVipContent = () => (
         hasMore ? (
            <>
                <FirstP><Bold>Ты прошёл все игры этой недели!</Bold></FirstP>
                <p><Bold>Итоги </Bold>розыгрыша скоро будут <Bold>в ТГ‑боте.</Bold></p>
                <p><Bold>Посмотри стажировки в Альфа‑Банк:</Bold> здесь ценят инициативу и дают возможность учиться на практике.</p>
                <p><Bold>Если хочешь,</Bold> можешь вернуться к играм прошлой недели и собрать недостающие очки.</p>
            </>
        ) : (
              <>
                <FirstP><Bold>Все задания на этой неделе завершены!</Bold></FirstP>
                <p><Bold>Спасибо, что играли с нами.</Bold></p>
                <p>Итоги розыгрыша скоро будут <Bold>в ТГ‑боте.</Bold></p>
                <p><Bold>Пока можно ознакомиться со стажировкой в Альфа‑Банк: </Bold>место, где приветствуют новые идеи и дают шанс попробовать себя в разных задачах.</p>
            </>
        )
    );

    return (
        <CommonModal isDarken onIconClose={onClose} isOpen={isOpen} btnText={'Узнать о стажировке'} onClose={handleOpenLink}>
            {user.isTargeted ? vipContent() : unVipContent()}
        </CommonModal>
    )
}
