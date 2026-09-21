export const PAYRUN_STATES = {
  DRAFT: 'draft',
  COMPUTED: 'computed',
  VALIDATED: 'validated',
  PAID: 'paid',
};

export const canTransition = (currentState, nextState) => {
  const transitions = {
    [PAYRUN_STATES.DRAFT]: [PAYRUN_STATES.COMPUTED],
    [PAYRUN_STATES.COMPUTED]: [PAYRUN_STATES.VALIDATED, PAYRUN_STATES.DRAFT],
    [PAYRUN_STATES.VALIDATED]: [PAYRUN_STATES.PAID, PAYRUN_STATES.COMPUTED],
    [PAYRUN_STATES.PAID]: [],
  };
  return (transitions[currentState] || []).includes(nextState);
};
