import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginOutput } from 'src/users/dtos/login.dto';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validate(email: string, password: string): Promise<LoginOutput> {
        const user = await this.usersService.getUserByEmail(email);

        if (!user) {
            return {
                ok: false,
                error: "no user"
            }
        }

        const passwordIsValid = await user.checkPassword(password);
        console.log(passwordIsValid, "invalid")
        if (!passwordIsValid) {
            return {
                ok: false,
                error: 'Wrong password',
            };
        }

        const payload = { email: user.email, id: user.id };
        return {
            ok: true,
            token: this.jwtService.sign(payload),
        }
    }
}


