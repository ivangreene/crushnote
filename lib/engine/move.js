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
  move.card = parseInt(move.card);
  move.guessedCard = parseInt(move.guessedCard);
  return new Promise((resolve, reject) => {
    // Reject if the game hasn't started yet
    if (state.open) return reject('Game hasn\'t started.');
    if (state.completed) return reject('Game has finished.');

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
      case KING: // Active player and chosen player swap hands
        (newState.players[move.player].hand === move.card)
          ? newState.players[move.chosenPlayer].hand = newState.cards.deck[0]
          : newState.players[move.chosenPlayer].hand = state.players[move.player].hand;

        newState.cards.deck.shift();

        newState.players[move.player].hand = state.players[move.chosenPlayer].hand;

        swapped = true;

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
          newState.players[move.chosenPlayer].hand = newState.cards.deck.splice(1, 1)[0];
        break;
      case HANDMAID: // No effect other than protecting the player
        break;
      case BARON: // Compare the cards of the originating player and selected player
                  // and eliminate the one with the lower card
        // Originating and selected player must be different
        let opponents = [];
        let ourCard, theirCard;
        for (let i = 0; i < newState.players.order.length; i++) {
          const id = newState.players.order[i];
          if (id !== move.player) opponents.push(id);
        }
        if (newState.players[move.player] === newState.players[move.chosenPlayer]) {
          if (newState.players.order.length < 4
            && newState.players[id[0]].discarded[0] === 4
            && newState.players[id[1]].discarded[0] === 4) {
            ourCard = 0;
            theirCard = 0;
            console.log(`Baron played while all opponents protected by HANDMAID`);
          } else reject('Invalid target.');
        } else {
          // First we need to determine if the baron is being played from the deck
          // or from the hand of the originating player
          ourCard =
          (newState.players[move.player].hand === BARON)
            ? newState.cards.deck[0]
            : newState.players[move.player].hand;

          theirCard = newState.players[move.chosenPlayer].hand;

          if (ourCard > theirCard) {
            newState.players[move.chosenPlayer].eliminated = true;
          } else if (theirCard > ourCard) {
            newState.players[move.player].eliminated = true;
          }
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

    let toSplice = [];

    for (let p = 0; p < newState.players.order.length; p++) {
      if (newState.players[newState.players.order[p]].eliminated) {
        toSplice.push(p);
      }
    }

    for (let s = 0; s < toSplice.length; s++) {
      newState.players.order.splice(toSplice[s], 1);
    }

    // Switch the next player to active
    newState.players[move.player].active = false;
    let nextPlayer = newState.players.order.indexOf(move.player.toString()) + 1;
    // Wrap around if we are at the last player in the order
    if (nextPlayer === newState.players.order.length)
      nextPlayer = 0;
    newState.players[newState.players.order[nextPlayer]].active = true;

    let roundComplete = false;
    if (newState.roundWinner) newState.roundWinner = {id: null, name: null};

    if (newState.players.order.length === 1) {
      newState.players[newState.players.order[0]].hearts++;
      roundComplete = true;
      // empty all player's discard piles
      // for (let key in newState.players) {
      //   newState.players[key].discard = [];
      // }
      // Send the winning card forward to display to all players in the game
      newState.roundWinner = {
        card: newState.players[newState.players.order[0]].hand,
        id: newState.players.order[0]
      };
    } else if (!newState.cards.deck.length) {
      // Compare the remaining player's hands
      let greatest = newState.players.order[0];
      for (let i = 0; i < newState.players.order.length; i++) {
        if (newState.players[greatest].hand < newState.players[newState.players.order[i]].hand) {
          greatest = newState.players.order[i];
        }
      }
      newState.players[greatest].hearts++;
      roundComplete = true;
      // empty all player's discard piles
      // for (let key in newState.players) {
      //   newState.players[key].discard = [];
      // }
      // Send the winning card forward to display to all players in the game
      newState.roundWinner = {
        card: newState.players[greatest].hand,
        id: greatest
      };
    }

    // if (newState.roundWinner) {
    //   console.log(`engine/move.js round winner is:`, newState.roundWinner);
    // }

    resolve([newState, showHand, roundComplete]);

  });
}

module.exports = gameEngine;
