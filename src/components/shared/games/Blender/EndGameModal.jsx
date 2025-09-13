import styled from "styled-components";
import { Modal } from "../../modals";
import { Title } from "../../Title";
import { Bold, RedText } from "../../Spans";
import { Block } from "../../Block";
import { Button } from "../../Button";

const ModalStyled = styled(Modal)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlockStyled = styled(Block)`
    position: absolute;
    top: calc(50% - 2 * var(--spacing_x7));
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ButtonStyled= styled(Button)`
    margin-top: auto;
    margin-bottom: var(--spacing_x6);
`;

export const EndGameModal = ({ children, isOpen, onClose, points, isWin }) => {
    return (
        <ModalStyled isDarken isOpen={isOpen}>
            <BlockStyled>
                <Title>
                   {isWin ? 'ТАК ДЕРЖАТЬ!' : 'ПОПЫТКИ ЗАКОНЧИЛИСЬ!'}
                </Title>
                {children}
                {isWin ? (
                        <p>Ты заработал <RedText><Bold>{points}</Bold></RedText> <Bold>баллов</Bold>.</p>
                ) : (
                    <p>Не переживай, тебя ждут другие игры и задания. В этот раз ты заработал <RedText><Bold>{points}</Bold></RedText> <Bold>баллов</Bold>.</p>
                )}
                
            </BlockStyled>
            <ButtonStyled onClick={onClose}>Далее</ButtonStyled>
        </ModalStyled>
    );
};
