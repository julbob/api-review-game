import { GameDTO } from "../dto/game.dto";
import { notFound } from "../error/NotFoundError";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { consoleService } from "./console.service";

export class GameService {
  public async getAllGames(): Promise<GameDTO[]> {
    return Game.findAll({
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

  public async getGameById(id: number): Promise<Game | null> {
    return Game.findByPk(id);
  }

  

  public async createGame(
    title: string,
    console_id: number,
  ): Promise<Game> {
    const console = await consoleService.getConsoleById(console_id);
    if(!console)
      notFound(""+console_id)
    return Game.create({  title: title, console_id: console_id});
  }


  public async deleteGame(id: number): Promise<void> {
    const game = await Game.findByPk(id);
    if (game) {
      game.destroy();
    }
  }


  public async updateGame(
    id: number,
    title: string,
    console_id: number,
    console: Console
  ): Promise<Game | null> {
    const game = await Game.findByPk(id);
    if (game) {
      if (title) game.title = title;
      if (console_id) game.console_id = console_id;
      if (console) game.console = console;
      await game.save();
      return game;
    }
    return null;
  }
}

export const gameService = new GameService();
