import styled from 'styled-components';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { ingridients } from '../../../../constants/ingridients';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing_x1);
    background: #FFFFFF;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
`;

const Icon = styled.img`
    height: 100%;
    width: 100%;
    flex-shrink: 0;
    object-fit: contain;
`;

export const PlanCard = ({ className, card, children, onClick }) => {
    const ratio = useSizeRatio();
    const shownCard = card?.img ? card : ingridients.find((ing) => ing.id === card?.id);

    const { img, id } = shownCard ?? {};

    return (
        <Wrapper
            className={className}
            $ratio={ratio}
            onClick={onClick}
        >
            <Icon 
                src={img} 
                alt={id} 
                $ratio={ratio}
            />
            {children}
        </Wrapper>
    )
};
