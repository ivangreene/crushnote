/*

  Move engine. Takes in a game state and a move descriptor.
  Promise based: resolves valid moves, rejects invalid moves.
  `state` and `move` should be objects as described in the Wiki:
  https://github.com/ivangreene/crushnote/wiki/Game-State
  https://github.com/ivangreene/crushnote/wiki/Move-Object

*/

const PRINCESS = 8,
      COUNTESS = 7,
          KING = 6,
        PRINCE = 5,
      HANDMAID = 4,
         BARON = 3,
        PRIEST = 2,
         GUARD = 1;

const requiresTarget = [KING, PRINCE, BARON, PRIEST, GUARD];
const requiresGuess = [GUARD];

function gameEngine(state, move) {
  return new Promise((resolve, reject) => {
    // Reject if the game hasn't started yet
    if (state.open) return reject('Game hasn\'t started.');

    // Reject if this player isn't a participant in this game
    if (!state.players[move.player]) return reject('Player isn\'t a participant.');

    // Reject the move if it isn't the player's turn, or if this player has been eliminated
    if (!state.players[move.player].active || state.players[move.player].eliminated)
      return reject('Player is eliminated or out of turn.');

    // If the card attempting to be played is not in the player's hand or the next card
    // in the deck (the "drawn" card), reject this move.
    if (move.card !== state.cards.deck[0] && move.card !== state.players[move.player].hand)
      return reject('The card is not in the player\'s hand.');

    let allPlayersProtected = (function() {
      for (let player in state.players.order) {
        if (state.players[state.players.order[player]].discarded[0] !== HANDMAID)
          return false;
      }
      return true;
    }());
    // Reject the move if the selected player is protected by the Handmaid,
    // or if the selected player has been eliminated.
    if (!allPlayersProtected && move.chosenPlayer &&
      (state.players[move.chosenPlayer].discarded[0] === HANDMAID
        || state.players[move.chosenPlayer].eliminated))
      return reject('The selected player is protected or eliminated.');

    // Reject if attempting to play King or Prince and the other card in hand is a Countess
    if ((move.card === KING || move.card === PRINCE) && (state.cards.deck[0] === COUNTESS || state.players[move.player].hand === COUNTESS))
      return reject('If you have a Countess, it must be played if your other card is a King or Prince.');

    // Reject if the card requires a target and none is chosen
    // If HANDMAID protects all opponents, playing a card without choosing a target is valid
    if (requiresTarget.indexOf(move.card) > -1 && !move.chosenPlayer)
        return reject('No player chosen as target.');

    // Reject if the card requires a guessed card (only Guard)
    // If HANDMAID protects all opponents, playing a card without guessing a value is valid
    if (requiresGuess.indexOf(move.card) > -1 && !move.guessedCard)
      return reject('No card guessed.');
    // Force player to target self with PRINCE if all opponents are protected by HANDMAID

    let newState = JSON.parse(JSON.stringify(state)); // Copy our state so we can safely mutate it.

    let swapped = false;
    let showHand = undefined;

    switch (move.card) {
      case PRINCESS: // Princess eliminates the player from the round
        newState.players[move.player].eliminated = true;
        break;
      case COUNTESS: // Countess has no effect
        break;
      case KING:
        // TODO: Implement trade logic

        (newState.players[move.player].hand === move.card)
          ? newState.players[move.chosenPlayer].hand = newState.cards.deck[0]
          : newState.players[move.chosenPlayer].hand = state.players[move.player].hand;

        newState.cards.deck.shift();

        newState.players[move.player].hand = state.players[move.chosenPlayer].hand;

        swapped = true;

        // Remove card from chosen player's hand
        // newState.players[move.chosenPlayer].hand is a NUMBER not an ARRAY
        // newState.players[move.chosenPlayer].hand.unshift(newState.players[move.player].active.hand);
        // Add removed card to active player's hand at end of hand array (new card at end)
        // Remove first card in array (original card) from active player's hand
        // Add removed card to chosen player's hand;
        // newState.players[move.chosenPlayer].hand = /*current player's hand*/
        // newState.players[move.player].hand = /*chosen player's hand*/

        break;
      case PRINCE: // Remove a card from the chosen player's hand and force them
                  // to draw a new one.
        newState.cards.played.unshift(newState.players[move.chosenPlayer].hand);
        newState.players[move.chosenPlayer].discarded.push(newState.players[move.chosenPlayer].hand);
        // Eliminate this player if we forced them to discard the Princess
        if (newState.players[move.chosenPlayer].hand === PRINCESS)
          newState.players[move.chosenPlayer].eliminated = true;
        // Otherwise, let them draw a new card
        else
          newState.players[move.chosenPlayer].hand = newState.cards.deck.shift();
        break;
      case HANDMAID: // No effect other than protecting the player
        break;
      case BARON: // Compare the cards of the originating player and selected player
                  // and eliminate the one with the lower card
        // First we need to determine if the baron is being played from the deck
        // or from the hand of the originating player
        let ourCard =
        (newState.players[move.player].hand === BARON)
          ? newState.cards.deck[0]
          : newState.players[move.player].hand;

        let theirCard = newState.players[move.chosenPlayer].hand;

        if (ourCard > theirCard) {
          newState.players[move.chosenPlayer].eliminated = true;
        } else if (theirCard > ourCard) {
          newState.players[move.player].eliminated = true;
        }
        // No effect if they are equal.
        break;
      case PRIEST: // No effect except for showing the originating player the card
        showHand = { to: move.player, from: move.chosenPlayer };
        break;     // of the selected player
      case GUARD: // If the guessed card is correct, the chosen player is eliminated.
        // Reject if the guessed card is > 8 or < 2
        if (move.guessedCard > 8 || move.guessedCard < 2)
          return reject('Invalid card guessed.');
        if (newState.players[move.chosenPlayer].hand === move.guessedCard) {
          newState.players[move.chosenPlayer].eliminated = true;
        } // No effect if incorrect.
        break;
      default: // Reject if the card is not valid
        return reject('Invalid card.');
    }

    // Logic that will happen once we pass through the switch and everything is good.

    // Add the played card to the top of the player's discarded array
    newState.cards.played.unshift(move.card);
    newState.players[move.player].discarded.unshift(move.card);

    if (!swapped) {
      // Determine if the card was played from the hand or from the top of the deck
      (newState.players[move.player].hand === move.card)
        // If it was from the hand, their new hand comes from the top of the deck
        ? newState.players[move.player].hand = newState.cards.deck.shift()
        // Otherwise, get rid of the top of the deck anyway (it's already stored
        // in their discarded array)
        : newState.cards.deck.shift();
    }
    // Switch the next player to active
    newState.players[move.player].active = false;
    let nextPlayer = newState.players.order.indexOf(move.player.toString()) + 1;
    // Wrap around if we are at the last player in the order
    if (nextPlayer === newState.players.order.length)
      nextPlayer = 0;
    newState.players[newState.players.order[nextPlayer]].active = true;

    let toSplice = [];

    for (let p = 0; p < newState.players.order.length; p++) {
      if (newState.players[newState.players.order[p]].eliminated) {
        toSplice.push(p);
      }
    }

    for (let s = 0; s < toSplice.length; s++) {
      newState.players.order.splice(toSplice[s], 1);
    }

    if (newState.players.order.length === 1)
      newState.completed = true;

    resolve([newState, showHand]);

  });
}

module.exports = gameEngine;
