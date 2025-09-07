import { useState } from "react";
import { weekInfo } from "../../../constants/weeksInfo";
import { CommonModal } from "./CommonModal";
import { useProgress } from "../../../contexts/ProgressContext";

export const LetterModal = ({ isOpen, onClose, checkedWeek, isDarken}) => {
    const {currentWeek, readWeekLetter} = useProgress();
    const [part, setPart] = useState(1);

    const letterData = weekInfo.find(({week}) => week === (checkedWeek ?? currentWeek));

    const isLast = part === letterData?.parts;
    const text = letterData?.[`text${part}`];

    const handleClick = () => {
        if (isLast) {
            onClose?.();
            readWeekLetter((checkedWeek ?? currentWeek))
        }

        setPart(prev => prev + 1)
    }

    return (
        <CommonModal isOpen={isOpen} isDarken={isDarken} isCollegue onClose={handleClick} btnText={isLast ? 'Погнали!' : 'Далее'}>
            {typeof text === 'function' ? text() : text}
        </CommonModal>
    )
}