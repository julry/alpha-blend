import styled from "styled-components";
import { Bold, RedText } from "../../Spans";
import { Block } from "../../Block";
import { Title } from "../../Title";
import { Modal } from "../../modals";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-left: var(--spacing_x3);
    padding-right: var(--spacing_x3);
    font-size: var(--font_sm);
`;

const TitleStyled = styled(Title)`
    font-size: var(--font_lg);
`;

export const RulesModal = ({ onClose, isOpen }) => {
    return (
        <Modal isDarken isOpen={isOpen}>
            <Content hasCloseIcon onClose={onClose}>
                <TitleStyled>как играть?</TitleStyled>
                <p>
                    Зажми мяч и проведи пальцем вверх, чтобы бросить его в кольцо. 
                </p>
                <p>
                    Попадание приносит <Bold><RedText>10</RedText> очков,</Bold> промах — минус одна жизнь. Всего у тебя <Bold><RedText>3</RedText> жизни.</Bold> Пока они не закончились, можно пробовать снова. 
                </p>
                 <p>
                    Игра длится <Bold><RedText>1</RedText> минуту</Bold> или до того момента, как закончатся все жизни.
                </p>
            </Content>
        </Modal>
    )
}