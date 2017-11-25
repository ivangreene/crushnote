const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const move = require('../lib/engine/move');

let state;

const PRINCESS = 8,
      COUNTESS = 7,
          KING = 6,
        PRINCE = 5,
      HANDMAID = 4,
         BARON = 3,
        PRIEST = 2,
         GUARD = 1;

beforeEach(function() {
  state = {
    playerOrder: ['foo', 'bar', 'baz'],
    players: {
      foo: {
        eliminated: false,
        active: true,
        hand: COUNTESS,
        discarded: []
      },
      bar: {
        eliminated: false,
        active: false,
        hand: COUNTESS,
        discarded: []
      },
      baz: {
        eliminated: false,
        active: false,
        hand: COUNTESS,
        discarded: []
      }
    },
    cards: {
      deck: [ BARON, PRIEST, GUARD, GUARD, GUARD, BARON, HANDMAID, GUARD, COUNTESS, KING, HANDMAID, GUARD ],
      played: [],
      excluded: PRIEST
    },
    open: false,
    completed: false
  };
});

describe('The move engine', function () {

  describe(`should reject a move`, function () {
    it(`by a player who isn't active`, function () {
      return expect(move(state, { player: 'bar', card: COUNTESS })).to.eventually.be.rejected;
    });

    it(`by a player who is eliminated`, function () {
      state.players.foo.eliminated = true;
      return expect(move(state, { player: 'foo', card: COUNTESS })).to.eventually.be.rejected;
    });

    it(`when the player doesn't have the card in their hand`, function () {
      return expect(move(state, { player: 'foo', card: PRINCESS })).to.eventually.be.rejected;
    });
  });

  describe(`should resolve a move`, function () {
    it(`with the next state`, function () {
      return expect(move(state, { player: 'foo', card: COUNTESS })).to.eventually.have.property('players');
    });
  });
  
  describe(`after a move`, function () {
    it(`should eliminate a player when the Princess is played`, function () {
      state.players.foo.hand = PRINCESS;
      expect(state).to.nested.include({ 'players.foo.eliminated': false });
      return expect(move(state, { player: 'foo', card: PRINCESS })).to.eventually.nested.include({ 'players.foo.eliminated': true });
    });

    it(`should make the next player active and the last player inactive`, function () {
      return expect(move(state, { player: 'foo', card: COUNTESS })).to.eventually.nested.include({'players.bar.active': true, 'players.foo.active': false});
    });

    it(`should wrap to the first player when we are at the last player`, function () {
      return expect(move(state, { player: 'foo', card: COUNTESS })
        .then(nextState => move(nextState, { player: 'bar', card: COUNTESS }))
        .then(nextState => move(nextState, { player: 'baz', card: COUNTESS }))
      ).to.eventually.nested.include({'players.foo.active': true});
    });
  });


});
