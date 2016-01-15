$(document).ready(init);

var obj = {};
var bank = 1000; 
var wins = 0; 
var loses = 0; 

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
    obj.deck = _.shuffle(obj.deck); 
  }
}

function init(){
  reset(); 
  $('#deal').click(deal); 
  $('#hit').click(hit);
  $('#stand').click(stand);
  $('#rebet').click(rebet);
  $('.chip').click(chip);
  $('.chip').dblclick(chipIn);
  $('#upBet').click(upBet);
  $('#downBet').click(downBet);
  $('#clearBet').click(clearBet);
}

// MVP functions: 

function updateDisplay(){
  if (obj.state === "pregame") {
    $('#playerHand').children('.card').each(function(index){
      $(this).text('');
    });
    $('#dealerHand').children('.card').each(function(index){
      $(this).text('');
    });
    $('#playerMessage').text('PLACE BET');
    $('#dealerMessage').text('');

    $('#playerPoints').text('');
    $('#dealerPoints').text('');
    return; 
  };

  if (obj.state !== 'stand') {
    $('#playerHand').children('.card').each(function(index){
      $(this).text(obj.player.hand[index]);
    });    
    $('#playerPoints').text(obj.player.points);
  } else {
    obj.state = 'gameOver'; 
  };

  if (obj.facedown) {
    $('#dealerSlot0').text(obj.dealer.hand[0]);
    $('#dealerSlot1').text('\uFFFD');
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
  if (obj.state === 'pregame') {
    obj.state = "started";
    obj.facedown = true; 
    takeCard(obj.player.hand, obj.deck);
    takeCard(obj.dealer.hand, obj.deck);
    obj.dealer.message = "Faceup points: " + softHard(obj.dealer.hand).toString(); 

    takeCard(obj.player.hand, obj.deck);
    takeCard(obj.dealer.hand, obj.deck); 
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
      obj.player.message = "Points:";
    }

    updateDisplay();     
  };
};

function hit(){
  if (obj.state !== "started") { return; }
  
  takeCard(obj.player.hand, obj.deck);
  obj.player.points = softHard(obj.player.hand); 

  if ( softHard(obj.dealer.hand) <= 17) {
    obj.facedown = false; 
    takeCard(obj.dealer.hand, obj.deck);
    obj.dealer.points = softHard(obj.dealer.hand); 
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
    wins++; 
  } else if (obj.dealer.points === 21) {
    obj.player.message = "Lose"; 
    alert("Dealer got a BJ! You lose!");
    loses++;
  } else {
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
      compareHands(); 
    }
  }
  updateDisplay(); 
};

function stand(){
  if (obj.state !== "started") { return; }
  
  obj.state = 'stand'; 
  obj.facedown = false; 

  while( softHard(obj.dealer.hand) <= 17 ){
    takeCard(obj.dealer.hand, obj.deck);
  }
  
  obj.dealer.points = softHard(obj.dealer.hand); 

  if (obj.dealer.points > 21) {
    obj.dealer.message = "Bust"; 
    obj.player.message = 'Player 2 got busted! You win!';
    wins++; 
  } else {
    obj.dealer.message = "Faceup points: "; 
    compareHands();       
  } 
  
  updateDisplay(); 
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
  hand.push(deck[0]); 
  deck.shift(); 
}; 

function compareHands(){
  if (obj.player.points === obj.dealer.points) {
    alert("It's a tie!");
    obj.player.message = "Tie";
    obj.dealer.message = "Tie";
  } else if (obj.player.points > obj.dealer.points) {
    obj.player.message = "You have more points! You win!";
    wins++; 
  } else {
    obj.player.message = "Dealer has more points than you! You lose!";
    loses++; 
  }
  obj.state = "gameOver"; 
};

function reset(){
  obj.numberDecks = 1; 
  obj.makeDeck();
  obj.shuffleDeck(); 
  obj.dealer = {}; 
  obj.dealer.hand = [];
  obj.dealer.points = 0; 
  obj.dealer.message = '';
  obj.player = {}; 
  obj.player.hand = []; 
  obj.player.points = 0; 
  obj.player.message = "PLACE BET"; 
  obj.state = "pregame"; 
  obj.facedown = true; 
  obj.bet = 0; 
}; 


// Extra functions: 

function chip(){
  if (obj.state === "pregame") {
    $('.chip').removeClass('glow');
    $(this).addClass('glow'); 
  };
}

function upBet(){
  if (obj.state === "pregame") {
    var up = parseInt($('.glow').text()); 
    obj.bet += up; 
    $('#bet').text(obj.bet);
  };
}

function downBet(){
  if (obj.state === "pregame") {
    var down = parseInt($('.glow').text()); 
    obj.bet -= down; 
    if (obj.bet <= 0) { obj.bet = 0; };
    $('#bet').text(obj.bet);
  }
}

function clearBet(){
  if (obj.state === "pregame") {
   obj.bet = 0; 
   $('#bet').text(obj.bet);
  }
}

function chipIn(){
  if (obj.state === "pregame") {
    $('.chip').removeClass('glow');
    var $this = $(this); 
    $this.addClass('glow'); 
    var up = parseInt($this.text()); 
    obj.bet += up; 
    $('#bet').text(obj.bet);
  };
}