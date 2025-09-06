import styled from "styled-components";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { Title } from "../../../Title";
import { drinks } from "../../../../../constants/drinks";
import { MIN_MOCKUP_WIDTH } from "../../../../ScreenTemplate";

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
        padding-right: var(--spacing_x3);
    }
`;

const GridWrapper = styled.div`
    width: 100%;
    display: grid;
    margin-top: calc(0px - var(--spacing_x3));
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    justify-items: center;
    align-items: center;

    @media screen and (max-height: 590px) {
        overflow-y: auto;
    }

    @media screen and (min-height: 800px) and (max-width: ${MIN_MOCKUP_WIDTH}px) {
        margin-top: var(--spacing_x3);
    }
`;

const DrinkWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: ${({ $ratio }) => $ratio * 100}px;
    height: ${({ $ratio }) => $ratio * 115}px;

    /* @media screen and (max-height: 670px) {
        height: ${({ $ratio }) => $ratio * 108}px;
    }

    @media screen and (max-height: 630px) {
        height: ${({ $ratio }) => $ratio * 96}px;
    }
    @media screen and (max-height: 590px) {
        height: ${({ $ratio }) => $ratio * 86}px;
    } */
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
    bottom: ${({$bottom, $ratio}) => $bottom * $ratio}px;
    width: var(--size);
    height: var(--size);
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
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