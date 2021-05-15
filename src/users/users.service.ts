import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
    ) { }


    async createAccount({ email, password, username }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
        try {
            const exists = await this.users.findOne({ email });
            if (exists) {
                return { ok: false, error: '이미 가입된 이에일이 있습니다.' };
            }
            await this.users.save(this.users.create({ email, password, username }));
            return { ok: true };
        } catch (e) {
            return { ok: false, error: "회원가입을 할 수 없습니다." };
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.users.findOne({ email });
        return user;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.users.findOne({ id });
        return user;
    }
}