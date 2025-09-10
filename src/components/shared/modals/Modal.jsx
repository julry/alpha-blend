import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const Wrapper = styled(motion.div)`
    position: absolute;
    inset: 0;
    z-index: 1000;
    background: ${({ $isDarken }) => $isDarken ? 'rgba(36, 38, 50, 0.7)' : 'transparent'};
    will-change: opacity;
`;

export const Modal = ({ isDarken, isOpen, isDisabledAnimation, ...props }) => (
    <AnimatePresence>
        {isOpen && (
            <Wrapper
                {...props}
                $isDarken={isDarken}
                initial={{
                    opacity: isDisabledAnimation ? 1 : 0,
                }}
                animate={!isDisabledAnimation && { opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            />
        )}
    </AnimatePresence>
)