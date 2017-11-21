module.exports.clean = state => {
  let cleanState = JSON.parse(JSON.stringify(state));
  cleanState.cards.deck = [];
  cleanState.cards.excluded = null;
  for (var p = 0; p < cleanState.playerOrder.length; p++) {
    cleanState.players[cleanState.playerOrder[p]].hand = null;
  }
  return cleanState;
}
