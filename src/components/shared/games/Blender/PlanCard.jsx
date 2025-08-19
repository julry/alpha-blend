import styled from 'styled-components';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';

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
    width :100%;
    flex-shrink: 0;
`;

export const PlanCard = ({ className, card, onClick }) => {
    const ratio = useSizeRatio();
    const { icon, id } = card ?? {};

    return (
        <Wrapper
            className={className}
            $ratio={ratio}
            onClick={onClick}
        >
            <Icon 
                src={icon} 
                alt={id} 
                $ratio={ratio}
            />
        </Wrapper>
    )
};
