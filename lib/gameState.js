/*
  clean(gameState): takes a raw game state (from the DB or otherwise),
    returns a gameState that can be safely passed to clients without
    revealing details that would enable cheating.
*/

module.exports.clean = state => {
  let cleanState = JSON.parse(JSON.stringify(state));
  cleanState.cards.deck = [];
  delete cleanState.cards.excluded;
  for (var p = 0; p < cleanState.playerOrder.length; p++) {
    delete cleanState.players[cleanState.playerOrder[p]].hand;
  }
  return cleanState;
}
