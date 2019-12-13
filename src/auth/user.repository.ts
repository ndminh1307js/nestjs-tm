import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentialsDTO;

    const existedUser = await this.findOne({ username });

    if (existedUser) {
      throw new ConflictException('This username already in use.');
    }

    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(password);
    await user.save();
  }

  async validateUserPassword(
    authCredentialsDTO: AuthCredentialsDTO
  ): Promise<object> {
    const { username, password } = authCredentialsDTO;

    const user = await this.findOne({ username });

    if (!user) {
      throw new NotFoundException('This username does not exist.');
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      throw new UnauthorizedException('Password is wrong.');
    }

    return { username };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 8);
  }
}
