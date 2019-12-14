import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Req
} from '@nestjs/common';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from 'src/joi-validation.pipe';
import { AuthSchema } from './auth-validation.schema';
import { PublicUser } from './interfaces/public-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(new JoiValidationPipe(AuthSchema))
  async signUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  @UsePipes(new JoiValidationPipe(AuthSchema))
  async signIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
