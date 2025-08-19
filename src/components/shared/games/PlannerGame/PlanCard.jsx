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
    ${({$isPicked}) => $isPicked ? 'margin-right: var(--spacing_x2); box-shadow: 0px 0px 8px -3px rgba(0, 0, 0, 0.25);' : ''};
    ${({$isSpecial}) => $isSpecial ? 'border: 1px solid rgba(239, 49, 36, 0.6); box-shadow: 0px 0px 10px var(--color-red);' : ''};
`;

const Icon = styled.img`
    width: 100%;
    height: ${({ $ratio }) => $ratio * 53}px;
    margin-bottom: var(--spacing_x1);
    box-shadow: inset 0 0 1px 1px red;
    flex-shrink: 0;
`;

const Points = styled(motion.p)`
    position: absolute;
    top: var(--spacing_x4);
    left: var(--spacing_x4);
    font-weight: 900;
    font-size: ${({$ratio}) => $ratio * 30}px;
    line-height: ${({$ratio}) => $ratio * 39}px;
    letter-spacing: 0.02em;
    color: var(--color-red);
    -webkit-text-stroke: 2px white;
    text-stroke: 2px white;

    @supports not ((text-stroke: 2px white) or (-webkit-text-stroke: 2px white)) {
        text-shadow: 0 0 2px white;
    }
`;

const Text = styled.p`
    font-size: ${({$ratio}) => $ratio * 11}px;
    line-height: ${({$ratio}) => $ratio * 9}px;
    text-align: center;
    letter-spacing: -0.03em;
    text-transform: lowercase;
    width: 100%;
    white-space: pre;
`;

export const PlanCard = memo(({ card, isNotDraggable, shownPoints, isPicked, onClick }) => {
    const ratio = useSizeRatio();
    const [isShownPoints, setIsShownPoints] = useState(shownPoints > 0);
    const { icon, text, isSpecial } = card ?? {};

    useEffect(() => {
        if (!shownPoints) return;

        const timer = setTimeout(() => {
            setIsShownPoints(false);
        }, 1300);

        return () => clearTimeout(timer);
    }, [shownPoints]);


    return (
        <Wrapper
            $ratio={ratio}
            $isNotDraggable={isNotDraggable}
            $isSpecial={isSpecial}
            $isPicked={isPicked}
            initial={{
                scale: 1,
            }}
            animate={isPicked ? { scale: 1.25 } : {}}
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
            <AnimatePresence>
                {isShownPoints && (
                    <Points
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.1 }}
                        $ratio={ratio}
                    >
                        +{shownPoints}
                    </Points>
                )}
            </AnimatePresence>
        </Wrapper>
    )
});
