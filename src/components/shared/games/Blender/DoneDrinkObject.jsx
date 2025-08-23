import { useDrag } from "react-dnd";
import styled from "styled-components";
import { usePreview } from "react-dnd-multi-backend";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";

const Wrapper = styled.div`
    width: ${({ $size }) => $size * 0.8}px;
    height: ${({ $size }) => $size}px;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;


const StyledPreview = styled(Wrapper)`
  opacity: 0.3;
  cursor: grabbing;
  z-index: 1000;
`;

export const DoneDrinkOject = ({ drink }) => {
    const ratio = useSizeRatio()
    const [{isDragging}, drag] = useDrag({
        type: 'DRINK',
        item: () => {
            return drink;
        },
         collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const DrinkPreview = () => {
        const {display, style} = usePreview();

        if (!display) {
            return null;
        }

        return (
            <>
                <StyledPreview style={style} $size={ratio * drink.size}>
                    <Image src={drink.openedPic}/>
                </StyledPreview>
                <Wrapper $size={ratio * drink.size} />
            </>
        );
    };

    if (isDragging) {
        return <DrinkPreview />;
    }

    return (
        <Wrapper $size={ratio * drink.size} ref={drag}>
            <Image src={drink.openedPic} alt={drink.title} />
        </Wrapper>
    )
}