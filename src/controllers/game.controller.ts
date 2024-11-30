import {  Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";
import { notFound } from "../error/NotFoundError";
import { Review } from "../models/review.model";
@Route("games")
@Tags("Games")
export class GameController extends Controller {
  @Get("/")
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames();
  }
  @Get("{id}")
  public async getGameById(@Path() id: number): Promise<GameDTO | null> {
  const game = await gameService.getGameById(id)
  if(!game)
    notFound(""+id)
  return game;
}

@Get("{id}")
public async getReviewsByGameById(@Path() id: number): Promise<{ game: GameDTO, reviews: Review[] } | null> {
  const result = await gameService.getReviewsByGameById(id);
  if (!result) {
    return null;  
  }
  return {
    game: result.game,
    reviews: result.reviews,    
  };
}


 @Post("/")
 public async createGame(
   @Body() requestBody: GameDTO
 ): Promise<GameDTO> {
   const { title,console } = requestBody;
   return gameService.createGame(title,console!.id!);
 }

  @Delete("{id}")
  public async deleteGame(@Path() id: number): Promise<void> {
    await gameService.deleteGame(id);
  }

 @Patch("{id}")
 public async updateGame(
   @Path() id: number,
   @Body() requestBody: GameDTO
 ): Promise<GameDTO> {
   const { title, console } = requestBody;
   
   const game = await gameService.getGameById(id);
   if (!game) {
     notFound(""+id)
   }
 
   return game;
 }
}


