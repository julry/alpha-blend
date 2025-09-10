import styled from "styled-components";
import { IconButton } from "./Button";

const Header = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

export const BackHeader = ({ className, onBack, onInfoClick, children}) => (
    <Header className={className}>
        <IconButton onClick={onBack} icon={{ width: 24, height: 16 }}>
            <svg viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.1 16C6.86 14.505 5.56 13.2121 4.2 12.1212C2.88 10.9899 1.48 10.0606 0 9.33333V6.72727C2.96 5.19192 5.66 2.9495 8.1 0H12.72C12.28 1.17172 11.76 2.28283 11.16 3.33333C10.6 4.34343 10 5.31313 9.36 6.24242V9.81818C10 10.6667 10.6 11.6162 11.16 12.6667C11.76 13.6768 12.28 14.7879 12.72 16H8.1ZM9 10.4848L9.06 5.51515H24V10.4848H9Z" fill="white" />
            </svg>
        </IconButton>
        {children}
        <IconButton onClick={onInfoClick} icon={{ width: 16, height: 22 }}>
            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.568 14.3213V14.6565H3.36V13.1634C3.36 11.1219 3.84 10.3601 6.144 9.14127L8.256 8.07479C9.184 7.61773 9.728 7.13019 9.728 6.30748C9.728 5.33241 9.056 4.81441 7.936 4.81441C6.752 4.81441 6.112 5.48476 6.112 6.61219V7.31302H0V6.15512C0 2.49862 2.848 0 7.936 0C13.184 0 16 2.28532 16 6.33795C16 9.41551 14.592 10.9391 11.52 12.4931L10.272 13.133C9.728 13.4072 9.568 13.7119 9.568 14.3213ZM2.912 22V16.1496H10.016V22H2.912Z" fill="white" />
            </svg>
        </IconButton>
    </Header>
)