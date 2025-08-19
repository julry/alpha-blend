import { useState } from "react";
import styled from "styled-components";
import { uid } from "uid";
import { useProgress } from "../../contexts/ProgressContext";
import { faculties, universities } from "../../constants/universities";
import windowPic from '../../assets/images/window.png';
import { Button } from "../shared/Button";
import { Select } from "../shared/Select";
import { FlexWrapper } from "../shared/ContentWrapper";
import { Block } from "../shared/Block";
import { Title } from "../shared/Title";

const Wrapper = styled(FlexWrapper)`
    padding-top: var(--spacing_x10);
    background: url(${windowPic}) no-repeat 0 0 / cover;
`;

const Content = styled(FlexWrapper)`
    z-index: 2;
    padding: 0;
`;

const SelectStyled = styled(Select)`
    margin-top: var(--spacing_x2);
`;

const Blur = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(36, 38, 50, 0.4);
    backdrop-filter: blur(4px);
`;

export const Registration1 = () => {
    const { next, setUserInfo } = useProgress();
    const [univ, setUniv] = useState({});
    const [fac, setFac] = useState('');

    const handleClick = async () => {
        const id = uid(7);
        const refId = new URLSearchParams(window?.location?.search).get('refId');

        setUserInfo({ university: `${univ.name} ${fac}`, isVip: !!fac && fac !== 'Другое', refId, id });
        next();
    }

    const handlePickUniversity = (id, name) => {
        if (univ?.id === id) return;

        setUniv({ id, name });
        setFac('');
    }

    const btnDisabled = !univ?.id || (univ.id !== 'other' && !fac);

    return (
        <Wrapper>
            <Blur />
            <Content>
                <Block>
                    <Title>РЕГИСТРАЦИЯ</Title>
                    <Select value={univ.name} options={universities} onChoose={handlePickUniversity} placeholder="Вуз" />
                    <SelectStyled
                        value={fac}
                        options={faculties.filter(({ university }) => university === univ.id || university === 'all')}
                        onChoose={(_, name) => setFac(name)}
                        placeholder="Факультет"
                        zIndex={19}
                    />
                </Block>
                <Button onClick={handleClick} disabled={btnDisabled}>Далее</Button>
            </Content>

        </Wrapper>
    )
}