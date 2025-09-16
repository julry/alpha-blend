import { useState } from "react";
import styled from "styled-components";
import { Button } from "../shared/Button";
import { useProgress } from "../../contexts/ProgressContext";
import { Block } from "../shared/Block";
import { FlexWrapper } from "../shared/ContentWrapper";
import windowPic from '../../assets/images/window.png';
import { Bold } from "../shared/Spans";
import { reachMetrikaGoal } from "../../utils/reachMetrikaGoal";

const Wrapper = styled(FlexWrapper)`
    padding-top: var(--spacing_x8);
    background: url(${windowPic}) no-repeat center 100% / cover;
`;

export const IntroRegistration = () => {
    const [stage, setStage] = useState(0);
    const {next} = useProgress();

    const handleClick = () => {
        if (stage < 1) {
            setStage(prev => prev + 1);

            return;
        }
        reachMetrikaGoal('start game');
        next();
    }

    return (
        <Wrapper>
            <Block>
                {stage === 0 ? (
                    <>
                        <p>
                            Можно ли совмещать работу, отдых и саморазвитие — оставаясь в ресурсе?
                        </p>
                        <p>
                            <Bold>С игрой от Альфа-Банка это легко!</Bold> Прокачай свой баланс работы и жизни с мини-челленджами, лайфхаками и бонусами.
                        </p>
                    </>
                ) : (
                    <>
                    <p>
                        <Bold>Тебя ждут 4 недели заданий и идей для перезагрузки</Bold> — от рецептов до полезных советов. Выполняй активности, копи баллы и выигрывай призы.
                       
                    </p>
                    <p>Но сначала — познакомимся!</p>
                    </>
                    
                )}
            </Block>
            <Button onClick={handleClick}>Далее</Button>
        </Wrapper>
    )
};
