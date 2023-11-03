import mustache from 'mustache';

interface ITemplateVariable {
  [key: string]: string | number;
}

export interface IParseMailTemplate {
  template: string;
  variables: ITemplateVariable;
}


export class MustacheMailTemplate {

  public parse({ template, variables }: IParseMailTemplate): string {
    return mustache.render(template, variables);
  }
}