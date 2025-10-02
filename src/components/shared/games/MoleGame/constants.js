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
import { DAYS } from '../../../../constants/days';

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
];

export const DAY_TO_LEVEL_SETTING = {
    [DAYS.Monday]: {
        1: { appearTime: 500, speed: 2.8 },
        2: { appearTime: 450, speed: 3.0 },
        3: { appearTime: 400, speed: 3.2 },
        4: { appearTime: 400, speed: 3.6 },
        5: { appearTime: 450, speed: 3.8 },
        6: { appearTime: 300, speed: 4.0 }
    },
    [DAYS.Wednesday]: {
        1: { appearTime: 400, speed: 3.0 },
        2: { appearTime: 350, speed: 3.2 },
        3: { appearTime: 330, speed: 3.4 },
        4: { appearTime: 320, speed: 3.6 },
        5: { appearTime: 300, speed: 3.8 },
        6: { appearTime: 290, speed: 4.0 }
    },
    [DAYS.Friday]: {
        1: { appearTime: 360, speed: 3.2 },
        2: { appearTime: 340, speed: 3.4 },
        3: { appearTime: 320, speed: 3.6 },
        4: { appearTime: 300, speed: 3.8 },
        5: { appearTime: 290, speed: 4.0 },
        6: { appearTime: 280, speed: 4.2 }
    },
}