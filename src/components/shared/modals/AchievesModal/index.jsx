import styled from "styled-components";
import { FlexWrapper } from "../../ContentWrapper";
import { useState } from "react";
import { IconButton } from "../../Button";
import { RulesModal } from "../RulesModal";
import { AchievementPart } from "./parts/AchievementPart";
import { FindingPart } from "./parts/FindingPart";
import { ButtonArrow } from "./parts/ButtonArrow";
import { useProgress } from "../../../../contexts/ProgressContext";
import { Modal } from "../Modal";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { DrinksPart } from "./parts/DrinksPart";
import { achievements } from "../../../../constants/achievements";
import { BackHeader } from "../../BackHeader";

const Wrapper = styled(FlexWrapper)`
    background: #FFFFFF;
    padding: var(--spacing_x4) var(--spacing_x4) var(--spacing_x3);
`;

const ContentWrapper = styled(FlexWrapper)`
    padding: 0;
    flex-grow: 1;
    max-height: calc(100% - ${({$ratio}) => $ratio * 96}px);
`;

const Header = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing_x6);
`;

const ButtonStyled = styled.button`
    overflow: hidden;
    outline: none;
    border: none;
    background: none;
    position: relative;
    width: ${({ $ratio }) => $ratio * 48}px;
    height: ${({ $ratio }) => $ratio * 48}px;
    display: flex;
`;

const ArrowStyled = styled(ButtonArrow)`
    position: absolute;
`;
const ButtonArrowLeft = styled(ArrowStyled)`
    transform: scale(-4.5);
    left:  var(--spacing_x4);
    top: var(--spacing_x4);
`;

const ButtonArrowRight = styled(ArrowStyled)`
    transform: scale(4.5);
    top: calc(0px - ${({ $ratio }) => $ratio * 18}px);
    right: ${({ $ratio }) => $ratio * 18}px;
`;

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 23}px;
`;

export const AchievesModal = ({ onClose, isOpen }) => {
    const [isRulesModal, setIsRulesModal] = useState(false);
    const [stage, setStage] = useState(0);
    const ratio = useSizeRatio();
    const { user } = useProgress();

    const getHeaderContent = () => {
        switch (stage) {
            case 0:
                return (
                    <Amount $ratio={ratio}>{user.achievements.length ?? 0}/{achievements.length}</Amount>
                );
            case 1:
                return;
            case 2:
                return (
                    <Amount $ratio={ratio}>{user.drinks.length ?? 0}/12</Amount>
                );
            default:
                return;
        }
    }

    const getContent = () => {
        switch (stage) {
            case 0:
                return <AchievementPart openedAchievements={[0]} />;
            case 1:
                return <FindingPart openedFindings={[0, 1]} />;
            case 2:
                return <DrinksPart />;
            default:
                return;
        }
    }

    return (
        <Modal isOpen={isOpen}>
            <Wrapper>
                <BackHeader onBack={onClose} onInfoClick={() => setIsRulesModal(true)}>
                    {getHeaderContent()}
                </BackHeader>
                <ContentWrapper $ratio={ratio}>
                    {getContent()}
                </ContentWrapper>
                <ButtonsWrapper>
                    <ButtonStyled $ratio={ratio} onClick={() => setStage(prev => prev - 1)} disabled={stage === 0}>
                        <ButtonArrowLeft isDisabled={stage === 0} />
                    </ButtonStyled>
                    <ButtonStyled $ratio={ratio} onClick={() => setStage(prev => prev + 1)} disabled={stage === 2}>
                        <ButtonArrowRight $ratio={ratio} isDisabled={stage === 2} />
                    </ButtonStyled>
                </ButtonsWrapper>
                {isRulesModal && (
                    <RulesModal onClose={() => setIsRulesModal(false)} />
                )}
            </Wrapper>
        </Modal>
    )
}