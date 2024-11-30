import { GameDTO } from "./game.dto";

export interface ReviewDTO {
    id?: number;
    rating: number;
    game?: GameDTO;
    review_text: string;
}