import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { envs } from "src/config";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "../interfaces";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: envs.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const { id } = payload;
        const user = await this.usersService.findOneById(id);
        if (!user) {
            throw new UnauthorizedException('Token is invalid');
        }
        if (user.deleted) {
            throw new UnauthorizedException('User is not active');
        }
        return user;
    }
}