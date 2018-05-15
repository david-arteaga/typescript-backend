import { RequestHandler, Request, Response, NextFunction } from "express";

export const catch_async = (handler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next)
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  }

export const validateRequiredFields = (object: Object, fields: string[]) => {
  const fieldsMissing: string[] = []
  fields.forEach(field => {
    if (!object.hasOwnProperty(field)) {
      fieldsMissing.push(field)
    }
  })
  if (fieldsMissing.length === 0) {
    return false
  }
  return fieldsMissing
}

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
export const isValidEmail = (email: any) =>
{
  if (!email)
    return false;
    
  if(email.length>254)
    return false;

  var valid = emailRegex.test(email);
  if(!valid)
    return false;

  // Further checking of some things regex can't handle
  var parts = email.split("@");
  if(parts[0].length>64)
    return false;

  var domainParts = parts[1].split(".");
  if(domainParts.some(function(part: any) { return part.length>63; }))
    return false;

  return true;
}
