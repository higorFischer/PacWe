import { Position } from "../../Commons/Position";
import { TileStatus } from "../Enums/TileStatus";

export class Tile {
	public position!: Position;
	public status!: TileStatus;

	constructor(tile: string, position: Position) {
		this.status = this.chooseType(tile);
		this.position = position;
	}

	public chooseType(tile: string) {
		if (tile === "|") return TileStatus.BLOCKED;
		if (tile === "*") return TileStatus.POWERUP;
		if (tile === ".") return TileStatus.POINTOBJECT;
		return TileStatus.EMPTY;
	}
}
