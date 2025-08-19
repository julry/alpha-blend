import styled from "styled-components";
import { SCREENS } from "../../../constants/screens";
import { useProgress } from "../../../contexts/ProgressContext";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";
import { Button } from "../Button";
import { Modal } from "./Modal";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: var(--spacing_x5);
`;

const Text = styled.p`
    font-size: var(--font_md);
`;

const ButtonWrapper = styled.div`
    display: flex;
    width: 100%;
    margin-top: var(--spacing_x4);
    justify-content: space-between;

    & button {
        width: calc((100% - ${({$ratio}) => $ratio * 10}px) / 2);
    }
`;

export const ExitModal = ({isOpen, ...props}) => {
    const ratio = useSizeRatio();
    const { next, modal, setGamePoints } = useProgress();

    const { isLobby } = modal;

    const handleQuit = () => {
        props?.onClose();

        if (isLobby) {
            setGamePoints(0);
            next(SCREENS.LOBBY);
        }

        else next(SCREENS.LIBRARY);
    }

    const handleCancel = () => {
        props?.onClose();
    }

    return (
        <Modal isDarken isOpen={isOpen}>
            <Content>
                <Text>Если ты сейчас выйдешь из леса, то потеряешь прогресс на текущем уровне. Точно хочешь выйти?</Text>
                <ButtonWrapper $ratio={ratio}>
                    <Button color="pink" onClick={handleQuit}>Да</Button>
                    <Button color="red" onClick={handleCancel}>Нет</Button>
                </ButtonWrapper>
            </Content>
        </Modal>
    )
}