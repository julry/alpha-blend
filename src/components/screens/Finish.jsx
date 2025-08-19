// import styled from "styled-components";
// import logo from '../../assets/images/logo.svg';
// import face from '../../assets/images/face.svg';
// import { useSizeRatio } from "../../hooks/useSizeRatio";
// import { Button } from "../shared/Button";
// import { useProgress } from "../../contexts/ProgressContext";
// import { SCREENS } from "../../constants/screens";

// const Wrapper = styled.div`
//     width: 100%;
//     height: 100%;
//     padding: var(--spacing_x6) 0 0;
//     display: flex;
//     flex-direction: column;
// `;

// const Logo = styled.div`
//     position: relative;
//     z-index: 1;
//     width: ${({$ratio}) => $ratio * 146}px;
//     height: ${({$ratio}) => $ratio * 43}px;
//     margin-left: var(--spacing_x6);
//     background: url(${logo}) no-repeat 0 0 / cover;
//     flex-shrink: 0;
// `;

// const Face = styled.div`
//     position: relative;
//     z-index: 2;
//     width: 100%;
//     margin-top: -1px;
//     height: 90.9vw;
//     background: url(${face}) no-repeat 0 0 / cover;
//     flex-shrink: 0;

//     @media screen and (min-width: 450px) {
//         max-height: ${({$ratio}) => $ratio * 341}px;
//     }
// `;

// const Content = styled.div`
//     padding: 0 var(--spacing_x4) var(--spacing_x4);
//     display: flex;
//     flex-direction: column;
//     flex-grow: 1;
//     background: var(--color-white);
//     color: var(--color-white-text);
// `;

// const TextBlock = styled.div`
//     padding: var(--spacing_x4);
//     padding-bottom: 0;
//     margin-bottom: ${({$ratio}) => $ratio * 10}px;
//     font-size: var(--font_sm);
//     line-height: 111%;

//     @media screen and (min-width: 450px) and (max-height: 760px){
//         padding-top: ${({$ratio}) => $ratio * 13}px;
//     }
// `;

// const ButtonWrapper = styled.div`
//     margin-top: auto;

//     & button + button {
//         margin-top: var(--spacing_x3);
//     }

//     @media screen and (min-width: 450px) and (max-height: 760px){
//         & button + button {
//             margin-top: var(--spacing_x2);
//         }
//     }
// `;

// export const Finish = () => {
//     const {next, user} = useProgress();
//     const ratio = useSizeRatio();
//     return (
//         <Wrapper>
//             <Logo $ratio={ratio}/>
//             <Face $ratio={ratio}/>
//             <Content>
//                 <TextBlock $ratio={ratio}>
//                     <p>
//                         <b>
//                             Ты победил страшный лес и нашёл дорогу к Альфа-сити. Теперь тебя ждёт только успешная карьера!
//                         </b>
//                     </p>
//                     <br />
//                     <p>
//                         Проверяй почту и <a href={`https://t.me/Alfajourney_bot?start=email_${btoa(user.email)}`} target={"_blank"} rel="noreferrer">tg-бота</a> — возможно, ты станешь обладателем{' '}
//                         главного приза. 
//                         С результатами мы вернёмся на следующей неделе. 
//                         А пока можешь перечитать собранные факты про Альфа-Банк.
//                     </p>
//                 </TextBlock>
//                 <ButtonWrapper>
//                     <Button color="red" onClick={() => next(SCREENS.LIBRARY)}>В библиотеку</Button>
//                 </ButtonWrapper>
//             </Content>
//         </Wrapper>
//     )
// };
