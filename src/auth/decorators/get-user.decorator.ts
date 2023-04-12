import { ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common';


export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext )=>{

    const  req = ctx.switchToHttp().getRequest();
    const  user = req.user;

    if(!user) {
      throw new InternalServerErrorException('User not found');
    }
    
    // si la data no existe return todo el objeto user, si hay data return user[data]
    // user[data] es como decir user[lo que sea que venga en la data] 
    // ejemplo: user[email] = user.email 
    return (!data) ? user : user[data];
  }
)