import { GameDTO } from "../dto/game.dto";
import { notFound } from "../error/NotFoundError";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";
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

  public async getReviewsByGameById(id: number): Promise<{ game: GameDTO, reviews: Review[] } | null> {
    const game = await Game.findByPk(id);
    
    if (!game) {
      return null;
    }
    const reviews = await Review.findAll({
      where: {
        game_id: id,
      },
    });
  
    const gameDTO: GameDTO = {
      id: game.id,
      title: game.title,
      console: game.console,
    };
    return { game: gameDTO, reviews };
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
    const game = await Game.findByPk(id)
      if (game) {
        const reviews = await Review.findAll({
          where: {
            game_id: game.id
          }
        });
        if(!reviews[0].id){
          game.destroy();
        }
      } else {
        notFound(""+id)
        
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
