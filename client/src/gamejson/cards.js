module.exports=[
  {
    name: "Guard",
    id: "1",
    count: "5",
    action: "When this card is played, its player chooses another player and picks a card. If the chosen player holds the type of card specified, that player is eliminated. However, Guard cannot be named as the type of card.",
    image: require("../style/img/guard.jpg")
  },
  {
    name: "Priest",
    id: "2",
    count: "2",
    action:"When this card is played, its player is allowed to see another player's hand.",
    image: require("../style/img/priest.jpg")
  },
  {
    name: "Baron",
    id: "3",
    count: "2",
    action:"When this card is played, its player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
    image: require("../style/img/baron.jpg")
  },
  {
    name: "Handmaiden",
    id: "4",
    count: "2",
    action:"When this card is played, the player cannot be affected by any other player's card until the next turn.",
    image: require("../style/img/handmaiden.jpg")
  },
  {
    name:"Prince",
    id: "5",
    count: "2",
    action: "When this card played, its player can choose any player (including themselves) to discard their hand and draw a new one. If that player discards the Princess, they are eliminated.",
    image: require("../style/img/prince.jpg")
  },
  {
    name:"King",
    id: "6",
    count: "1",
    action: "When this card is played, its player trades hands with any other player.",
    image: require("../style/img/king.jpg")
  },
  {
    name:"Countess",
    id:"7",
    count: "1",
    action: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
    image: require("../style/img/queentest.jpg")
  },
  {
    name:"Princess",
    id: "8",
    count: "1",
    action: "If a player plays this card for any reason, they are eliminated from the round.",
    image: require("../style/img/princess.jpg")
  }
]
