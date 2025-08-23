import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";

const Wrapper = styled.button`
    border: none;
    outline: none;
    background: ${({$type}) => 'var(--btn-bg-' + $type + ')'};
    color: ${({$type}) => 'var(--btn-color-' + $type + ')'};
    font-size: var(--font_lg); 
    width: 100%;
    padding: var(--spacing_x4) var(--spacing_x2);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    max-width: var(--content-width);

    ${({$isBottom}) =>  $isBottom ? 'margin-top: auto' : ''};

    box-shadow: 0px 0px 46.4px -3px rgba(0, 0, 0, 0.15);
    /* box-shadow: 0px 0px 46.4px -3px rgba(0, 0, 0, 0.15), inset 1.99778px 1.8619px 8.6px rgba(255, 255, 255, 0.15), inset 1.06858px 0.9959px 4.3px rgba(255, 255, 255, 0.15); */

    &:disabled {
        background: ${({$type}) => 'var(--btn-bg-' + $type + '-disabled)'};
        color: ${({$type}) => 'var(--btn-color-' + $type + '-disabled)'};
    }
`;

const IconWrapper = styled(Wrapper)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({$ratio}) => $ratio * 48}px;
    height: ${({$ratio}) => $ratio * 48}px;
    padding: 0;
    border-radius: var(--border-radius-icon);

    & svg:first-of-type {
        width: ${({$ratio, $svgWidth}) => $ratio * $svgWidth}px;
        height: ${({$ratio, $svgHeight}) => $ratio * $svgHeight}px;
    }
`;

export const Button = ({type = 'main', isBottom = true, ...props}) => {
    const ratio = useSizeRatio();

    return <Wrapper {...props} $type={type} $ratio={ratio} $isBottom={isBottom}/>
}

export const IconButton = ({icon = {}, type = 'main', ...props}) => {
    const ratio = useSizeRatio();
    const {width = 30, height = 30} = icon;

    return <IconWrapper {...props} $svgWidth={width} $svgHeight={height} $type={type} $ratio={ratio} />
}

export const BackButton = styled(IconButton)`
    width: auto;
    padding: 0 var(--spacing_x2);
`;