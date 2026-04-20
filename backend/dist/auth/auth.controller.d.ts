import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(authDto: AuthDto): Promise<{
        access_token: string;
        role: any;
        username: any;
    }>;
    login(authDto: AuthDto): Promise<{
        access_token: string;
        role: any;
        username: any;
    }>;
}
