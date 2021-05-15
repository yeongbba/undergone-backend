import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor() { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request): any {
        return req.user
    }
}