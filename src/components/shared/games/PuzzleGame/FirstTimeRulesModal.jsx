import styled from "styled-components";
import { Bold, RedText } from "../../Spans";
import { Block } from "../../Block";
import { Title } from "../../Title";
import { CommonModal, Modal } from "../../modals";
import { useState } from "react";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-left: var(--spacing_x3);
    padding-right: var(--spacing_x3);
    font-size: var(--font_sm);
`;

const TitleStyled = styled(Title)`
    font-size: var(--font_lg);
`;

export const FirstTimeRulesModal = ({ onClose, isOpen }) => {
    const [part, setPart] = useState(0);

    const config = {
        0: () => (
            <>
                <p><Bold>Скоро начнётся представление</Bold>, но на сцене полный хаос — декорации и реквизит перепутались! Поможешь собрать их правильно, чтобы спектакль прошёл идеально?</p>
                <p>Собери картинку из кусочков пазла<Bold> за <RedText>3</RedText> минуты.</Bold></p>
            </>
        ),
        1: () => (
            <>
                <p>Перед тобой <Bold>кусочки сцены</Bold> спектакля. <Bold>Перетаскивай их</Bold> на место, чтобы собрать целую картинку.</p>
                <p>Каждый правильно установленный элемент фиксируется и приносит <Bold><RedText>+5</RedText> баллов.</Bold> в копилку!</p>
            </>
        ),
        2: () => (
            <>
                <p><Bold>Ошибиться не страшно,</Bold> кусочек можно поставить снова.</p>
                <p><Bold>Главное — успеть собрать пазл</Bold> за отведённое время,тогда получишь ещё <Bold><RedText>+15</RedText> баллов.</Bold>!</p>
            </>
        )
    }

    const handleNext = () => {
        if (part < 2) {
            setPart(prev => prev + 1);

            return;
        }

        onClose?.();
    };


    return (
        <CommonModal onClose={handleNext} isOpen={isOpen}>
            {config[part]()}
        </CommonModal>
    )
}