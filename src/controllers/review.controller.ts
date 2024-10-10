import {  Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { ReviewDTO } from "../dto/review.dto";
import { reviewService } from "../services/review.service";
import { notFound } from "../error/NotFoundError";
@Route("reviews")
@Tags("Reviews")
export class ReviewController extends Controller {
    @Get("/")
    public async getAllReviews(): Promise<ReviewDTO[]> {
      return reviewService.getAllReviews();
    }
    @Get("{id}")
    public async getReviewsById(@Path() id: number): Promise<ReviewDTO | null> {
    const review = await reviewService.getReviewById(id)
    if(!review)
      notFound(""+id)
    return review;
  }
  
  
   @Post("/")
   public async createReview(
     @Body() requestBody: ReviewDTO
   ): Promise<ReviewDTO> {
     const { game,rating,review_text } = requestBody;
     return reviewService.createReview(game!.id!,rating,review_text);
   }
  
   
  
   @Patch("{id}")
   public async updateReview(
     @Path() id: number,
     @Body() requestBody: ReviewDTO
   ): Promise<ReviewDTO> {
     const { rating,game,review_text } = requestBody;
     
     const review = await reviewService.getReviewById(id);
     if (!review) {
       notFound(""+id)
     }
   
     return review;
   }
}
