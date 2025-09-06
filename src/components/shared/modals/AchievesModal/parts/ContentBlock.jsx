import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-radius: var(--border-radius-lg);
`;

const Wrapper = styled.div`
    padding: var(--spacing_x2);
    gap: var(--spacing_x2);
    background: #898FA5;
    border-radius: var(--border-radius-lg);
    overflow: scroll;
    scrollbar-width: thin;
    scrollbar-color: #EBF0FF transparent;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overscroll-behavior: contain;

    &::-webkit-scrollbar {
        width: 3px;
    }

    ::-webkit-scrollbar-thumb {
        background: #EBF0FF;
        border-radius: 6px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 6px;
    }
`;

const Shadow = styled(motion.div)`
    position: sticky;
    float: left;
    bottom: 0;
    left: 0;
    height: var(--spacing_x3);
    min-height: var(--spacing_x3);
    background-color:  rgba(237,49,37, 0.25);
    filter: blur(10px);
    width: 100%;
    z-index: 10;
`;

export const ContentBlock = (props) => {
    const [hasShadow, setHasShadow] = useState(false);

    const $ref = useRef();

    useEffect(() => {
        if (!$ref?.current) return;
        console.log($ref.current.scrollHeight);
        console.log($ref.current.scrollHeight - $ref.current.clientHeight);
        console.log($ref.current.scrollTop);

        setHasShadow($ref.current.scrollHeight > $ref.current.clientHeight)
    }, []);

    const handleScroll = () => {
        if ($ref.current.scrollTop < $ref.current.scrollHeight - $ref.current.clientHeight) {
            if (hasShadow) return;

            setHasShadow(true);
            return;
        }

        setHasShadow(false);
    }

    return (
        <Container>
            <Wrapper ref={$ref} {...props} onScroll={handleScroll}>
                {props.children}
            </Wrapper>
            <AnimatePresence>
                {hasShadow && <Shadow initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}/>}
            </AnimatePresence>
        </Container>
    )
}