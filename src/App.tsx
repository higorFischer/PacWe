import { useEffect, useRef, useState } from "react";
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
import useWebSocket from "react-use-websocket";
import { create } from "domain";

var board!: Board;
var players!: Player[];
var player!: Player;

function App() {
	const ref = useRef<any>();

	var boardScketcher = new BoardScketcher();
	var playerSketcher = new PlayerSketcher();

	const ws = useWebSocket("ws://localhost:8998", {
		onOpen: (c) => {
			console.log(`Connected to App WS`);
		},
		onMessage: (m) => {
			board = Object.assign(Board.empty(), JSON.parse(m.data).board);
			players = Object.assign([], JSON.parse(m.data).players);

			if (!player)
				player = Object.assign(Player.empty(), JSON.parse(m.data).self);
		},
		queryParams: { token: "123456" },
		onError: (event) => {
			console.error(event);
		},
		shouldReconnect: (closeEvent) => true,
		reconnectInterval: 3000,
	});

	const Sketch = (p: p5) => {
		p.preload = () => {};

		p.setup = () => {
			const width = 700;
			const height = 700;

			p!.background(160, 150, 125, 100);
			p.createCanvas(width, height);
		};

		p.draw = () => {
			boardScketcher.draw(p, board);
			playerSketcher.draw(p, players);

			p.keyPressed = (e: any) => {
				ws.sendMessage(
					JSON.stringify({
						self: player,
						type: "MOVE",
						key: e.code,
					})
				);
			};
		};
	};

	const create = () => {
		new p5(Sketch, ref.current);
	};

	return (
		<div style={{ display: "flex" }}>
			<button onClick={create}>Connect</button>
			<div ref={ref} />
		</div>
	);
}

export default App;
