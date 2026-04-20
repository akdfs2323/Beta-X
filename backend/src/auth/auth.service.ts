import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const existing = await this.usersService.findOneByUsername(authDto.username);
    if (existing) {
      throw new ConflictException('Username already takes');
    }
    
    // First user is automatically ADMIN for simplicity in this take-home
    const isFirstUser = (await this.usersService.findOneByUsername('admin')) === null && authDto.username === 'admin';
    const role = isFirstUser ? Role.ADMIN : Role.USER;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(authDto.password, salt);

    const user = await this.usersService.create({
      username: authDto.username,
      passwordHash,
      role
    });

    return this.login(user); // auto login
  }

  async loginFull(authDto: AuthDto) {
    const user = await this.usersService.findOneByUsername(authDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(authDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.login(user);
  }

  private login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      username: user.username
    };
  }
}
