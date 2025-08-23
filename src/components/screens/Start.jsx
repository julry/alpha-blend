import styled from "styled-components";
import { Button } from "../shared/Button";
import { useProgress } from "../../contexts/ProgressContext";
import { Block } from "../shared/Block";
import { FlexWrapper } from "../shared/ContentWrapper";
import window from '../../assets/images/window.png';
import { WeekLobby } from "./WeekLobby";
import { SCREENS } from "../../constants/screens";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const Content = styled(FlexWrapper)`
    position: absolute;
    inset: 0;
`;

export const Start = () => {
    const {next, user, currentWeek} = useProgress();
    
    const canPlay = currentWeek > 0;
    
    return (
        <Wrapper>
            <WeekLobby isHideUnavailable />
            <Content>
                <Block>
                    <p>
                        Отлично, ты зарегистрировался!{'\n'}
                        {user.isVip ? 
                            'А теперь к главному: в конце игры ты можешь выиграть iPhone 16 Pro Max 512 ГБ. Чем больше баллов — тем выше шанс на победу.' 
                            : 'В конце тебя ждут классные призы — чем больше баллов, тем выше шанс на победу.'
                        }
                        <br />
                        <br />
                        {canPlay ? 'Готов играть? Тогда вперёд!' : 'Игра начнется в понедельник, следи за новостями.'}
                    </p>
                </Block>
                {canPlay && <Button onClick={() => next(SCREENS.LOBBY)}>Играть</Button>}
            </Content>
        </Wrapper>
    )
};
