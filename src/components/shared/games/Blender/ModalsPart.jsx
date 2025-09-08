import { SkipModal } from "../../modals/SkipModal";
import { DrinkModal } from "../../modals/DrinkModal";
import { EndGameModal } from "../../modals/EndGameModal";
import { CommonModal } from "../../modals/CommonModal";
import { RulesModal } from "./RulesModal";
import { FirstRulesModal } from "./FirstRulesModal";
import { FirstRulesModal2 } from "./FirstRulesModal2";
import { Bold } from "../../Spans";

export const ModalsPart = ({modalsState, modalsFunc, onGoLobby, drinkInfo, collegueMessage}) => {
    return (
        <>
            <CommonModal isOpen={modalsState?.isCollegue} isCollegue btnText="Далее" onClose={modalsFunc.handleShowFinish}>
                <p>
                    {typeof collegueMessage === 'function' ? collegueMessage() : collegueMessage}
                </p>
            </CommonModal>
            <SkipModal opened={modalsState.isSkipping} onClose={() => modalsFunc.setIsSkipping(false)} onExit={onGoLobby}/>
            <CommonModal isOpen={modalsState.isLast} onClose={onGoLobby} btnText={'В комнату'}>
                <p>
                    После каждой игры в «Блендер» <Bold>ты получишь новый рецепт</Bold>. Все рецепты можно посмотреть, нажав на иконку медали в комнате.
                </p>
                <p><Bold>Вернёмся назад?</Bold></p>
            </CommonModal>
            <EndGameModal isOpen={modalsState.isEndModal.shown} isWin={modalsState.isEndModal.isWin} onClose={modalsFunc.handleEndGame}>
            </EndGameModal>
            <DrinkModal isOpen={modalsState.isFinding} drink={drinkInfo} onClose={modalsFunc.handleCloseDrink}/>
            <RulesModal isOpen={modalsState.isRules} onClose={() => modalsFunc.setIsRules(false)} />
            <FirstRulesModal isOpen={modalsState.isFirstRules} modalsFuncs={modalsFunc} modalsState={modalsState}/>
            <FirstRulesModal2 isOpen={modalsState.isFirstRules2} modalsFuncs={modalsFunc} modalsState={modalsState}/>
            <CommonModal isOpen={modalsState.restartModal} onClose={() => modalsFunc.handleRestart()} btnText={'Продолжить'}>
                <p>У тебя оказалось слишком много лишних напитков!</p>
                <p>Попытки ещё остались.</p>
            </CommonModal>
        </>
    )
}