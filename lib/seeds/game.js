const PRINCESS = 8,
      COUNTESS = 7,
          KING = 6,
        PRINCE = 5,
      HANDMAID = 4,
         BARON = 3,
        PRIEST = 2,
         GUARD = 1;

module.exports = {
  playerOrder: [],
  players: {
  },
  cards: {
    deck: [
      ...Array(5).fill(GUARD),
      ...Array(2).fill(PRIEST),
      ...Array(2).fill(BARON),
      ...Array(2).fill(HANDMAID),
      ...Array(2).fill(PRINCE),
      KING,
      COUNTESS,
      PRINCESS
    ],
    played: [],
    excluded: null
  },
  open: true
};
