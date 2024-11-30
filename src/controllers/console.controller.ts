import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { consoleService } from "../services/console.service";
import { ConsoleDTO } from "../dto/console.dto";
import { notFound } from "../error/NotFoundError";
import { Game } from "../models/game.model";

@Route("consoles")
@Tags("Consoles")
export class ConsoleController extends Controller {
  // Récupère toutes les consoles
  @Get("/")
  public async getAllConsole(): Promise<ConsoleDTO[]> {
    return consoleService.getAllConsoles();
  }

  // Récupère une console par ID
  @Get("{id}")
  public async getConsoleById(@Path() id: number): Promise<ConsoleDTO | null> {
    const console = await consoleService.getConsoleById(id)
    if(!console)
      notFound(""+id)
    return console;
  }
    // Récupère des juex par ID de la console
  @Get("{id}")
  public async getGamesByConsoleById(@Path() id: number): Promise<{ console: ConsoleDTO, games: Game[] } | null> {
    const result = await consoleService.getGamesByConsoleById(id);
    if (!result) {
      return null;  
    }
    return {
      console: result.console,
      games: result.games,    
    };
  }
  // Crée une nouvelle console
  @Post("/")
  public async createConsole(
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const { name, manufacturer } = requestBody;
    return consoleService.createConsole(name, manufacturer);
  }

  // Supprime une console par ID
  @Delete("{id}")
  public async deleteConsole(@Path() id: number): Promise<void> {
    await consoleService.deleteConsole(id);
  }

  // Met à jour une console par ID
  @Patch("{id}")
  public async updateConsole(
    @Path() id: number,
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const { name, manufacturer } = requestBody;
    
    const console = await consoleService.getConsoleById(id);
    if (!console) {
      notFound(""+id)
    }
  
    return console;
  }
}