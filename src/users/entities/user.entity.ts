import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entitiy';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsString } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column()
    @Field(type => String)
    password: string;

    @Column()
    @Field(type => String)
    @IsString()
    username: string;

    @Column({ nullable: true })
    @Field(type => String)
    @IsString()
    profileImg: string;


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            console.log(ok)
            return ok;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}