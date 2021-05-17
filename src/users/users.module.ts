import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserResolver],
})
export class UsersModule { }
