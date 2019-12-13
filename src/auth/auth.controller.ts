import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from 'src/joi-validation.pipe';
import { AuthSchema } from './auth-validation.schema';

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
  async signIn(@Body() authCredentialsDTO: AuthCredentialsDTO) {
    return this.authService.signIn(authCredentialsDTO);
  }
}
