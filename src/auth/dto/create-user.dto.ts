import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        example: 'email@test.com',
        description: 'Email of the user'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'SUPERSECRETPASSWORD',
        description: 'Password of the user (6+ characters) with at least one uppercase letter, one lowercase letter and one number'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        example: 'Pepito Perez',
        description: 'Full name of the user'
    })
    @IsString()
    @MinLength(1)
    fullName: string;
}
