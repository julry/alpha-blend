import { DAYS } from "../../../constants/days";
import { PuzzleGame } from "../../shared/games/PuzzleGame";
import { puzzlesM } from "../../shared/games/PuzzleGame/puzzles";
import { Bold } from "../../shared/Spans";

export const GamePuzzleM = () => {
    const winText = () => (
        <p>Ты успел собрать сцену до начала спектакля — представление прошло на ура!</p>
    );
    const loseText = () => (
        <>
            <p><Bold>Эх, чуть-чуть не хватило времени...</Bold></p>
            <p>Но не расстраивайся, спектакль всё равно состоится!</p>
        </>
    );
    return (
        <PuzzleGame 
            day={DAYS.Monday} 
            isFirstTime 
            endText={{win: winText, lose: loseText}}
            puzzles={puzzlesM}
        />
    )
}