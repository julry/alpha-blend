import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';

const Wrapper = styled(motion.div)`
    position: relative;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing_x1);
    width: ${({ $ratio }) => $ratio * 100}px;
    height: ${({ $ratio }) => $ratio * 88}px;
    background: #FFFFFF;
    border-radius: var(--border-radius-sm);
    cursor: ${({ $isNotDraggable }) => $isNotDraggable ? 'auto' : 'pointer'};
    ${({$isPicked}) => $isPicked ? 'margin-right: var(--spacing_x2); box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25), inset 0 0 1px 1px rgba(255, 0, 0, 0.25);' : ''};
    ${({$isSpecial}) => $isSpecial ? 'border: 1px solid rgba(239, 49, 36, 0.6); box-shadow: 0px 0px 10px var(--color-red);' : ''};
`;

const Icon = styled.img`
    width: 100%;
    flex: 1;
    margin-bottom: var(--spacing_x1);
    flex-shrink: 0;
`;

const Text = styled.p`
    font-size: ${({$ratio}) => $ratio * 11}px;
    line-height: ${({$ratio}) => $ratio * 9}px;
    text-align: center;
    letter-spacing: -0.03em;
    text-transform: lowercase;
    width: 100%;
    font-weight: 500;
    white-space: pre;
`;

export const PlanCard = memo(({ card, isNotDraggable, isPicked, onClick }) => {
    const ratio = useSizeRatio();
    const { icon, text, isSpecial } = card ?? {};

    return (
        <Wrapper
            $ratio={ratio}
            $isNotDraggable={isNotDraggable}
            $isSpecial={isSpecial}
            $isPicked={isPicked}
            initial={{
                scale: 1,
            }}
            animate={isPicked ? { scale: 1.05 } : {}}
            transition={{ duration: 0.1 }}
            onClick={onClick}
        >
            <Icon 
                src={icon} 
                alt={text} 
                $ratio={ratio}
            />
            <Text 
                $ratio={ratio}
            >
                {text}
            </Text>
        </Wrapper>
    )
});
