import { negativeElements, positiveElements } from "./constants";

export function getElements(probabilities = { p1: 0.65, p2: 0.35 }) {
  const sum = probabilities.p1 + probabilities.p2;
  const normalized = {
    p1: probabilities.p1 / sum,
    p2: probabilities.p2 / sum,
  };

  const rand = Math.random();
    
    if (rand < normalized.p2) {
      return negativeElements;
    } else {
      return positiveElements;
    }
}