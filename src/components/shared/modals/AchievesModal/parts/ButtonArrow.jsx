export const ButtonArrow = ({ isDisabled, ...props }) => (
    <svg {...props} width="100%" height="100%" viewBox="0 0 111 115" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter={!isDisabled ? "url(#filter0_ddii_236_1561)" : ''}>
            <path d="M65.0849 77C66.4497 75.3182 67.8805 73.8636 69.3774 72.6364C70.8302 71.3636 72.3711 70.3182 74 69.5V66.5682C70.7421 64.8409 67.7704 62.3182 65.0849 59H60C60.4843 60.3182 61.0566 61.5682 61.717 62.75C62.3333 63.8864 62.9937 64.9773 63.6981 66.0227V70.0455C62.9937 71 62.3333 72.0682 61.717 73.25C61.0566 74.3864 60.4843 75.6364 60 77H65.0849Z" fill={isDisabled ? '#B2B7C5' : '#EF3124'} />
        </g>
        <defs>
            {
            //TODO: посмотреть что с тенями дурацкими
            }
            <filter id="filter0_ddii_2030_1225" x="0.8496" y="0.608" width="110" height="114" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="-1.8584" dy="-1.732" />
                <feGaussianBlur stdDeviation="6" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2030_1225" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="-11.1504" dy="-10.392" />
                <feGaussianBlur stdDeviation="24" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="effect1_dropShadow_2030_1225" result="effect2_dropShadow_2030_1225" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2030_1225" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="1.06858" dy="0.9959" />
                <feGaussianBlur stdDeviation="2.15" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="shape" result="effect3_innerShadow_2030_1225" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="1.99778" dy="1.8619" />
                <feGaussianBlur stdDeviation="4.3" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="effect3_innerShadow_2030_1225" result="effect4_innerShadow_2030_1225" />
            </filter>
        </defs>
    </svg>

)