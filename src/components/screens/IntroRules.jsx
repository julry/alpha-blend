import { useState } from "react"
import { Lobby } from "./Lobby";
import { CommonModal } from "../shared/modals/CommonModal";
import { useProgress } from "../../contexts/ProgressContext";
import { Button, IconButton } from "../shared/Button";
import styled from "styled-components";
import { PersonIcon } from "../shared/svg/PersonIcon";
import { LetterModal } from "../shared/modals/LetterModal";

const ButtonStyled = styled(Button)`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: var(--spacing_x6);
    z-index: 10;
`;

const IconButtonStyled = styled(IconButton)`
    position: absolute;
    left: var(--spacing_x4);
    top: var(--spacing_x8);
    z-index: 1001;
    user-select: none;
`;

export const IntroRules = () => {
    const [part, setPart] = useState(0);
    const { user, next } = useProgress();

    const getText = () => {
        if (part === 0) return (
            <p>
                Это твоё рабочее пространство — каждую неделю по понедельникам, средам и пятницам появляются задания и игры.
                <br />
                <br />
                Для начала настрой свой идеальный день — расставь карточки в планнере по времени. Как только закончишь, откроются новые игры!
            </p>
        )
        if (part === 1) return (
            <p>
                В начале каждой недели ты узнаешь тему и цели новых челленджей.
                <br />
                <br />
                Тебя ждут полезные лайфхаки и настоящие рецепты смузи — всё, что поможет найти баланс не только в игре, но и в жизни.
                <br />
                <br />
                Выполняй задания и игры в день их выхода — и получай бонусные баллы!
            </p>
        )

        if (part === 2 && user.isVip) {
            return (
                <p>
                    Здесь можно не только играть, но и выигрывать призы!
                    <br />
                    <br />
                    В течение 4 недель зарабатывай баллы в играх и заданиях — чем их больше, тем выше шансы на победу.
                    <br />
                    <br />
                    Розыгрыши проходят каждую неделю по набранным баллам за этот период. А в конце — финальный розыгрыш с учётом всех твоих баллов за игру.
                </p>
            )
        }
        if (part === 2) {
            return (
                <p>
                    Здесь можно не только играть, но и выиграть приз — в конце игры будет розыгрыш.
                    <br />
                    <br />
                    Зарабатывай баллы каждую неделю в разных играх и заданиях — чем больше баллов, тем выше шанс на победу! </p>
            )
        }
    };

    const handleNext = () => {
        setPart(prev => prev + 1);
    };

    const handleClose = () => {
        next();
    };

    return (
        <>
            <Lobby isLaptop={part === 3} isLaptopLetter={part === 3} onLaptopClick={handleNext} />
            <CommonModal
                isOpen={part < 3}
                isDisabledAnimation={part !== 0}
                onClose={handleNext}
            >
                {getText()}
            </CommonModal>
            {part === 3 && (
                <ButtonStyled onClick={handleNext}>
                    Далее
                </ButtonStyled>
            )}
            {part === 2 && (
                <IconButtonStyled>
                    <PersonIcon />
                </IconButtonStyled>
            )}
            <LetterModal isOpen={part > 3} isDarken checkedWeek={1} onClose={handleClose}/>
        </>
    );
};
