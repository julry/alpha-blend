import styled from "styled-components";
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";

const CardsContainer = styled.div`
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: var(--container-width);
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
`;


export const CardsField = ({ shownCards = [], onCardClick, className }) => {
    const ratio = useSizeRatio()
    return (
        <CardsContainer className={className}>
            {shownCards.map((card) => (
                <CardStyled key={card.id} $ratio={ratio} card={card} onClick={() => onCardClick(card)} />
            ))}
        </CardsContainer>
    );
};
