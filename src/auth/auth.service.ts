import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData } = await this.userRepository.save(createUserDto); // no es la insercion

      const user = await this.userRepository.save({
        ...userData,
        password: bcrypt.hashSync(password, 10), // encripta la contraseña
      });
      delete (user as Partial<User>).password;

      return {
        ...user,
        token : this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true,  password: true,  roles: true}
    });

    if ( !user )
      throw new UnauthorizedException('Credentials are not valid b');
    console.log({user, email, password });

    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid a');
    delete (user as Partial<User>).password;

    return {
      ...user,
      token : this.getJwtToken({ id: user.id })
    };
  }

  async checkAuthStatus (user: User) {
    return {
      ...user,
      token : this.getJwtToken({ id: user.id })
    };
  }


  private getJwtToken( payload : JwtPayload) {
    return this.jwtService.sign( payload );
  }

  private handleDBErrors( error: any ): never {

    if ( error.code === '23505' )
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }
}
