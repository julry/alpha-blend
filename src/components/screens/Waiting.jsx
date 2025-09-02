import { useState } from "react";
import styled from "styled-components";
import { Button } from "../shared/Button";
import { useProgress } from "../../contexts/ProgressContext";
import { Block } from "../shared/Block";
import { FlexWrapper } from "../shared/ContentWrapper";
import window from '../../assets/images/window.png';
import { Bold } from "../shared/Spans";

const Wrapper = styled(FlexWrapper)`
    padding-top: var(--spacing_x8);
    background: url(${window}) no-repeat center 100% / cover;
`;

export const WaitingGameScreen = () => {
    const { currentWeek } = useProgress();
    const [stage, setStage] = useState(0);
    const {next} = useProgress();

    return (
        <Wrapper>
            <Block>
                <p>
                    <Bold>Ты успешно зарегистрировался!</Bold>
                </p>
                <p>
                    Скоро старт игры — следи за уведомлениями в <Bold>TG-боте</Bold>.
                </p>
            </Block>
            {currentWeek > 0 && (<Button onClick={() => stage < 1 ? setStage(prev => prev + 1) : next()}>Далее</Button>)}
        </Wrapper>
    )
};
