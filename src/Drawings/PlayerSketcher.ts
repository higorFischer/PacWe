import p5 from "p5";
import { Player } from "../Domain/Players/Entities/Player";
import { PlayerStatus } from "../Domain/Players/Enums/PlayerStatus";

export class PlayerSketcher {
	draw(p: p5, players: Player[], capture?: any) {
		for (var player of players) {
			p.fill(player.status === PlayerStatus.GODMODE ? "red" : "yellow");
			p.circle(
				player.position.x * 30 + 15,
				player.position.y * 30 + 15,
				25
			);

			if (capture)
				p.image(
					capture,
					player.position.x * 30,
					player.position.y * 30,
					30,
					30
				);
			p.fill("black");
		}
	}
}
