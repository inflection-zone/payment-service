import { RequestDto } from "./request.dto";

export interface ResponseDto {
    Status          : string;
    Message         : string;
    HttpCode        : number;
    Data?           : any;
    Trace?          : string[];
    Request?        : RequestDto;
    APIVersion      : string;
    ServiceVersion  : string;
}
