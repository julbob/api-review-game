import { Console } from "../models/console.model";
import { notFound } from "../error/NotFoundError";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";
import { ConsoleDTO } from "../dto/console.dto";
export class ConsoleService {

  // Récupère toutes les consoles
  public async getAllConsoles(): Promise<Console[]> {
    return await Console.findAll();
  }

  // Récupère une console par ID
  public async getConsoleById(id: number): Promise<Console | null> {
    return Console.findByPk(id);
  }
  public async getGamesByConsoleById(id: number): Promise<{ console: ConsoleDTO, games: Game[] } | null> {
    const console = await Console.findByPk(id);
  
    if (!console) {
      return null;
    }
    const games = await Game.findAll({
      where: {
        console_id: id,
      },
    });
    const consoleDTO: ConsoleDTO = {
      id: console.id,
      name: console.name,
      manufacturer: console.manufacturer,
    };
    return { console: consoleDTO, games };
  }

  
  public async createConsole(
    name: string,
    manufacturer: string
  ): Promise<Console> {
    return Console.create({ name: name, manufacturer: manufacturer });
  }


  public async deleteConsole(id: number): Promise<void> {

    const console = await Console.findByPk(id);
    if (console?.id) {
      const games = await Game.findAll({
        where: {
          console_id: console.id
        }
      });

      let hasReviews = false;


      for (const game of games) {
        const reviews = await Review.findAll({
          where: {
            game_id: game.id
          }
        });

        if (reviews.length > 0) {
          hasReviews = true;
          break;
        }
      }

      if (!hasReviews) {
        await Game.destroy({
          where: {
            console_id: console.id
          }
        });

        await Console.destroy({
          where: {
            id: console.id
          }
        });
      }

    }else{
      notFound(""+id)
    }
  }

  // Met à jour une console
  public async updateConsole(
    id: number,
    name?: string,
    manufacturer?: string
  ): Promise<Console | null> {
    const console = await Console.findByPk(id);
    if (console) {
      if (name) console.name = name;
      if (manufacturer) console.manufacturer = manufacturer;
      await console.save();
      return console;
    }
    return null;
  }
}

export const consoleService = new ConsoleService();
