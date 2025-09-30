import batteryP from '../../../../assets/images/moles/battery-p.png';
import batteryN from '../../../../assets/images/moles/battery-n.png';
import bulbP from '../../../../assets/images/moles/bulb-p.png';
import bulbN from '../../../../assets/images/moles/bulb-n.png';
import cupP from '../../../../assets/images/moles/cup-p.png';
import cupN from '../../../../assets/images/moles/cup-n.png';
import diary from '../../../../assets/images/moles/diary.png';
import letters from '../../../../assets/images/moles/letters.png';
import music from '../../../../assets/images/moles/music.png';
import sport from '../../../../assets/images/moles/sport.png';
import clock from '../../../../assets/images/moles/clock.png';

export const MAX_TIME = 30;

export const positiveElements = [
    {
        id: 'bulb-p',
        isPositive: true,
        img: bulbP,
    },
    {
        id: 'cup-p',
        isPositive: true,
        img: cupP,
    },
    {
        id: 'battery-p',
        isPositive: true,
        img: batteryP,
    },
    {
        id: 'sport-p',
        isPositive: true,
        img: sport,
    },
    {
        id: 'diary-p',
        isPositive: true,
        img: diary,
    },
    {
        id: 'music-p',
        isPositive: true,
        img: music,
    },
];

export const negativeElements = [
    {
        id: 'cup-n',
        isPositive: false,
        img: cupN,
    },
    {
        id: 'letters-n',
        isPositive: false,
        img: letters,
    },
    {
        id: 'battery-n',
        isPositive: false,
        img: batteryN,
    },
    {
        id: 'clock-n',
        isPositive: false,
        img: clock
    },
    {
        id: 'bulb-n',
        isPositive: false,
        img: bulbN
    }
]