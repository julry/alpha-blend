import { SkipModal } from "../../modals/SkipModal";
import { DrinkModal } from "../../modals/DrinkModal";
import { EndGameModal } from "../../modals/EndGameModal";
import { CommonModal } from "../../modals/CommonModal";
import { RulesModal } from "./RulesModal";
import { FirstRulesModal } from "./FirstRulesModal";

export const ModalsPart = ({modalsState, modalsFunc, onGoLobby, passedLevel, drinkInfo, collegueMessage, levelMessages}) => {
    return (
        <>
            <CommonModal isOpen={passedLevel === 3} isCollegue btnText="Далее" onClose={modalsFunc.handleShowFinish}>
                <p>
                    {collegueMessage}
                </p>
            </CommonModal>
            <CommonModal isOpen={modalsState.isFinishModal} btnText="Забрать" onClose={modalsFunc.handleShowFinding}>
                <p>{levelMessages[2]}</p>
            </CommonModal>
            <SkipModal opened={modalsState.isSkipping} onClose={() => modalsFunc.setIsSkipping(false)} onExit={onGoLobby}/>
            <CommonModal isOpen={!!passedLevel && passedLevel < 3} onClose={modalsFunc.handleNext} btnText={'Начать'}>
                <p>{levelMessages[passedLevel - 1]}</p>
            </CommonModal>
            <CommonModal isOpen={modalsState.isLast} onClose={onGoLobby} btnText={'В комнату'}>
                <p>
                    После каждой игры в «Блендер» ты получишь новый рецепт. Все рецепты можно посмотреть, нажав на иконку медали в комнате. Вернёмся назад?
                </p>
            </CommonModal>
            <EndGameModal isOpen={modalsState.restartModal} title="Ты проиграл" onClose={modalsFunc.handleEndGame} onRetry={modalsFunc.handleRestart}>
                <p>Не допускай скопления 3 напитков на столе.</p>
            </EndGameModal>
            <DrinkModal isOpen={modalsState.isFinding} drink={drinkInfo} onClose={modalsFunc.handleCloseDrink}/>
            <RulesModal isOpen={modalsState.isRules} onClose={() => modalsFunc.setIsRules(false)} />
            <FirstRulesModal isOpen={modalsState.isFirstRules} modalsFuncs={modalsFunc} modalsState={modalsState}/>
        </>
    )
}