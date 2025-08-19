import styled from "styled-components";
import { FlexWrapper } from "../../ContentWrapper";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { PlanCard } from "./PlanCard";

const Wrapper = styled(FlexWrapper)`
    position: relative;
    padding: var(--spacing_x6) 0;
    height: auto;
    max-width: var(--content-width);

    & > svg {
        position: absolute;
    }
`;

const COLOR_TO_BG = {
    green: 'rgba(143, 255, 0, 0.25)',
    red: 'rgba(239, 49, 36, 0.25)',
    purple: 'rgba(154, 46, 252, 0.25)',
}

const COLOR_TO_TEXT = {
    green: '#89F301',
    red: 'var(--color-red)',
    purple: '#9A2EFC',
}

const Title = styled.h3`
    position: absolute;
    top: 2px;
    font-weight: 900;
    font-size: ${({$ratio}) => $ratio * 70}px;
    text-align: center;
    letter-spacing: -0.03em;
    z-index: 2;
    text-transform: uppercase;
    color: ${({$color}) => COLOR_TO_TEXT[$color]};
    clip-path: inset(0 0 65% 0);
`;

const TitleBottom = styled(Title)`
    clip-path: inset(35% 0 0 0);
    filter: blur(4.7px);
    width: 100%;
    text-align: center;
`;

const ColorBlock = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    box-shadow: -14px -3px 40.7px -12px rgba(0, 0, 0, 0.35), inset 6px 6px 8.6px rgba(255, 255, 255, 0.8), inset -6px -6px 8.6px rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4.7px);
    border-radius: var(--border-radius-md); 
    background: ${({$color}) => COLOR_TO_BG[$color]};
    width: 100%;
    height: ${({$ratio}) => $ratio * 103}px;
    z-index: 4;
    gap: var(--spacing_x1);
    padding: ${({$ratio}) => $ratio * 8}px ${({$ratio}) => $ratio * 6}px;
`;

export const TimeBlock = ({title, color, onClick, cards}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper onClick={onClick}>
            <Title $ratio={ratio} $color={color}>{title}</Title>
            <TitleBottom $ratio={ratio} $color={color}>{title}</TitleBottom>
            <ColorBlock $ratio={ratio} $color={color}>
                {cards.map(({points, ...card}) => (
                    <PlanCard key={card.id} card={card} shownPoints={points} isNotDraggable/>
                ))}
            </ColorBlock>
        </Wrapper>
    );
};
