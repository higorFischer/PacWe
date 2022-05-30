import p5 from "p5";
import { Board } from "../Domain/Boards/Entities/Board";
import { TileStatus } from "../Domain/Boards/Enums/TileStatus";

export class BoardScketcher {
	draw(p: p5, board: Board) {
		for (var tile of board.flattenTiles) {
			p.fill(tile.status === TileStatus.BLOCKED ? "black" : "white");
			p.square(tile.position.x * 30, tile.position.y * 30, 30);

			if (tile.status === TileStatus.POINTOBJECT)
				p.circle(
					tile.position.x * 30 + 15,
					tile.position.y * 30 + 15,
					10
				);
			else if (tile.status === TileStatus.POWERUP) {
				p.fill("blue");
				p.circle(
					tile.position.x * 30 + 15,
					tile.position.y * 30 + 15,
					10
				);
			}

			p.fill("black");
		}
	}
}
