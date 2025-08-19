import styled from "styled-components";
import { Button } from "../shared/Button";
import { useProgress } from "../../contexts/ProgressContext";
import { Block } from "../shared/Block";
import { FlexWrapper } from "../shared/ContentWrapper";
import window from '../../assets/images/window.png';

const Wrapper = styled(FlexWrapper)`
    background: url(${window}) no-repeat 0 0 / cover;
`;
export const Start = () => {
    const {next, user} = useProgress();

    return (
        <Wrapper>
            <Block>
                <p>
                    Отлично, ты зарегистрировался!{'\n'}
                    {user.isVip ? 
                        'А теперь к главному: в конце игры ты можешь выиграть iPhone 16 Pro Max 512 ГБ. Чем больше баллов — тем выше шанс на победу.' 
                        : 'В конце тебя ждут классные призы — чем больше баллов, тем выше шанс на победу.'
                    }
                    <br />
                    Готов играть? Тогда вперёд!
                </p>
            </Block>
            <Button onClick={() => next()}>Далее</Button>
        </Wrapper>
    )
};
