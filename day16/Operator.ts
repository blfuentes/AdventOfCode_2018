import { CheckCase } from "./CheckCase";

export class Operator {
    addr(cCase: CheckCase) {
        let output = cCase.before[cCase.input[1]] + cCase.before[cCase.input[2]];
        return output == cCase.after[cCase.input[3]];
    }
    addi(cCase: CheckCase) {
        let output = cCase.before[cCase.input[1]] + cCase.input[2];
        return output == cCase.after[cCase.input[3]];
    }

    mulr(cCase: CheckCase) {
        let output = cCase.before[cCase.input[1]] * cCase.before[cCase.input[2]]
        return output == cCase.after[cCase.input[3]];
    }
    muli(cCase: CheckCase) {
        let output = cCase.before[cCase.input[1]] * cCase.input[2];
        return output == cCase.after[cCase.input[3]];
    }

    banr(cCase: CheckCase) {
        let output =   cCase.before[cCase.input[1]] & cCase.before[cCase.input[2]];
        return output == cCase.after[cCase.input[3]];
      }
      bani(cCase: CheckCase) {
          let output = cCase.before[cCase.input[1]] & cCase.input[2];
          return output == cCase.after[cCase.input[3]];
      }
  
      borr(cCase: CheckCase) {
          let output =   cCase.before[cCase.input[1]] | cCase.before[cCase.input[2]];
          return output == cCase.after[cCase.input[3]];
      }
      bori(cCase: CheckCase) {
          let output = cCase.before[cCase.input[1]] | cCase.input[2];
          return output == cCase.after[cCase.input[3]];
      }

    setr(cCase: CheckCase) {
        let output = cCase.before[cCase.input[1]];
        return output == cCase.after[cCase.input[3]];
    }
    seti(cCase: CheckCase) {
        let output = cCase.input[1];
        return output == cCase.after[cCase.input[3]];
    }

    gtir(cCase: CheckCase) {
        let output = 0;
        if (cCase.input[1] > cCase.before[cCase.input[2]]) {
            output = 1;
        }
        return output == cCase.after[cCase.input[3]];
    }
    gtri(cCase: CheckCase) {
        let output = 0;
        if (cCase.before[cCase.input[1]] > cCase.input[2]) {
            output = 1;
        }
        return output == cCase.after[cCase.input[3]];
    }
    gtrr(cCase: CheckCase) {
        let output = 0;
        if (cCase.before[cCase.input[1]] > cCase.before[cCase.input[2]]) {
            output = 1;
        }
        return output == cCase.after[cCase.input[3]];
    }

    eqir(cCase: CheckCase) {
        let output = 0;
        if (cCase.input[1] == cCase.before[cCase.input[2]]) {
            output = 1;
        }
        return output == cCase.after[cCase.input[3]];
    }
    eqri(cCase: CheckCase) {
        let output = 0;
        if (cCase.before[cCase.input[1]] == cCase.input[2]) {
            output = 1;
        }
        return output == cCase.after[cCase.input[3]];
    }
    eqrr(cCase: CheckCase) {
        let output = 0;
        if (cCase.before[cCase.input[1]] == cCase.before[cCase.input[2]]) {
            output = 1;
        }
        return output == cCase.after[cCase.input[3]];
    }
}