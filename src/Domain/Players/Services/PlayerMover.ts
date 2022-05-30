import { Position } from "../../Commons/Position";
import { Direction } from "../Enums/Direction";
import { Player } from "../Entities/Player";

export class PlayerMover {
	public move(player: Player, direction: Direction) {
		var newPosition = Position.clone(player.position);
		switch (direction) {
			case Direction.DOWN:
				newPosition.y = player.position.y + 1;
				break;
			case Direction.UP:
				newPosition.y = player.position.y - 1;
				break;
			case Direction.RIGHT:
				newPosition.x = player.position.x + 1;
				break;
			case Direction.LEFT:
				newPosition.x = player.position.x - 1;
				break;
			default:
				break;
		}
		return newPosition;
	}
	public moveByKey(player: Player, key: string) {
		return this.move(player, this.keysToDirection(key));
	}

	public keysToDirection(key: string) {
		switch (key) {
			case "ArrowRight":
				return Direction.RIGHT;
			case "ArrowLeft":
				return Direction.LEFT;
			case "ArrowUp":
				return Direction.UP;
			case "ArrowDown":
				return Direction.DOWN;
		}
		return Direction.STILL;
	}
}
