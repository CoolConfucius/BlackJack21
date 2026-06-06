# Blackjack 21

A browser-based Blackjack game with a full betting system, persistent score tracking, and Vegas-style rules.

**[Live Demo](https://coolconfucius.github.io/BlackJack21/)**

## How to Play

1. Select a chip denomination (1, 5, 10, 25, or 100) and click **Increase Bet** — or double-click a chip to select and place a bet in one move
2. Click **Deal** to start the round
3. **Hit** to draw another card, **Stand** to hold your hand
4. The dealer plays automatically (hits on 16 or below, stands on 17+)
5. Closest to 21 without busting wins

## Features

- Standard 52-card deck with shuffle (via Lodash)
- Soft/hard Ace handling (counts as 11, drops to 1 to avoid busting)
- Five chip denominations: 1, 5, 10, 25, 100
- Bankroll and win/loss record saved via `localStorage` — persists between sessions
- Dealer card stays face-down until the player stands
- In-game rules reference

## Tech Stack

- Vanilla JavaScript (ES5)
- HTML5 / CSS3
- Bootstrap 3.3 / jQuery 2.2 / Lodash 4

## Run Locally

No build step needed — just open `index.html` in any browser.
