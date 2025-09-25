import { DAYS } from "../../../constants/days";
import { PuzzleGame } from "../../shared/games/PuzzleGame";
import { puzzlesF } from "../../shared/games/PuzzleGame/puzzles";
import { Bold } from "../../shared/Spans";

export const GamePuzzleF = () => {
    const startText = () => (
        <p><Bold>В музее перепутались экспонаты — </Bold>все скульптуры, витрины и картины оказались не на своих местах. Поможешь собрать их воедино, чтобы выставка снова ожила?</p>
    );

    const winText = () => (
        <p>Ты справился с пазлом и вернул картинам их первозданный вид.</p>
    );
    const loseText = () => (<p><Bold>Не получилось уложиться в таймер,</Bold> но не переживай — галерея всё равно откроется, а твои баллы сохранятся!</p>);

    return <PuzzleGame day={DAYS.Friday} startText={startText} endText={{win: winText, lose: loseText}} puzzles={puzzlesF}/>
}