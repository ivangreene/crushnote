/*

  Rudimentary game engine for development purposes.
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

function gameEngine(state, move) {
  // Reject the move if it isn't the player's turn
  if (!state.players[move.player].active) return state;

  // If the card attempting to be played is not in the player's hand or the next card
  // in the deck (the "drawn" card), reject this move by returning the current state.
  if (move.card !== state.cards.deck[0] && move.card !== state.players[move.player].hand)
    return state;
  
  // Reject the move if the originating player has already been eliminated.
  if (state.players[move.player].eliminated) return state;

  // Reject the move if the selected player is protected by the Handmaid.
  if (move.chosenPlayer && state.players[move.chosenPlayer].discarded[0] === HANDMAID)
    return state;

  // Reject if attempting to play King or Prince and the other card in hand is a Countess
  if ((move.card === KING || move.card === PRINCE) && (state.cards.deck[0] === COUNTESS || state.players[move.player].hand === COUNTESS))
    return state;
  
  let newState = Object.assign({}, state); // Copy our state so we can safely mutate it.

  switch (move.card) {
    case PRINCESS: // Princess eliminates the player from the round
      newState.players[move.player].eliminated = true;
      break;
    case COUNTESS: // Countess has no effect
      break;
    case KING:
      // TODO: Implement trade logic
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
      break;     // of the selected player
    case GUARD: // If the guessed card is correct, the chosen player is eliminated.
      // Reject if the guessed card is > 8 or < 2
      if (move.guessedCard > 8 || move.guessedCard < 2) return state;
      if (newState.players[move.chosenPlayer].hand === move.guessedCard) {
        newState.players[move.chosenPlayer].eliminated = true;
      } // No effect if incorrect.
      break;
    default: // Reject if the card is not valid
      return state;
  }

  // Logic that will happen once we pass through the switch and everything is good.

  // Add the played card to the top of the player's discarded array
  newState.players[move.player].discarded.unshift(move.card);

  // Determine if the card was played from the hand or from the top of the deck
  (newState.players[move.player].hand === move.card)
    // If it was from the hand, their new hand comes from the top of the deck
    ? newState.players[move.player].hand = newState.cards.deck.shift()
    // Otherwise, get rid of the top of the deck anyway (it's already stored 
    // in their discarded array)
    : newState.cards.deck.shift();
  
  newState.success = true; // We won't bother sending this to the client,
                           // but it lets us check if the move was successful
                           // to determine if we should take the other actions
                           // associated with the move (e.g. showing the player
                           // the card of another player, etc.)
  return newState;

}
