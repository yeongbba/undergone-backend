import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import { LoginOutput } from "src/users/dtos/login.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor() { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request): LoginOutput {
        return req.user as LoginOutput;
    }
}