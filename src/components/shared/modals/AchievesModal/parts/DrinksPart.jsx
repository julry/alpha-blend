import styled from "styled-components";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { Title } from "../../../Title";
import { drinks } from "../../../../../constants/drinks";
import { MIN_MOCKUP_WIDTH } from "../../../../ScreenTemplate";
import { useProgress } from "../../../../../contexts/ProgressContext";
import { DrinkModal } from "../../DrinkModal";
import { useState } from "react";

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
`;

const DrinkInfo = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${({ $ratio }) => $ratio * 30}px;
    width: 100%;
    background: #FFFFFF;
    
    box-shadow: 0px 0px 10px 4px ${({$isActive, $shadow}) => $isActive ?  $shadow : 'rgba(255, 0, 0, 0.15)'}, 0px 0px 2px 0px rgba(0,0,0,0.15);
    border-radius: 100px;
    font-size: var(--font_xs);
    z-index: 5;
    text-align: center;
    backdrop-filter: blur(4.7px);

    & p {
        width: min-content;
        line-height: 0.85;
        font-weight: 500;
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

export const DrinksPart = () => {
    const {user} = useProgress();
    const ratio = useSizeRatio();
    const [infoDrink, setIsInfoDrink] = useState();

    const handleOpenDrink = (drink) => {
        if (!getIsOpened(drink.id)) return;

        setIsInfoDrink(drink);
    }

    const getIsOpened = (id) => user.drinks?.includes(id);

    return (
        <>
            <TitleStyled $ratio={ratio}>
                Коллекция
            </TitleStyled>
            <TitleStyled $ratio={ratio} $align={'right'}>
                Напитков
            </TitleStyled>
            <GridWrapper $ratio={ratio}>
                {drinks.map((drink) => (
                    <DrinkWrapper key={drink.id} $ratio={ratio} onClick={() => handleOpenDrink(drink)}>
                        <DrinkInfo $ratio={ratio} $shadow={drink.shadow} $isActive={getIsOpened(drink.id)}>
                            <p>{getIsOpened(drink.id) ? drink.title : '???'}</p>
                        </DrinkInfo>
                        <DrinkPicture 
                            src={getIsOpened(drink.id) ? drink.openedPic : drink.closedPic} 
                            alt="title"
                            $ratio={ratio}
                            $bottom={drink.bottom}
                            $size={drink.size}
                        />
                    </DrinkWrapper>
                ))}
            </GridWrapper>
            <DrinkModal isOpen={infoDrink !== undefined} onClose={() => setIsInfoDrink()} drink={infoDrink}/>
        </>
    )
}