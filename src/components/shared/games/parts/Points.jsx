import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";

const Wrapper = styled(motion.p)`
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


export const Points = ({className, isShown, shownPoints}) => {
    const ratio = useSizeRatio();

    return (
    <AnimatePresence>
        {isShown && (
            <Wrapper
                className={className}
                initial={{
                    opacity: 0,
                    height: 0,
                }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.1 }}
                $ratio={ratio}
            >
                {shownPoints > 0 ? `+${shownPoints}` : shownPoints}
            </Wrapper>
        )}
    </AnimatePresence>
)
}