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
import { io } from "socket.io-client";
var board!: Board;
var players!: Player[];
var player!: Player;

function App() {
	const ref = useRef<any>();
	const videoRef = useRef<any>();
	const videoRef2 = useRef<any>();
	const canvasRef = useRef<any>();

	var boardScketcher = new BoardScketcher();
	var playerSketcher = new PlayerSketcher();

	var videoSocket = io("wss://pacweserver.herokuapp.com");
	// var videoSocket = io("ws://localhost:3000");
	videoSocket.connect();

	videoSocket.on("connect", () => {
		console.log("Connected");
	});

	videoSocket.on("video", (d) => {
		videoRef2.current.src = d.video;
	});

	function Draw(video: any, context: any) {
		context?.drawImage(video, 0, 0, context.width, context.height);
		videoSocket.emit("video", canvasRef.current.toDataURL("image/webp"));
	}

	function loadCamera(stream: any) {
		try {
			videoRef.current.srcObject = stream;
		} catch (error) {
			videoRef.current.src = URL.createObjectURL(stream);
		}
	}

	useEffect(() => {
		navigator.mediaDevices.getUserMedia =
			navigator.mediaDevices.getUserMedia ||
			(navigator.mediaDevices as any)?.webkitGetUserMedia ||
			(navigator.mediaDevices as any)?.mozGetUserMedia ||
			(navigator.mediaDevices as any)?.msgGetUserMedia;

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({
					video: true,
					audio: false,
				})
				.then((stream) => {
					loadCamera(stream);
				});
		}

		canvasRef.current.width = 200;
		canvasRef.current.height = 200;
		const video = videoRef.current;
		const context = canvasRef.current.getContext("2d");

		context.width = 200;
		context.height = 200;

		setInterval(function () {
			Draw(video, context);
		}, 100);
	}, []);

	// videoSocket

	// const ws = useWebSocket("", {
	// 	onOpen: (c) => {
	// 		console.log(`Connected to App WS`);
	// 	},
	// 	onMessage: (m) => {
	// 		board = Object.assign(Board.empty(), JSON.parse(m.data).board);
	// 		players = Object.assign([], JSON.parse(m.data).players);

	// 		if (!player)
	// 			player = Object.assign(Player.empty(), JSON.parse(m.data).self);
	// 	},
	// 	queryParams: { token: "123456" },
	// 	onError: (event) => {
	// 		console.error(event);
	// 	},
	// 	shouldReconnect: (closeEvent) => true,
	// 	reconnectInterval: 3000,
	// });

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
				// ws.sendMessage(
				// 	JSON.stringify({
				// 		self: player,
				// 		type: "MOVE",
				// 		key: e.code,
				// 	})
				// );
			};
		};
	};

	const create = () => {
		new p5(Sketch, ref.current);
	};

	return (
		<div style={{ display: "flex" }}>
			<video ref={videoRef} autoPlay muted height={200} width={200} />
			<div>DEVESAO</div>
			<img ref={videoRef2} height={200} width={200} />
			<canvas ref={canvasRef} style={{ display: "none" }} id="preview" />

			<button onClick={create}>Connect</button>
			{/* <div ref={ref} /> */}
		</div>
	);
}

export default App;
