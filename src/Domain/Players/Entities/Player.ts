import { Entity } from "../../Commons/Entity";
import { Position } from "../../Commons/Position";
import { PlayerStatus } from "../Enums/PlayerStatus";

export class Player extends Entity {
	public position!: Position;
	public points: number = 0;
	public status: PlayerStatus = PlayerStatus.NORMAL;

	private constructor(x: number, y: number) {
		super();
		this.position = Position.create(x, y);
	}

	public static create(x: number, y: number) {
		return new Player(x, y);
	}
}
