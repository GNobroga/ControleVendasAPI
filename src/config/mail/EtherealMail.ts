import nodemailer from 'nodemailer';
import { IParseMailTemplate, MustacheMailTemplate } from './MustacheMailTemplate';

interface IMailContact {
  name: string;
  email: string;
}

interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;

}

export default class EtheralMail {

  public static async sendEmail({ to, from, subject, templateData }: ISendMail) {
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
    const message = await transporter.sendMail({
      from: {
        name: from?.name || 'Equipe API Vendas',
        address: from?.email || 'equipe@vendas.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: new MustacheMailTemplate().parse(templateData),
    })

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }

}