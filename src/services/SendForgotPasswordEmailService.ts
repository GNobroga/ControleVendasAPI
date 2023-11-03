import { UserToken as tokenRepository } from "../entities/UserToken";
import { User as userRepository } from "../entities/User";
import HandleError from "../shared/errors/HandleError";
import EtheralMail from "../config/mail/EtherealMail";
import fs from 'fs/promises';
import path from "path";

interface IRequest {
  email: string;
}

export default class ForgotPasswordEmailService {

  public async execute({ email }: IRequest) {
    if (await this.existsEmail(email)) {
      const user = (await userRepository.findAll({ where: { email }}))[0].dataValues;
      const token = await tokenRepository.create({ user_id: user.id });

      const template = await fs.readFile(path.resolve('src', 'views', 'forgot_password.html'), 'utf-8');

      EtheralMail.sendEmail({
        to: {
          email,
          name: user.name,
        },
        templateData: {
          template,
          variables: { 
            name: user.name, 
            link: `http://localhost:3000/reset_password?code=${token.id}` },
        },
        subject: '[API Vendas] Recuperação de Senha',
      })
      return token.id;
    }

    throw new HandleError('User does not exists');
  }

  public async existsEmail(email: string) {
    return (await userRepository. 
      findAll({ where: { email }}))
      .length > 0;
  }
}