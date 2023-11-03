import { UserToken as tokenRepository } from "../entities/UserToken";
import { User as userRepository } from "../entities/User";
import HandleError from "../shared/errors/HandleError";
import { addHours, isAfter } from 'date-fns';

interface IRequest {
  key: string;
  password: string;
}

export default class ResetPasswordService {

  public async execute({ key, password, }: IRequest) {
    let userTokenList = await tokenRepository.findAll({ where: { id: key }});

    if (!userTokenList.length) {
      throw new HandleError('User token does not exists', 401);
    }

    const userToken = userTokenList[0].dataValues;

    const user = await userRepository.findByPk(userToken.user_id);

    if (!user) {
      throw new HandleError('User does not exists', 401);
    }

    const tokenCreatedAt = <Date> userToken.createdAt;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new HandleError('Token expired.');
    }

    // Setando a senha
    user.password = password;

    return await user.save();
  }

  public async existsEmail(email: string) {
    return (await userRepository. 
      findAll({ where: { email }}))
      .length > 0;
  }
}