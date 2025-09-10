import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { findings } from "../../../constants/findings";
import { Title } from "../Title";

const ModalStyled = styled(Modal)`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlockStyled = styled(Block)`
    position: absolute;
    top: calc(50% - var(--spacing_x10));
    max-height: calc(100% - var(--spacing_x10) - var(--spacing_x10));
    overflow-y: auto;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: left;
    gap: var(--spacing_x1);

    & h3 {
        text-align: center;
    }
`;

const ButtonStyled = styled(Button)`
    margin-top: auto;
    margin-bottom: var(--spacing_x6);
`;

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;

    & p {
        font-weight: 300;
    }
`;
    
export const FindingModal = ({ isOpen, onClose, children, id, week, day, buttonText}) => {
    const finding = findings.find((hack) => id !== undefined ? hack.id === id : hack.week === week && hack.day === day);

    return (
        (
    <ModalStyled isOpen={isOpen} isDarken>
        <BlockStyled>
            <Title>{finding?.title}</Title>
            <TextWrapper>
                {typeof finding?.text === 'function' ? finding.text() : finding.text}
                {children}
            </TextWrapper>
        </BlockStyled>
        <ButtonStyled onClick={onClose}>{buttonText ?? 'Понятно'}</ButtonStyled>
    </ModalStyled>
)
    )
}