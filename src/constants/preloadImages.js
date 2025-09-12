import planning from '../assets/images/planner/plan.png';
import breakfast from '../assets/images/planner/break.png';
import music from '../assets/images/planner/music.png';
import running from '../assets/images/planner/running.png';
import job from '../assets/images/planner/job.png';
import study from '../assets/images/planner/study.png';
import phone from '../assets/images/planner/phone.png';
import med from '../assets/images/planner/meditation.png';
import relax from '../assets/images/planner/relax.png';
import cleaning from '../assets/images/planner/cleaning.png';
import diary from '../assets/images/planner/dairy.png';
import brain from '../assets/images/planner/brainstorm.png';
import selfImprov from '../assets/images/planner/selfImprov.png';
import smoothie from '../assets/images/planner/smoothie.png';
import guitar from '../assets/images/planner/guitar.png';
import affirm from '../assets/images/planner/affirmation.png';
import snack from '../assets/images/planner/snack.png';
import tasks from '../assets/images/planner/tasks.png';
import freelance from '../assets/images/planner/freelance.png';
import meeting from '../assets/images/planner/meeting.png';
import art from '../assets/images/planner/art.png';
import sport from '../assets/images/planner/sport.png';
import call from '../assets/images/planner/call.png';
import hackL from '../assets/images/planner/hack_lap.png';
import hack from '../assets/images/planner/hack.png';
import plants from '../assets/images/planner/plants.png';
import spa from '../assets/images/planner/spa.png';
import travel from '../assets/images/planner/travel.png';
import bicycle from '../assets/images/planner/bicycle.png';
import doctor from '../assets/images/planner/doctor.png';
import match from '../assets/images/planner/match.png';
import runTrain from '../assets/images/planner/runTrain.png';
import shopping from '../assets/images/planner/shopping.png';

import ananas from '../assets/images/ingridients/ananas.png';
import apple from '../assets/images/ingridients/apple.png';
import banana from '../assets/images/ingridients/banana.png';
import blackberry from '../assets/images/ingridients/blueberry.png';
import coconut from '../assets/images/ingridients/coconut.png';
import ice from '../assets/images/ingridients/ice.png';
import lemon from '../assets/images/ingridients/lemon.png';
import matcha from '../assets/images/ingridients/matcha.png';
import mint from '../assets/images/ingridients/mint.png';
import orange from '../assets/images/ingridients/orange.png';
import pear from '../assets/images/ingridients/pear.png';
import strawberry from '../assets/images/ingridients/strawberry.png';

import girl0 from '../assets/images/blender/girl0.png';
import girl1 from '../assets/images/blender/girl1.png';
import man0 from '../assets/images/blender/man0.png';
import blender from '../assets/images/blender/blender.png';

import collegue from '../assets/images/collegue.png';
import backLobby from '../assets/images/backLobby.png';
import blenderBg from '../assets/images/blenderBg.png';
import building from '../assets/images/building.png';
import lobbyBg from '../assets/images/lobbyBg.png';
import table from '../assets/images/table.png';

import drink0 from '../assets/images/unopened/drink0.png';
import drink1 from '../assets/images/unopened/drink1.png';
import drink2 from '../assets/images/unopened/drink2.png';
import drink3 from '../assets/images/unopened/drink3.png';
import drink4 from '../assets/images/unopened/drink4.png';
import drink5 from '../assets/images/unopened/drink5.png';
import drink6 from '../assets/images/unopened/drink6.png';
import drink7 from '../assets/images/unopened/drink7.png';
import drink8 from '../assets/images/unopened/drink8.png';
import drink9 from '../assets/images/unopened/drink9.png';
import drink10 from '../assets/images/unopened/drink10.png';
import drink11 from '../assets/images/unopened/drink11.png';

import drink0_opened from '../assets/images/opened/drink0_opened.png';
import drink1_opened from '../assets/images/opened/drink1_opened.png';
import drink2_opened from '../assets/images/opened/drink2_opened.png';
import drink3_opened from '../assets/images/opened/drink3_opened.png';
import drink4_opened from '../assets/images/opened/drink4_opened.png';
import drink5_opened from '../assets/images/opened/drink5_opened.png';
import drink6_opened from '../assets/images/opened/drink6_opened.png';
import drink7_opened from '../assets/images/opened/drink7_opened.png';
import drink8_opened from '../assets/images/opened/drink8_opened.png';
import drink9_opened from '../assets/images/opened/drink9_opened.png';
import drink10_opened from '../assets/images/opened/drink10_opened.png';
import drink11_opened from '../assets/images/opened/drink11_opened.png';

export const initialImages = [
    collegue, backLobby, blenderBg, building, lobbyBg,
    drink0, drink1, drink2, drink3, drink4, drink5, drink6,
    drink7, drink8, drink9, drink10, drink11, drink0_opened, drink1_opened, 
    drink2_opened, drink3_opened, drink4_opened, drink5_opened, drink6_opened,
    drink7_opened, drink8_opened, drink9_opened, drink10_opened, drink11_opened
];

export const commonImages = [
    ananas, apple, banana, blackberry, coconut, ice, lemon, mint, orange, strawberry,
    hack, hackL, plants, spa, travel, call, sport, art, meeting, planning, breakfast,
    music, running, job, study, phone, med, relax, cleaning, diary, brain, selfImprov,
    smoothie, guitar, affirm, snack, tasks, freelance, girl0, girl1, man0, blender,
    table
];

export const week1Images = [...commonImages];
export const week2Images = [...commonImages, bicycle, doctor, match, runTrain, shopping];
export const week3Images = [...commonImages, matcha, pear];
export const week4Images = [...commonImages, matcha, pear];
