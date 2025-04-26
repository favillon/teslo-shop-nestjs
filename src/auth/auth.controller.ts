import { Controller, Get, Post, Body, UseGuards,  SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser, GetRawHeaders } from './decorators/';
import { User } from './entities/users.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { GetRoleProtected } from './decorators/get-role-protected.decorator';
import { ValidRoles } from './interfaces/valid-rolres.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @UseGuards( AuthGuard() )
  checkStatus(
    //@Req() request: Express.Request
    @GetUser() user : User,
    @GetUser('email') userEmail : string,
    @GetRawHeaders() rawHeaders : string[],
  ) {
    //console.log({ user: request.user }); //usando con @Req()

    return {
      ok: true,
      message: 'Ok',
      user,
      userEmail,
      rawHeaders
    }
  }
  /*
   * Forma que puede causar muchos problemas por que roles  y el array es susceptible a cambios o errores typo
   * mal escrito, espacios, etc
  */
  @Get('check-role')
  @SetMetadata('roles', ['admin', 'super'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  checkRole(
    //@Req() request: Express.Request
    @GetUser() user : User,
    @GetUser('email') userEmail : string,
    @GetRawHeaders() rawHeaders : string[],
  ) {
    //console.log({ user: request.user }); //usando con @Req()

    return {
      ok: true,
      message: 'Ok - Susectible a errores',
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('check-role-optimo')
  @GetRoleProtected(ValidRoles.ADMIN)
  @UseGuards( AuthGuard(), UserRoleGuard )
  checkRoleOptimo(
    @GetUser() user : User,
    @GetUser('email') userEmail : string,
    @GetRawHeaders() rawHeaders : string[],
  ) {

    return {
      ok: true,
      message: 'Ok - Mayor control pero con el problema de recordar lo decoradores y el orden de los decoradores y el manejo de los roles',
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('check-role-correct')
  @Auth(ValidRoles.ADMIN)
  checkRoleCorrect(
    @GetUser() user : User
  ) {

    return {
      ok: true,
      message: 'Ok - Mayor control pero con el problema de recordar lo decoradores y el orden de los decoradores y el manejo de los roles',
      user
    }
  }
}
