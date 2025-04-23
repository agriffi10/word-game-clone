# Word Game

This project is a clone of a popular word game. 

It was a great learning experience to build something more complex than just UI components on a site. There is more interactivity between elements in a game context than in a typical UI, though I've worked on equally complicated UI situations.

I was inspired to try Neobrutalism after reading about it in an article. I love the interesting colors and thick outlines that permeate throughout the style. Given that I am a 508 specialist as well, I also wanted to make a version of the game that had more accessibility built in.

[Live Site](https://agriffith-word-game.netlify.app/)

## Tooling

- Vite + React
- TypeScript
- Cypress
- TailwindCSS
- Netlify

This is a basic React app with TailwindCSS for styling. I've grown to prefer TailwindCSS because writing CSS for trivial positioning is mentally taxing. Unless I'm doing something specific and complex, though I've learned through this project you can create a class that encapsulates several Tailwind classes, I don't like writing bespoke CSS or my own responsive queries. Tailwind is enough to capture 99% of my use cases in this app.

I intentionally did not unit test this codebase and instead opted for Cypress end-to-end tests. There are a few spots where unit tests would be helpful, but given the integrations between all the components, I felt that Cypress covered all of my use cases. It's integrated into my build pipeline as well through Netlify, so it will have to run and pass before each deploy.

## How It Works

There is a JSON file included that has 100 words listed in it, along with their properties for the game. When the game is loaded for the first time, it will pull in the JSON and load it into local storage. On subsequent loads, the game will load the stringified JSON from local storage instead of a fresh copy from the application.

The list of words is loaded into the state and updated whenever a user makes a guess. When the state gets updated, it also updates the local storage copy of the word JSON, so there is some persistence since there is no database. When a guess is entered, it is check against the current list of 100 words that I have created. The player will receive an alert if the word they submitted was not in the list.

Users can also view past words that they have already completed, and they can clear the word cache to get a clean slate of the words.

### Potential Database Structure

There are a number of things I would implement if I decide to include a backend for a full-stack solution.

![word-game-arch](https://github.com/user-attachments/assets/d03db5fa-3a74-43eb-b412-44106eb4403e)

I would use a BaaS like Supabase to handle all my data and authentication. It integrates nicely with React, and prevents me from having to write and maintain more than one service application.

Creating an account would be optional for the user, but creating an account would be required for storing user stats and letting the user do multiple words on a given day. The word JSON that's loaded into local storage would be removed in favor of reading the words from a database.

### Word Database

![word-game-table](https://github.com/user-attachments/assets/97b6ac93-24f0-4c37-bd59-e01262bd1356)

Using Postgres in Supabase, I'd create a table that housed all the words, along with the date they were used. From the UI, instead of loading a list of words, it would make an API call to get the word for the current day.

When a user submits a guess, the UI would make an API call to check if the word existed in the table as the simplest form of validation for valid, six letter english words.

If a guess is valid, it would get stored in the user Blob Storage for that user for the given word.

### User Blob Storage

Instead of creating many entries in a table to store user guesses and stats, I'd generate JSON files for each user in blob storage. 

Each logged in user would have a path at `user-data/{username}`. This path would have two subfolder keys:

- `/stats`
- `/words/{word}`

If a user was not logged in, then I would change the localStorage structure to mimic this pattern.

#### Stats Storage

This would live at the path `/{user}/stats/stat.json` and it would contain a JSON object with the following structure:

```
[{
  "totalWordsPlayed": 0,
  "totalWordsSolved": 0,
  "currentWinStreak": 0,
  "guessesCountToWin: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
      "6": 0
  }
}]
```
The stats JSON would get updated at the end of each game when a user either solves the word or exhausts all their guesses. If they solve the word, the `currentWinStreak` will be incremented by 1, or if they fail to solve a word it would reset to zero. The `totalWordsPlayed` and `totalWordsSolved` would need to be calculated from the word storage of the given user.

#### Word Storage
