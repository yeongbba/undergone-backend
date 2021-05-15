import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver(of => User)
export class UserResolver {
    constructor(
        private readonly usersService: UserService,
    ) { }

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const { ok, error } = await this.usersService.createAccount(
                createAccountInput,
            );
            return {
                ok,
                error,
            };
        } catch (error) {
            return {
                ok: false,
                error,
            };
        }
    }

    @Query(returns => User)
    @UseGuards(GqlAuthGuard)
    me(@CurrentUser() currentUser: User) {
        return currentUser;
    }
}
