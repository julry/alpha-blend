import styled from "styled-components";
import { FlexWrapper } from "../../ContentWrapper";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { PlanCard } from "./PlanCard";

const Wrapper = styled(FlexWrapper)`
    position: relative;
    padding: 0;
    padding-top: var(--spacing_x6);
    height: auto;
    min-height: unset;
    max-width: var(--content-width);

    & > svg {
        position: absolute;
    }
`;

const TYPE_TO_TEXT = {
    morning: '#F4A89F',
    day: '#F18677',
    evening: '#EC6353',
}

const Title = styled.h3`
    position: absolute;
    top: var(--spacing_x2);
    font-weight: 900;
    font-size: ${({$ratio}) => $ratio * 30}px;
    text-align: center;
    letter-spacing: -0.03em;
    z-index: 4;
    text-transform: uppercase;
    color: ${({$type}) => TYPE_TO_TEXT[$type]};
`;

const ColorBlock = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    box-shadow: -14px -3px 40.7px -12px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4.7px);
    border-radius: var(--border-radius-md); 
    background-color: transparent;
    width: 100%;
    height: ${({$ratio}) => $ratio * 103}px;
    z-index: 2;
    gap: var(--spacing_x1);
    padding: ${({$ratio}) => $ratio * 8}px ${({$ratio}) => $ratio * 6}px;
`;

export const TimeBlock = ({title, type, onClick, cards}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper onClick={onClick}>
            <Title $ratio={ratio} $type={type}>{title}</Title>
            <ColorBlock $ratio={ratio} $type={type}>
                {cards.map(({points, ...card}) => (
                    <PlanCard key={card.id} card={card} shownPoints={points} isNotDraggable/>
                ))}
            </ColorBlock>
        </Wrapper>
    );
};
