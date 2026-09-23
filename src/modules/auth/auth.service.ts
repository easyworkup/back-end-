import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Регистрация/логин, JWT access + refresh (refresh-токены — в Redis).
 * TODO: passport-jwt стратегии, guards, хэширование пароля (argon2/bcrypt).
 */
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(_email: string, _password: string) {
    throw new Error("Not implemented");
  }

  async login(_email: string, _password: string) {
    throw new Error("Not implemented");
  }
}
