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
- Open a Websocket with `/create` to receive an `ID:{ID}` message.
- Have the second agent join with `/join/{ID}`
- Send moves by sending websocket messages of `PLAY:{COL}`

### Running the server
---
After cloning the repository and installing the dependencies with `npm i`,

the server can be run with
> `npm run server`

and the spectator client can be run with
> `npm run client`

(*this will take slightly longer the first time it's run*)

## Python Gameloop Example

```python
import asyncio
import websockets

async def gameloop (socket, created):
  active = True

  while active: # While game is active, continually anticipate messages
    message = (await socket.recv()).split(':') # Receive message from server

    match message[0]:
      case 'GAMESTART': # Game has started
        if created: # If we created the game, it's our turn since we go first
            col = calculate_move(None) # calculate_move is some arbitrary function you have created to figure out the next move
            await socket.send(f'PLAY:{col}') # Send your move to the sever

      case 'OPPONENT': # Opponent has gone; calculate next move
        col = calculate_move(message[1]) # Give your function your opponent's move
        await socket.send(f'PLAY:{col}') #  Send your move to the sever

      case 'WIN' | 'LOSS' | 'DRAW' | 'TERMINATED': # Game has ended
        print(message[0])

        active = False

async def create_game (server):
  async with websockets.connect(f'ws://{server}/create') as socket: # Establish websocket connection
    await gameloop(socket, True)

async def join_game(server, id):
  async with websockets.connect(f'ws://{server}/join/{id}') as socket: # Establish websocket connection
    await gameloop(socket, False)

if __name__ == '__main__': # Program entrypoint
  server = input('Server IP: ').strip() # Get IP from console

  protocol = input('Join game or create game? (j/c): ').strip() # Get action from console

  match protocol:
    case 'c':
      asyncio.run(create_game(server))
    case 'j':
      id = input('Game ID: ').strip()

      asyncio.run(join_game(server, id))
    case _:
      print('Invalid protocol!')
```
