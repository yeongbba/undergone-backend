import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { DeleteAccountOutput } from './dtos/delete-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver(of => User)
export class UserResolver {
    constructor(
        private readonly usersService: UserService,
    ) { }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
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

    @UseGuards(GqlAuthGuard)
    @Query(returns => UserProfileOutput)
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try {
            const user = await this.usersService.getUserById(userProfileInput.userId);
            if (!user) {
                throw Error();
            }
            return {
                ok: true,
                user,
            };
        } catch (e) {
            return {
                error: 'User Not Found',
                ok: false,
            };
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => EditProfileOutput)
    async editProfile(@CurrentUser() currentUser: User, @Args('input') editProfileInput: EditProfileInput): Promise<EditProfileOutput> {
        try {
            await this.usersService.editProfile(currentUser.id, editProfileInput);

            return {
                ok: true,
            };
        } catch (error) {
            return {
                ok: false,
                error,
            };
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => DeleteAccountOutput)
    async deleteAccount(@CurrentUser() currentUser: User): Promise<DeleteAccountOutput> {
        try {
            await this.usersService.deleteAccount(currentUser.id);

            return {
                ok: true,
            };
        } catch (error) {
            return {
                ok: false,
                error,
            };
        }
    }
}
