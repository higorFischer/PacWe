export class Position {
	private constructor(public x: number, public y: number) {}

	public static create(x: number, y: number) {
		return new Position(x, y);
	}

	public static clone(position: Position) {
		return new Position(position.x, position.y);
	}
}
