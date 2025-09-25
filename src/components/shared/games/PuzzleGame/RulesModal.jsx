import styled from "styled-components";
import { Bold } from "../../Spans";
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
                   Перед тобой пазл с особыми локациями — местами культуры, знаний и вдохновения. У тебя есть <Bold>3 минуты</Bold>, чтобы собрать картинку!
                </p>
                <p>
                    Каждый правильно поставленный кусочек даёт <Bold>+5 баллов</Bold>. Успеешь собрать весь пазл до конца таймера — получишь ещё <Bold>+15 баллов</Bold>!
                </p>
                 <p>
                   Перетащи кусочек пазла, чтобы поставить его в нужное место. Если кусочек встал правильно, он закрепится и больше не сдвинется.
                </p>
            </Content>
        </Modal>
    )
}