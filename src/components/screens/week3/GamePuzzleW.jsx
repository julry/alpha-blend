import { DAYS } from "../../../constants/days";
import { PuzzleGame } from "../../shared/games/PuzzleGame";
import { puzzlesW } from "../../shared/games/PuzzleGame/puzzles";
import { Bold } from "../../shared/Spans";

export const GamePuzzleW = () => {
    const startText = () => (
        <p><Bold>В музее перепутались экспонаты — </Bold>все скульптуры, витрины и картины оказались не на своих местах. Поможешь собрать их воедино, чтобы выставка снова ожила?</p>
    );

    const winText = () => (
        <p>Ты справился с музейной загадкой и помог восстановить экспозицию.</p>
    );
    const loseText = () => (<p><Bold>Не получилось уложиться в таймер,</Bold> но не переживай — экспозиция всё равно откроется, набранные баллы сохранятся!</p>);

    return (
        <PuzzleGame 
            day={DAYS.Wednesday} 
            startText={startText}  
            endText={{win: winText, lose: loseText}}
            puzzles={puzzlesW}
        />
    )
}