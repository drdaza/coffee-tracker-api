import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRawRequestHeaders = createParamDecorator((header: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (header) {
       return request.headers[header];
    } 
    return request.headers;
});