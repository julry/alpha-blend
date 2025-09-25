import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Title } from "../Title";
import { Bold } from "../Spans";
import { useSizeRatio } from "../../../hooks/useSizeRatio";

const ModalStyled = styled(Modal)`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlockStyled = styled(Block)`
    position: absolute;
    top: 50%;
    max-height: calc(100% - var(--spacing_x8));
    overflow-y: auto;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: left;

    & p {
        font-weight: 300;
        font-size: var(--font_xs);
    }

    & h3 {
        text-align: center;
    }
`;

const InfoBlock = styled.div`
    display: flex;
    align-items: center;
    gap: var(--spacing_x2);
`;

const DrinkWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 100%;
    width: ${({$modalPicWidth}) => $modalPicWidth}px;
`;

const DrinkPic = styled.img`
    width: ${({$size}) => $size * 1.625}px;
    height: ${({$size}) => $size * 1.625}px;
    object-fit: contain;
`;

const UlStyled = styled.ul`
    padding-left: calc(var(--spacing_x3) - 2px);
    margin-top: var(--spacing_x1);
`;
const LiStyled = styled.li`
    font-weight: 300;
    font-size: var(--font_xs);
`;

const Description = styled.p`
    flex: 1;
`;

const FullWidth = styled.div`
    width: 100%;
`;
    
export const DrinkModal = ({ isOpen, onClose, drink = {}}) => {
    const ratio = useSizeRatio();
    return (
    <ModalStyled isOpen={isOpen} isDarken>
        <BlockStyled hasCloseIcon onClose={onClose}>
            <Title>{drink?.title}</Title>
            <InfoBlock $size={drink?.size * ratio}>
                <DrinkWrapper $modalPicWidth={drink.modalPicWidth * ratio}>
                    <DrinkPic src={drink.openedPic} $size={drink.size * ratio}/>
                </DrinkWrapper>
                <Description>{drink?.description}</Description>
            </InfoBlock>
            <FullWidth>
                <p><Bold>Ингредиенты</Bold></p>
                <UlStyled>
                    {drink.ingridientsText?.map((text) => (
                        <LiStyled key={text.slice(0, 20)}>{text}</LiStyled>
                    ))}
                </UlStyled>
            </FullWidth>
            <FullWidth>
                <p><Bold>Приготовление</Bold></p>
                <UlStyled>
                    {drink.recipeText?.map((text) => (
                        <LiStyled key={text.slice(0, 20)}>{text}</LiStyled>
                    ))}
                </UlStyled>
            </FullWidth>
        </BlockStyled>
    </ModalStyled>
    )
}