import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { findings } from "../../../constants/findings";
import { useProgress } from "../../../contexts/ProgressContext";

const ModalStyled = styled(Modal)`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlockStyled = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ButtonStyled = styled(Button)`
    margin-top: auto;
    margin-bottom: var(--spacing_x6);
`;

const TitleWrapper = styled.div`
    background: #9A2EFC;
    border-radius: calc(var(--border-radius-lg) - var(--border-radius-sm));
    width: 100%;
    padding: var(--spacing_x1);
    padding-top: var(--spacing_x2);
    font-size: calc(var(--font_lg) + 2px);
    font-weight: 900;
    color: white;
`;

const TextWrapper = styled.div`
    margin-top: var(--spacing_x1);
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
            <TitleWrapper>ЛАЙФХАК</TitleWrapper>
            <TextWrapper>
                <p>{finding?.text}</p>
                {children}
            </TextWrapper>
        </BlockStyled>
        <ButtonStyled onClick={handleClick}>Понятно</ButtonStyled>
    </ModalStyled>
)
    )
}