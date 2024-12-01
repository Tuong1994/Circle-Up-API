import { Controller } from "@nestjs/common";
import { PostService } from "./post.service";

@Controller('api/post')
export class PostController {
    constructor(private postService: PostService) {}
}