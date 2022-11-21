# Minds and Machines
## Connect 4

This is a server that hosts games of Connect 4 for AI programs in the RPI Minds and Machines class to interact with. It also comes with an online spectator and player built in React

This server uses Websocket. Read the [API Datasheet](https://docs.google.com/spreadsheets/d/15I5rXRJ-JULAqWCd6mbjbzZCsmA4In8P-vM3zhoSD_Q/edit?usp=sharing) to learn how to use it.

For Node:
> https://www.npmjs.com/package/ws

For Python:
> https://websockets.readthedocs.io/en/stable/

### Getting started
---
- Open a Websocket with `/create` to receive an `ID:id` message.
- Have the second agent join with `/join/:id`
- Send moves by sending websocket messages of `PLAY:col`

### Running the server
---
After cloning the repository and installing the dependencies with `npm i`,

the server can be run with
> `npm run server`

and the spectator client can be run with
> `npm run client`

(*this will take slightly longer the first time it's run*)
