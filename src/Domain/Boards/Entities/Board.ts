import { Entity } from "../../Commons/Entity";
import { Position } from "../../Commons/Position";
import { TileStatus } from "../Enums/TileStatus";
import { Tile } from "./Tile";

export class Board extends Entity {
	get flattenTiles() {
		return this.tiles.flatMap((c) => c);
	}

	get xLimit() {
		return this.tiles.length;
	}

	get yLimit() {
		return this.tiles[0].length;
	}

	fetch(position: Position) {
		return this.tiles[position.x][position.y];
	}

	isInside(position: Position) {
		const isInsideHorizontaly = position.x < this.xLimit && position.x >= 0;
		const isInsideVerticaly = position.y < this.yLimit && position.y >= 0;
		return isInsideHorizontaly && isInsideVerticaly;
	}

	isPointObject(position: Position) {
		return this.fetch(position).status === TileStatus.POINTOBJECT;
	}

	isPowerUP(position: Position) {
		return this.fetch(position).status === TileStatus.POWERUP;
	}

	constructor(public tiles: Tile[][]) {
		super();
	}
}
