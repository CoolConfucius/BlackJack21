$(document).ready(init);

var obj = {};
var bank;
var wins; 
var loses; 

obj = {
  makeDeck: function(){
    obj.deck = []; 
    var suits = ['\u2663', '\u2662', '\u2660', '\u2661'];
    var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    if (obj.numberDecks === 1) {
      suits.forEach(function(suit){
        ranks.forEach(function(rank){
          var card = {};
          card.rank = rank;
          card.suit = suit; 
          obj.deck.push(rank + suit);
        });
      });
    };
  },
  
  shuffleDeck: function(){
    _.shuffle(obj.deck); 
  }
}

function init(){
  obj.numberDecks = 1; 
  obj.makeDeck();
  obj.shuffleDeck; 
  obj.dealer = {}; 
  obj.dealer.hand = [];
  obj.dealer.points = 0; 
  obj.dealer.message = '';
  obj.player = {}; 
  obj.player.hand = []; 
  obj.player.points = 0; 
  obj.player.message = "PLACE BET"; 
  obj.state = "pregame"; 
  obj.facedown = "true"; 

  reset(); 
  $('#deal').click(deal); 
  $('#hit').click(hit);
  $('#stand').click(stand);
  $('#rebet').click(rebet);
}

function updateDisplay(){
  if (obj.state !== 'stand') {
    $('#playerHand').children('.card').each(function(index){
      $(this).text(obj.player.hand[index]);
    });    
    $('#playerPoints').text(obj.player.points);
  } else {
    obj.state = 'gameOver'; 
  };

  if (obj.facedown && obj.state !== 'pregame') {
    $('#dealerSlot0').text(obj.dealer.hand[0]);
    $('#dealerSlot1').text('Facedown');
  } else {
    $('#dealerHand').children('.card').each(function(index){
      $(this).text(obj.dealer.hand[index]);
    });
    $('#dealerPoints').text(obj.dealer.points);
  }

  $('#playerMessage').text(obj.player.message);
  $('#dealerMessage').text(obj.dealer.message);
}

function deal(){
  console.log("Deck,: ", obj.deck); 
  if (obj.state === 'pregame') {
    obj.state = "started";
    obj.facedown = true; 
    takeCard(obj.player.hand, obj.deck);
    takeCard(obj.dealer.hand, obj.deck);
    obj.dealer.message = "Faceup points: " + softHard(obj.dealer.hand).toString(); 

    takeCard(obj.player.hand, obj.deck);
    takeCard(obj.dealer.hand, obj.deck); // facedown. find a way to implement it. 
    obj.player.points = softHard(obj.player.hand);
    obj.dealer.points = softHard(obj.dealer.hand);


    if (obj.player.points === 21) { obj.player.message = "BJ"; obj.state = "gameOver"; }
    if (obj.dealer.points === 21) { obj.dealer.message = "BJ"; obj.state = "gameOver"; }

    if (obj.player.points === 21 && obj.dealer.points === 21) {
      alert("You both got BJs at the start!"); 
    } else if (obj.player.points === 21) {
      alert("You got a BJ at the start! You win!");
      wins++;
    } else if (obj.dealer.points === 21){
      alert("Dealer got a BJ at the start! You lose!"); 
    } else {
      // obj.player.message = obj.player.points.toString();
      obj.player.message = "Points:";
    }

    updateDisplay();     
  };
};

