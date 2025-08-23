import styled from "styled-components";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { Title } from "../../../Title";
import { drinks } from "../../../../../constants/drinks";

const TitleStyled = styled(Title)`
    width: 100%;
    font-size: ${({ $ratio }) => $ratio * 33}px;
    text-align: ${({$align = 'left'}) => $align};
    font-weight: 900;

    &:first-child {
        margin-top: var(--spacing_x2);
        padding-left: var(--spacing_x3);
    }

    &:last-of-type {
        margin-bottom: var(--spacing_x2);
        padding-right: var(--spacing_x3);
    }
`;

const GridWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    height: ${({ $ratio }) => $ratio * 475}px;
    justify-items: center;
    align-items: center;

     @media screen and (max-height: 670px) {
        height: ${({ $ratio }) => $ratio * 385}px;
    }
`;

const DrinkWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: ${({ $ratio }) => $ratio * 100}px;
    height: ${({ $ratio }) => $ratio * 117}px;

    @media screen and (max-height: 670px) {
        height: ${({ $ratio }) => $ratio * 95}px;
    }
`;

const DrinkInfo = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${({ $ratio }) => $ratio * 30}px;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 0px 48px -12px rgba(0, 0, 0, 0.45), 2px 2px 12px -8px rgba(0, 0, 0, 0.15);
    /* box-shadow: 0px 0px 48px -12px rgba(0, 0, 0, 0.45), 2px 2px 12px -8px rgba(0, 0, 0, 0.15), inset 2px 2px 8.6px rgba(255, 255, 255, 0.15), inset 1px 1px 4.3px rgba(255, 255, 255, 0.15); */
    border-radius: 100px;
    font-size: var(--font_xs);
    z-index: 5;
    text-align: center;
    backdrop-filter: blur(4.7px);

    & p {
        width: min-content;
        line-height: 0.85;
    }
`;

const DrinkPicture = styled.img`
    position: absolute;
    --size: ${({$size, $ratio}) => $size * $ratio}px;
    bottom: ${({$bottom, $ratio}) => (30 - $bottom) * $ratio}px;
    width: var(--size);
    height: var(--size);
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;

    @media screen and (max-height: 670px) {
        width: calc(0.8 * var(--size));
        height: calc(0.8 * var(--size));
    }
`;

export const DrinksPart = ({openedDrinks = []}) => {
    const ratio = useSizeRatio();

    const getIsOpened = (id) => openedDrinks.includes(id);
    return (
        <>
            <TitleStyled $ratio={ratio}>
                Коллекция
            </TitleStyled>
            <TitleStyled $ratio={ratio} $align={'right'}>
                Напитков
            </TitleStyled>
            <GridWrapper $ratio={ratio}>
                {drinks.map(({id, title, openedPic, closedPic, bottom, size}) => (
                    <DrinkWrapper key={id} $ratio={ratio}>
                        <DrinkInfo $ratio={ratio}>
                            <p>{getIsOpened(id) ? title : '???'}</p>
                        </DrinkInfo>
                        <DrinkPicture 
                            src={getIsOpened(id) ? openedPic : closedPic} 
                            alt="title"
                            $ratio={ratio}
                            $bottom={bottom}
                            $size={size}
                        />
                    </DrinkWrapper>
                ))}
            </GridWrapper>
        </>
    )
}