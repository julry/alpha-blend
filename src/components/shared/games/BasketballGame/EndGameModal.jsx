import styled from "styled-components";
import { Modal } from "../../modals/Modal";
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

const ButtonsWrapper= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing_x3);
    margin-top: auto;
    width: 100%;
    margin-bottom: var(--spacing_x6);
`;

export const EndGameModal = ({ children, isOpen, onClose, points, isTime, lives, onRestart }) => {
    return (
        <ModalStyled isDarken isOpen={isOpen}>
            <BlockStyled>
                <Title>
                   {isTime ? 'ВРЕМЯ ВЫШЛО!' : 'ПОПЫТКИ ЗАКОНЧИЛИСЬ!'}
                </Title>
                {children}
                {lives > 0 ? (
                        <p>
                            Ты заработал <RedText><Bold>{points}</Bold></RedText> <Bold>баллов</Bold>.{'\n'}
                            У тебя остались попытки — можешь переиграть, чтобы улучшить свой результат.
                        </p>
                ) : (
                    <p>
                        Ты заработал <RedText><Bold>{points}</Bold></RedText> <Bold>баллов</Bold>.{'\n'}
                        У тебя больше не осталось попыток — это конечный результат.
                    </p>
                )}
                
            </BlockStyled>
            <ButtonsWrapper>
                {lives > 0 ? (
                   <>
                        <Button onClick={onRestart}>Ещё раз</Button>
                        <Button onClick={onClose} type="secondary">Далее</Button>
                    </>
                ) : (
                    <Button onClick={onClose}>Далее</Button>
                )}
            </ButtonsWrapper>
        </ModalStyled>
    );
};
