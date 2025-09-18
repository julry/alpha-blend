import { drinks } from "../../../../constants/drinks";
import { persons } from "./constants";

function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function generateIngridientsAmount(probabilities = { p1: 0.8, p2: 0.2 }) {
  const sum = probabilities.p1 + probabilities.p2;
  const normalized = {
    p1: probabilities.p1 / sum,
    p2: probabilities.p2 / sum,
  };

  const rand = Math.random();
    
    if (rand < normalized.p1) {
      return 2;
    } else {
      return 3;
    }
}

export function generatePeopleAmount(probabilities = { p1: 0.5, p2: 0.3, p3: 0.2 }) {
  const rand = Math.random();
  let cumulativeProbability = 0;
  const options = [1, 2, 3];
  const probabilitiesArr = Object.values(probabilities);
    
  for (let i = 0; i < options.length; i++) {
        cumulativeProbability += probabilitiesArr[i];
        if (rand < cumulativeProbability) {
            return options[i];
        }
    }

    return options[options.length - 1];
}

// Генерация номеров очереди с группировкой
function generateQueueGroups(totalPeople, maxSize) {
    const groups = [];
    let remaining = totalPeople;

    while (remaining > 0) {
        let groupSize = remaining !== totalPeople ? Math.min(generatePeopleAmount(maxSize), remaining) : 1;
        if (groupSize > 1 && groups[groups.length - 1] === groupSize) {
            groupSize = groupSize - 1;
        }
        groups.push(groupSize);
        remaining -= groupSize;
    }

    return groups;
}

// Генерация назначений с учетом ограничений
export function getPersonsArray({ isBased, peopleAmount, maxSize, ingridientsProbability }) {
    const playedDrinks = isBased ? drinks.filter(({ isBased }) => isBased) : drinks;

    const assignments = [];
    let availableDrinks = shuffleArray(playedDrinks);
    let drinkIndex = 0;

    // 1. Создаем группы очереди
    const queueGroups = generateQueueGroups(peopleAmount, maxSize);
    let queueNumber = 1;

    // 2. Подготовка типов (минимум 2 каждого)
    let typePool = [];
    persons.forEach(person => {
        typePool.push(person, person); // По 2 каждого типа
    });

    // 3. Добавляем оставшиеся 8 случайных типов (14 - 6)
    for (let i = 0; i < peopleAmount - 6; i++) {
        typePool.push(persons[Math.floor(Math.random() * persons.length)]);
    }
    typePool = shuffleArray(typePool);

    // 4. Распределяем по группам
    let typeIndex = 0;

    for (const groupSize of queueGroups) {
        const groupTypes = new Set(); // Типы в текущей группе

        for (let i = 0; i < groupSize; i++) {
            // Находим подходящий тип (который еще не использован в этой группе)
            let suitableTypeFound = false;
            let attempts = 0;
            let selectedType;

            while (!suitableTypeFound && attempts < 100) {
                selectedType = typePool[typeIndex % typePool.length];
                if (!groupTypes.has(selectedType)) {
                    suitableTypeFound = true;
                    groupTypes.add(selectedType);
                }
                typeIndex++;
                attempts++;
            }

            // Если не нашли подходящий тип (маловероятно), берем любой
            if (!suitableTypeFound) {
                selectedType = typePool[typeIndex % typePool.length];
                typeIndex++;
            }

            // Назначаем напиток (с циклическим повторением)
            if (drinkIndex >= availableDrinks.length) {
                availableDrinks = shuffleArray(availableDrinks);
                drinkIndex = 0;
            }

            const ingridientsAmount = generateIngridientsAmount(ingridientsProbability);
            const ingridients = availableDrinks[drinkIndex].recipe.slice(0, ingridientsAmount);

            assignments.push({
                queue: queueNumber,
                drink: availableDrinks[drinkIndex].id,
                person: selectedType.id,
                ingridients
            });

            drinkIndex++;
        }

        queueNumber++;
    }

    return {
        friends: assignments,
        maxQueue: queueNumber - 1,
    };
};