function hit(){
  if (obj.state === "started") {

    takeCard(obj.player.hand, obj.deck);
    obj.player.points = softHard(obj.player.hand); 

    if ( softHard(obj.dealer.hand) <= 17) {
      obj.facedown = false; 
      takeCard(obj.dealer.hand, obj.deck);
      obj.dealer.points = softHard(obj.dealer.hand); 
      // obj.dealer.message = obj.dealer.points.toString(); 
      obj.dealer.message = "Faceup points: "; 
    };

    if (obj.player.points === 21) { obj.player.message = "BJ"; obj.state = "gameOver"; }
    if (obj.dealer.points === 21) { obj.dealer.message = "BJ"; obj.state = "gameOver"; }

    if (obj.player.points >= 21 || obj.dealer.points >= 21 ) {
      obj.state = 'gameOver'; 
    }
    console.log(obj.player.points, obj.dealer.points); 
    
    if (obj.player.points === 21 && obj.dealer.points === 21) {       
      alert("You both got BJs!"); 
    } else if (obj.player.points === 21) { 
      alert("You got a BJ!"); 
    } else if (obj.dealer.points === 21) {
      alert("Dealer got a BJ! You lose!");
    }; 

    if (obj.player.points > 21) { obj.player.message = "Bust"; obj.state = "gameOver"; loses++; }
    if (obj.dealer.points > 21) { obj.dealer.message = "Bust"; obj.state = "gameOver"; }

    if (obj.player.points > 21 && obj.dealer.points > 21) {
      alert("You both got Busted! But Dealer wins by rules"); 
      } else if (obj.player.points > 21) { 
        obj.player.message = "You got Busted!"; 
      } else if (obj.dealer.points > 21) {
        obj.dealer.message = "Dealer got Busted!"
        obj.player.message = "You win!";
        wins++; 
      } else {
        if (obj.player.points > obj.dealer.points) {
          obj.player.message = "You have more points! You win!";
          wins++; 
        } else {
          obj.player.message = "Dealer has more points than you! You lose!";
          loses++; 
        }
      }
    }

    updateDisplay(); 
  };
};

function stand(){
  if (obj.state === "started") {
    obj.state = 'stand'; 
    obj.facedown = false; 

    while( softHard(obj.dealer.hand) <= 17 ){
      takeCard(obj.dealer.hand, obj.deck);
    }
    
    obj.dealer.points = softHard(obj.dealer.hand); 

    if (obj.dealer.points2 === 21) {
      obj.player.message = 'Player 2 has a BJ! You lose!';
    } else {
      if (obj.dealer.points > 21) {
        obj.player.message = 'Player 2 got busted! You win!';
      } else {
        obj.player.points = softHard(obj.player.hand); 
        obj.player.message = obj.player.points > obj.dealer.points ? "You have more points! You win!" : "Dealer has more points than you! You lose!"; 
      } 
    }

    // obj.dealer.message = obj.dealer.points.toString(); 
    obj.dealer.message = "Faceup points: "; 
    updateDisplay(); 
  };
};

function rebet(){
  if (obj.state === 'gameOver') {
    reset(); 
    updateDisplay(); 
  };
}; 

function countHand(hand){
  var points = hand.reduce(function(sum, element){
    var rank = element.split('')[0]; 
    switch (rank){
      case 'J': 
      case 'Q': 
      case 'K': 
      sum += 10; 
      break; 
      case 'A': 
      sum += 11 
      break; 
      case '1': 
      sum += 10; 
      break; 
      default: 
      sum += parseInt(rank); 
    }
    return sum; 
  }, 0);
  return points; 
}; 

function getAces(hand){
  var aces = hand.reduce(function(sum, element){    
    if (element.split('')[0] === 'A') {
      sum += 1; 
    };
    return sum; 
  }, 0);
  return aces; 
};

function softHard(hand){
 var points = countHand(hand); 
 if (points > 21) {
  var aces = getAces(hand); 
  while (points > 21 && aces > 0){
    aces -= 1; 
    points -= 10; 
  }
};
return points; 
}; 


function takeCard(hand, deck){
  console.log('hand', hand);
  console.log('deck', deck);
  hand.push(deck[0]); 
  deck.shift(); 
}; 

function reset(){
  obj.numberDecks = 1; 
  obj.makeDeck();
  obj.shuffleDeck; 
  obj.dealer = {}; 
  obj.dealer.hand = [];
  obj.dealer.points = 0; 
  obj.dealer.message = '';
  obj.player = {}; 
  obj.player.hand = []; 
  obj.player.points = 0; 
  obj.player.message = "PLACE BET"; 
  obj.state = "pregame"; 
  obj.facedown = "true"; 
}; 

