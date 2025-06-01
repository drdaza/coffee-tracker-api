import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRawRequestHeaders = createParamDecorator((header: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    let returnStatement = null;

    if (header) {
        console.log(request.headers);
        returnStatement = request.headers[header];
        console.log(returnStatement);
    } else {
        returnStatement = request.headers;
    }
    return returnStatement;
});