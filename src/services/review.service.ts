import { ReviewDTO } from "../dto/review.dto";
import { notFound } from "../error/NotFoundError";
import { Review } from "../models/review.model";
import { Game } from "../models/game.model";
import { gameService } from "./game.service";

import { Console } from "../models/console.model";
import { consoleService } from "./console.service";

export class ReviewService {
  public async getAllReviews(): Promise<ReviewDTO[]> {
    return Review.findAll({
      include: [
        {
          model: Game,
          as: "game",
        },
        {
            model: Console,
            as: "console",
          },
      ],
      
    });
  }

  public async getReviewById(id: number): Promise<Review | null> {
    return Review.findByPk(id);
  }

  

  public async createReview(
    rating: number,
    game_id: number,
    review_text: string,
  ): Promise<Review> {
    const game = await gameService.getGameById(game_id);
    if(!game)
      notFound(""+game_id)
    return Review.create({  rating: rating, game_id: game_id,review_text:review_text});
  }


  public async deleteReview(id: number): Promise<void> {
    const review = await Review.findByPk(id);
    if (review) {
      review.destroy();
    }
  }


  public async updateReview(
    id: number,
    rating: number,
    game_id: number,
    game: Game,
    review_text: string
  ): Promise<Review | null> {
    const review = await Review.findByPk(id);
    if (review) {
      if (rating) review.rating = rating;
      if (game_id) review.game_id = game_id;
      if (game) review.game = game;
      if (review_text) review.review_text = review_text;
      await review.save();
      return review;
    }
    return null;
  }
}

export const reviewService = new ReviewService();
