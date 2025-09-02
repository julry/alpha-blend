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

export const IntroRegistration = () => {
    const [stage, setStage] = useState(0);
    const {next} = useProgress();

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
            <Button onClick={() => stage < 1 ? setStage(prev => prev + 1) : next()}>Далее</Button>
        </Wrapper>
    )
};
