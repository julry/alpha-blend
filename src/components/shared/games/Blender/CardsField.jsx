import styled from "styled-components";
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";

const CardsContainer = styled.div`
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: var(--content-width);
    display: flex;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch; /* Для плавного скролла на iOS */
    white-space: nowrap; /* Предотвращает перенос элементов */
    touch-action: pan-x;
    scroll-snap-type: x mandatory;
    margin-top: auto;
    background-color: white;
    border-radius: var(--border-radius-lg);
`;

const CardStyled = styled(PlanCard)`
    width: ${({ $ratio }) => $ratio * 72}px;
    height: ${({ $ratio }) => $ratio * 72}px;
    ${({$active}) => $active ? 'box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.25);  z-index: 20;' : ''};
`;

export const CardsField = ({ shownCards = [], onCardClick, activeCard, className, activeCardType2, children }) => {
    const ratio = useSizeRatio()
    return (
        <CardsContainer className={className}>
            {shownCards.map((card) => (
                <CardStyled key={card.id} $active={activeCard === card.id} $ratio={ratio} card={card} onClick={() => onCardClick(card)}>
                    {activeCardType2 === card.id && children}
                </CardStyled>
            ))}
        </CardsContainer>
    );
};
