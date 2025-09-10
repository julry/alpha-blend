import { SkipModal } from "../../modals/SkipModal";
import { DrinkModal } from "../../modals/DrinkModal";
import { EndGameModal } from "./EndGameModal";
import { CommonModal } from "../../modals/CommonModal";
import { RulesModal } from "./RulesModal";
import { FirstRulesModal } from "./FirstRulesModal";
import { Bold } from "../../Spans";
import { StartGameModal } from "../../modals/StartGameModal";

export const ModalsPart = ({modalsState, modalsFunc, onGoLobby, drinkInfo, collegueMessage}) => {
    return (
        <>
            <CommonModal isOpen={modalsState?.isCollegueModal} isCollegue btnText="Далее" onClose={modalsFunc.closeCollegueModal}>
                <p>
                    {typeof collegueMessage === 'function' ? collegueMessage() : collegueMessage}
                </p>
            </CommonModal>
            <SkipModal isOpen={modalsState.isSkipping} onClose={() => modalsFunc.setIsSkipping(false)} onExit={onGoLobby}/>
            <CommonModal isOpen={modalsState.isLast} onClose={onGoLobby} btnText={'В комнату'}>
                <p>
                    После каждой игры в «Блендер» <Bold>ты получишь новый рецепт</Bold>. Все рецепты можно посмотреть, нажав на иконку медали в комнате.
                </p>
                <p><Bold>Вернёмся назад?</Bold></p>
            </CommonModal>
            <EndGameModal 
                isOpen={modalsState.isEndModal.shown} 
                isWin={modalsState.isEndModal.isWin} 
                onClose={modalsFunc.closeEndModal} 
                points={modalsState.isEndModal.points} 
            />
            <DrinkModal isOpen={modalsState.isFinding} drink={drinkInfo} onClose={modalsFunc.handleCloseDrink}/>
            <RulesModal isOpen={modalsState.isRules} onClose={() => modalsFunc.setIsRules(false)} />
            <FirstRulesModal isOpen={modalsState.isFirstRules} modalsFuncs={modalsFunc} modalsState={modalsState}/>
            <CommonModal isOpen={modalsState.restartModal} onClose={() => modalsFunc.handleRestart()} btnText={'Попробовать ещё'}>
                <p>На столе остались только напитки, которые <Bold>никому не подходят!</Bold></p>
                <p>Попытки ещё остались.</p>
            </CommonModal>
            <StartGameModal isOpen={modalsState.isStartGameModal} onClose={() => modalsFunc.setIsStartGameModal(false)} />
        </>
    )
}