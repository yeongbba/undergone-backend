import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginOutput } from 'src/users/dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<LoginOutput> {
        console.log(email, password, "local")

        try {
            const { ok, token, error } = await this.authService.validate(email, password);
            if (!ok) {
                throw new UnauthorizedException(error);
            }
            return {
                ok,
                token
            };
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }
}