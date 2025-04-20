# Word Game

This is a clone of a popular word game. This was a learning experience to build something more complex than just UI components on a site. There is more interactivity between components in a game context than in a typical UI (though I've worked on equally complicated UI situations).

I was inspired to give Neobrutalism a try after reading about it in an article. I love the interesting colors and thick outlines that permeate throughout the style. Given that I am a 508 specialist as well, I also wanted to make a version of the game that felt more accessible.

[Live Site](https://agriffith-word-game.netlify.app/)

## Tooling

- Vite + React
- TypeScript
- Cypress
- TailwindCSS
- Netlify

I would call this a standard UI stack. It's a basic React app with TailwindCSS for styling. I've grown prefer TailwindCSS because writing CSS for trivial positioning is mentally taxing. Unless I'm doing something specific and complex, though I've learned through this project you can create a class that encapsulates several tailwind classes, I don't like writing bespoke CSS or my own responsive queries. TailwindCSS is enough to capture 99% of my use cases in this app.

I intentionlly did not unit test this codebase and isntead opted for Cypress end-to-end tests. There are a few spots where unit tests would be helpful, but given the integrations between all the components I felt that Cypress covered all of my use cases. It's integrated into my build pipeline as well through Netlify, so it will have to run and pass before each deploy.

## How It Works

There is a JSON file included that has 100 words listed in it, along with their properties for the game. When the game is loaded for the first time, it will pull in the JSON and load it into local storage. On subsequent loads, the game will load the stringified JSON from local storage instead of a fresh copy from the application.

The list of words is loaded into state, and updated whenever a user makes a guess. When the state gets updated it also updates the local storage copy of the word JSON so there is some persistence since there is no database.

### Potential Database Structure
