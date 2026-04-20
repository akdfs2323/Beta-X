import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(authDto: AuthDto): Promise<{
        access_token: string;
        role: any;
        username: any;
    }>;
    loginFull(authDto: AuthDto): Promise<{
        access_token: string;
        role: any;
        username: any;
    }>;
    private login;
}
