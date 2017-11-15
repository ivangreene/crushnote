const PRINCESS = 8,
      COUNTESS = 7,
          KING = 6,
        PRINCE = 5,
      HANDMAID = 4,
         BARON = 3,
        PRIEST = 2,
         GUARD = 1;

module.exports = {
  playerOrder: ['abc', 'def'],
  players: {
    'abc': {
      eliminated: false,
      active: true,
      hand: HANDMAID,
      discarded: []
    },
    'def': {
      eliminated: false,
      active: false,
      hand: KING,
      discarded: []
    },

  },
  cards: {
    deck: [PRINCE, BARON, GUARD, HANDMAID, KING],
    played: [BARON, GUARD, PRIEST],
    excluded: GUARD
  }
};
