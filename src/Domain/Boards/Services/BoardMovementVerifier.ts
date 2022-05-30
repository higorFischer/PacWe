import { Position } from "../../Commons/Position";
import { Board } from "../Entities/Board";
import { TileStatus } from "../Enums/TileStatus";

export class BoardMovementVerifier {
	public static verify(
		board: Board,
		newPosition: Position
	): { canMove: boolean; points?: number; isPowerUp?: boolean } {
		if (board.fetch(newPosition).status === TileStatus.BLOCKED)
			return { canMove: false };

		if (!board.isInside(newPosition)) return { canMove: false };

		if (board.isPointObject(newPosition)) {
			board.fetch(newPosition).status = TileStatus.EMPTY;
			return { canMove: true, points: 100 };
		}

		if (board.isPowerUP(newPosition)) {
			board.fetch(newPosition).status = TileStatus.EMPTY;
			return { canMove: true, isPowerUp: true };
		}

		return { canMove: true };
	}
}
