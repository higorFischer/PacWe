import { Position } from "../../Commons/Position";
import { Board } from "../Entities/Board";
import { Tile } from "../Entities/Tile";

export class BoardBuilder {
	public static create(matrix: string[][]) {
		var newTiles = [];

		for (var rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
			var newRow = [];
			var row = matrix[rowIndex];

			for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
				var column = row[columnIndex];
				newRow.push(
					new Tile(column, Position.create(rowIndex, columnIndex))
				);
			}
			newTiles.push(newRow);
		}

		return new Board(newTiles);
	}
}
