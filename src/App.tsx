import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { Board } from "./Domain/Boards/Entities/Board";
import { Player } from "./Domain/Players/Entities/Player";
import { BoardScketcher } from "./Drawings/BoardSketcher";
import { PlayerSketcher } from "./Drawings/PlayerSketcher";
import { io } from "socket.io-client";
import { ImageSquare } from "./Components/ImageSquare";
// import { createSocket } from "dgram"

// socket = createSocket("udp4");

// socket.send("msg", 41234, "0.0.0.0", () => {
// 	console.log("OnError")
// })

var board!: Board;
var players!: Player[];
var player!: Player;
var allVideos: any = [];

var socket: any = null;
const fetchSocket = () => {
	if (!socket) socket = io("wss://pacweserver.herokuapp.com");
	return socket;
};

function App() {
	const [videoSocket, useVideoSocket] = useState(fetchSocket());

	const ref = useRef<any>();
	const videoRef = useRef<any>();
	const canvasRef = useRef<any>();
	const [videos, setVideos] = useState<any>({});
	var boardScketcher = new BoardScketcher();
	var playerSketcher = new PlayerSketcher();

	videoSocket.on("connect", () => {
		console.log("Connected to Pacwe Server");
	});

	videoSocket.on("gameaction", (m: any) => {
		const obj = JSON.parse(m);
		if (!board) new p5((p5) => Sketch(p5, videos), ref.current);

		board = Object.assign(Board.empty(), obj.board);
		players = Object.assign([], obj.players);

		if (!player) player = Object.assign(Player.empty(), obj.self);
	});

	videoSocket.on("gameinit", (m: any) => {
		const obj = JSON.parse(m);

		board = Object.assign(Board.empty(), obj.board);
		players = Object.assign([], obj.players);

		if (!player) player = Object.assign(Player.empty(), obj.self);

		new p5(Sketch, ref.current);
	});

	videoSocket.on("video", (d: any) => {
		setVideos((videos: any) => {
			const v = { ...videos };
			v[d.id] = d.video;
			allVideos = v;
			return v;
		});
	});

	videoSocket.on("disconnected", (d: any) => {
		setVideos((videos: any) => {
			const v = { ...videos };
			delete v[d];
			return v;
		});
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
		}, 500);
	}, []);

	const Sketch = (p: p5, videoPlayers: any) => {
		p.preload = () => {};

		p.setup = () => {
			const width = 700;
			const height = 700;

			p!.background(160, 150, 125, 100);
			p.createCanvas(width, height);
		};

		p.draw = () => {
			boardScketcher.draw(p, board);
			playerSketcher.draw(p, players, allVideos);

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

	const reset = () => {
		videoSocket.emit("reset");
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100vw",
				height: "100vh",
				margin: 0,
				padding: 0,
				backgroundColor: "#333",
			}}
		>
			<div className="buttons">
				<button className="button" onClick={create}>
					Connect
				</button>
				<button className="button" onClick={reset}>
					Reset
				</button>
			</div>
			<div className="game">
				<video ref={videoRef} autoPlay muted height={0} width={0} />
				<div style={{ display: "flex" }}>
					{videos &&
						Object.keys(videos).map((videoKey: any) => {
							return (
								<ImageSquare
									key={videoKey}
									data={videos[videoKey]}
								/>
							);
						})}
				</div>

				<canvas
					ref={canvasRef}
					style={{ display: "none" }}
					id="preview"
				/>

				<div ref={ref} />
			</div>
		</div>
	);
}

export default App;
