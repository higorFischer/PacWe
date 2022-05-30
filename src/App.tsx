import { useEffect, useRef } from "react";
import p5 from "p5";
import { Board } from "./Domain/Boards/Entities/Board";
import { Player } from "./Domain/Players/Entities/Player";
import { PlayerMover } from "./Domain/Players/Services/PlayerMover";
import { BoardBuilder } from "./Domain/Boards/Services/BoardBuilder";
import { BoardMovementVerifier } from "./Domain/Boards/Services/BoardMovementVerifier";
import { board1 } from "./Boards/stringBoards";
import { BoardScketcher } from "./Drawings/BoardSketcher";
import { PlayerSketcher } from "./Drawings/PlayerSketcher";
import { PlayerStatus } from "./Domain/Players/Enums/PlayerStatus";

function App() {
	const ref = useRef<any>();

	var board!: Board;
	var players!: Player[];
	var capture: any;

	var boardScketcher = new BoardScketcher();
	var playerSketcher = new PlayerSketcher();
	var playerMover = new PlayerMover();

	const Sketch = (p: p5) => {
		p.preload = () => {};

		p.setup = () => {
			const width = 700;
			const height = 700;

			p!.background(160, 150, 125, 100);
			p.createCanvas(width, height);

			board = BoardBuilder.create(board1);
			// capture = p.createCapture(p.VIDEO);
			// capture.hide();
			players = [Player.create(1, 1)];
			console.log(board);
			console.log(players);
		};

		p.draw = () => {
			boardScketcher.draw(p, board);
			playerSketcher.draw(p, players);

			p.keyPressed = (e: any) => {
				var newPosition = playerMover.moveByKey(players[0], e.code);
				var movement = BoardMovementVerifier.verify(board, newPosition);

				if (movement.canMove) {
					players[0].position = newPosition;

					if (movement.points && movement.points > 0)
						players[0].points += movement.points;

					if (movement.isPowerUp)
						players[0].status = PlayerStatus.GODMODE;
				}
				console.log(players[0].points);
			};
		};
	};

	useEffect(() => {
		new p5(Sketch, ref.current);
	}, []);

	return (
		<div style={{ display: "flex" }}>
			<div ref={ref} />
		</div>
	);
}

export default App;
