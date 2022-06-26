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
import { io, Socket } from "socket.io-client";
import { ImageSquare } from "./Components/ImageSquare";
import { connect } from "http2";
var board!: Board;
var players!: Player[];
var player!: Player;

function App() {
	const [videoSocket, useVideoSocket] = useState(
		io("wss://pacweserver.herokuapp.com")
		// io("ws://localhost:3001")
	);

	const ref = useRef<any>();
	const videoRef = useRef<any>();
	const canvasRef = useRef<any>();
	const [videos, setVideos] = useState<any>({});
	var boardScketcher = new BoardScketcher();
	var playerSketcher = new PlayerSketcher();

	videoSocket.on("connect", () => {
		console.log("Connected to Pacwe Server");
	});

	videoSocket.on("gameaction", (m) => {
		const obj = JSON.parse(m);
		if (!board) new p5(Sketch, ref.current);

		board = Object.assign(Board.empty(), obj.board);
		players = Object.assign([], obj.players);

		console.log("updated board", board, players);

		if (!player) player = Object.assign(Player.empty(), obj.self);
	});

	// videoSocket.on("gameinit", (m) => {
	// 	const obj = JSON.parse(m);

	// 	board = Object.assign(Board.empty(), obj.board);
	// 	players = Object.assign([], obj.players);

	// 	if (!player) player = Object.assign(Player.empty(), obj.self);

	// 	new p5(Sketch, ref.current);
	// });

	videoSocket.on("video", (d: any) => {
		setVideos((videos: any) => {
			const v = { ...videos };
			v[d.id] = d.video;
			return v;
		});
	});

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
		// navigator.mediaDevices.getUserMedia =
		// 	navigator.mediaDevices.getUserMedia ||
		// 	(navigator.mediaDevices as any)?.webkitGetUserMedia ||
		// 	(navigator.mediaDevices as any)?.mozGetUserMedia ||
		// 	(navigator.mediaDevices as any)?.msgGetUserMedia;
		// if (navigator.mediaDevices.getUserMedia) {
		// 	navigator.mediaDevices
		// 		.getUserMedia({
		// 			video: true,
		// 			audio: false,
		// 		})
		// 		.then((stream) => {
		// 			loadCamera(stream);
		// 		});
		// }
		// canvasRef.current.width = 200;
		// canvasRef.current.height = 200;
		// const video = videoRef.current;
		// const context = canvasRef.current.getContext("2d");
		// context.width = 200;
		// context.height = 200;
		// setInterval(function () {
		// 	Draw(video, context);
		// }, 1000);
	}, []);

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
				videoSocket.emit(
					"movement",
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
		videoSocket.emit("game");
	};

	return (
		<div style={{ display: "flex" }}>
			{/* <video ref={videoRef} autoPlay muted height={200} width={200} />
			<div>DEVESAOss</div>
			{videos &&
				Object.keys(videos).map((videoKey: any) => {
					return (
						<ImageSquare key={videoKey} data={videos[videoKey]} />
					);
				})}
			<canvas ref={canvasRef} style={{ display: "none" }} id="preview" /> */}

			<button onClick={create}>Connect</button>
			<div ref={ref} />
		</div>
	);
}

export default App;
