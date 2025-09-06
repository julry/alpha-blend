import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { findings } from "../../../constants/findings";
import { useProgress } from "../../../contexts/ProgressContext";
import { Title } from "../Title";

const ModalStyled = styled(Modal)`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlockStyled = styled(Block)`
    position: absolute;
    top: calc(50% - var(--spacing_x8));
    max-height: calc(100% - var(--spacing_x8) - var(--spacing_x10));
    min-height: calc(100% - var(--spacing_x8) - var(--spacing_x10));
    overflow-y: auto;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ButtonStyled = styled(Button)`
    margin-top: auto;
    margin-bottom: var(--spacing_x6);
`;


const TextWrapper = styled.div`
    margin-top: var(--spacing_x1);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing_x1) * 1.5);

    & p {
        font-weight: 300;
    }
`;
    
export const FindingModal = ({ isOpen, onClose, children, id, week, day, isNew}) => {
    const { addDayFinding } = useProgress();
    const finding = findings.find((hack) => id !== undefined ? hack.id === id : hack.week === week && hack.day === day);

    const handleClick = () => {
        if (isNew) {
            //TODO: запись на сервер
            addDayFinding(id ?? finding.id);
        }
        onClose?.();
    };

    return (
        (
    <ModalStyled isOpen={isOpen} isDarken>
        <BlockStyled>
            <Title>{finding?.title}</Title>
            <TextWrapper>
                {typeof finding?.text === 'function' ? finding?.text() : finding?.text}
                {children}
            </TextWrapper>
        </BlockStyled>
        <ButtonStyled onClick={handleClick}>Понятно</ButtonStyled>
    </ModalStyled>
)
    )
}