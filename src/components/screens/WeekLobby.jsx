import styled from "styled-components";
import {FlexWrapper} from '../shared/ContentWrapper';
import bg from '../../assets/images/backLobby.png';
import building from '../../assets/images/building.png';
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { CURRENT_WEEK, useProgress } from "../../contexts/ProgressContext";
import { useState } from "react";
import { CommonModal } from "../shared/modals/CommonModal";
import { Bold } from "../shared/Spans";
import { SCREENS } from "../../constants/screens";

const Wrapper = styled(FlexWrapper)`
    background: url(${bg}) center 100% no-repeat;
    background-size: cover;
    padding: 0;
`;

const BuildingWrapper = styled.div`
    background: url(${building}) center 100% no-repeat;
    background-size: ${({$ratio}) => $ratio * 375}px ${({$ratio}) => $ratio * 667}px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin: 0 auto;
    padding-bottom: ${({$ratio}) => $ratio * 120}px;
`;

const Floor = styled.div`
    height: ${({$ratio}) => $ratio * 76}px;
    width: 100%;
    max-width: ${({$ratio}) => $ratio * 293}px;
    position: relative;
    ${({$isActive}) => $isActive && 'box-shadow: 0px 0px 13.1px #ED3125; border: 1px solid #EF3124;'}

    & + & {
        margin-top: ${({$ratio}) => $ratio * 16}px;
    }
`;

const UnavailableBlock = styled.div`
    position: relative;
    z-index: 2;
    background: rgba(36, 38, 50, 0.6);
    mix-blend-mode: multiply;
    width: 100%;
    height: 100%;
`;

const LockStyled = styled.svg`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: ${({$ratio}) => $ratio * 30}px;
    height: ${({$ratio}) => $ratio * 30}px;
    z-index: 3;
`;

export const WeekLobby = ({isHideUnavailable}) => {
    const { passedWeeks = [], isShowWeekLobbyInfo, setIsShowWeekLobbyInfo, next } = useProgress();
    const [isShownInfo, setIsShownInfo] = useState(isShowWeekLobbyInfo);
    const [isClosedInfo, setIsClosedInfo] = useState(false);

    const ratio = useSizeRatio();

    const getIsFloorActive = (index) => {
        if (index > CURRENT_WEEK) return;

        const isWeekPassed = passedWeeks.includes(CURRENT_WEEK);

        return isWeekPassed ? index === CURRENT_WEEK : index === (passedWeeks[passedWeeks.length - 1] ?? 0) + 1;
    };

    const getIsFloorUnavailable = (index) => {
        const isWeekPassed = passedWeeks.includes(CURRENT_WEEK);
        
        return isWeekPassed ? index > CURRENT_WEEK : (index > ((passedWeeks[passedWeeks.length - 1] ?? 0) + 1));
    }

    const handleFloorClick = (index) => {
        if (getIsFloorUnavailable(index)) {
            setIsClosedInfo(true);

            return;
        }

        next(SCREENS[`LOBBY${index}`]);
    };

    const handleCloseInfo = () => {
        setIsShowWeekLobbyInfo(false);
        setIsShownInfo(false);
    }

    return (
        <Wrapper>
            <BuildingWrapper $ratio={ratio}>
                {[4, 3, 2, 1].map((index) => (
                    <Floor key={index} $number={index} $ratio={ratio} $isActive={getIsFloorActive(index)} onClick={() => handleFloorClick(index)}>
                        {getIsFloorUnavailable(index) && !isHideUnavailable && (
                            <>
                                <UnavailableBlock />
                                <LockStyled $ratio={ratio} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.7541 12.4889C23.1209 12.4889 23.468 12.4889 23.815 12.4889C25.1294 12.4889 25.9924 13.3463 25.9949 14.6829C26.0017 19.063 26.0017 23.4432 25.9949 27.8233C25.9949 29.0839 25.0823 29.9941 23.8373 29.9941C18.2332 29.9941 12.6291 29.9941 7.02495 29.9941C6.76003 29.9941 6.49447 29.9973 6.22891 29.9999C4.91576 30.0121 4 29.0981 4 27.7654C4 24.2763 4 20.7874 4 17.2987C4 16.4298 4 15.5596 4 14.6906C4.00382 13.3688 4.86864 12.4947 6.17605 12.4883C6.41996 12.4883 6.66578 12.4716 6.90777 12.4935C7.18607 12.5192 7.27332 12.4239 7.27077 12.136C7.25612 10.7298 7.26504 9.32364 7.26185 7.91748C7.25627 6.2242 7.78822 4.57383 8.77941 3.20925C9.7706 1.84466 11.1687 0.837944 12.7679 0.33725C17.3295 -1.09016 22.2421 2.18142 22.7025 6.98541C22.7936 7.9323 22.7299 8.89464 22.7343 9.8499C22.7375 10.6119 22.7343 11.3739 22.7343 12.136C22.7369 12.2416 22.7464 12.3459 22.7541 12.4889ZM10.511 12.4677C10.6065 12.4799 10.6479 12.4902 10.6893 12.4902C13.5313 12.4902 16.3736 12.4922 19.2165 12.496C19.4712 12.496 19.4782 12.3672 19.4782 12.174C19.475 10.9404 19.4782 9.7069 19.4782 8.47273C19.4782 8.06564 19.4992 7.65274 19.4432 7.24887C19.1082 4.84558 17.0003 3.18692 14.5396 3.3705C12.3336 3.53476 10.518 5.56637 10.5122 7.87948C10.5091 9.27404 10.5122 10.6686 10.5122 12.0664L10.511 12.4677ZM16.7073 25.3093C16.5373 24.1002 16.3807 22.9214 16.1979 21.7465C16.1559 21.474 16.2113 21.2924 16.4061 21.094C17.0258 20.464 17.1792 19.7007 16.8946 18.8698C16.7597 18.4878 16.513 18.1563 16.1873 17.9196C15.8616 17.6829 15.4723 17.5522 15.0713 17.5448C14.6711 17.5287 14.2753 17.6342 13.9348 17.8476C13.5943 18.061 13.3248 18.3726 13.1608 18.7423C12.8144 19.5255 12.9621 20.4653 13.5735 21.065C13.8047 21.2911 13.8499 21.5127 13.8034 21.8084C13.6951 22.4963 13.6015 23.1868 13.5092 23.8773C13.4455 24.3495 13.3958 24.8223 13.3379 25.3093H16.7073Z" fill="white"/>
                                </LockStyled>
                            </>
                        )}
                    </Floor>
                ))}
            </BuildingWrapper>
            <CommonModal isOpen={isShownInfo} isDarken btnText="Понятно" onClose={handleCloseInfo}>
                <p><Bold>Это главное меню.</Bold></p>
                <p>   
                    Здесь собраны все <Bold>4 недели игры:</Bold> какие-то уже открыты, а остальные появятся на своей неделе.
                </p>
            </CommonModal>
            <CommonModal isOpen={isClosedInfo} isDarken btnText="Понятно" onClose={() => setIsClosedInfo(false)}>
                <p><Bold>Эта неделя пока закрыта.</Bold></p>
                <p>   
                    Она откроется в своё время — <Bold>загляни позже!</Bold>
                </p>
            </CommonModal>
        </Wrapper>
    )
};