import { UsersService } from './service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): {
        success: boolean;
        data: import("./entities/user.entity").User[];
        message: string;
    };
    search(q: string): {
        success: boolean;
        data: import("./entities/user.entity").User[];
        message: string;
    };
    getPending(): {
        success: boolean;
        data: import("./entities/user.entity").User[];
        message: string;
    };
    getApproved(): {
        success: boolean;
        data: import("./entities/user.entity").User[];
        message: string;
    };
    getRejected(): {
        success: boolean;
        data: import("./entities/user.entity").User[];
        message: string;
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/user.entity").User;
        message: string;
    };
    create(dto: CreateUserDto): {
        success: boolean;
        data: import("./entities/user.entity").User;
        message: string;
    };
    register(dto: CreateUserDto): {
        success: boolean;
        data: import("./entities/user.entity").User;
        message: string;
    };
    signIn(body: {
        email: string;
        password: string;
        role: string;
    }): {
        success: boolean;
        data: null;
        message: string;
    } | {
        success: boolean;
        data: import("./entities/user.entity").User;
        message: string;
    };
    update(id: string, dto: UpdateUserDto): {
        success: boolean;
        data: import("./entities/user.entity").User;
        message: string;
    };
    approve(id: string): {
        success: boolean;
        data: import("./entities/user.entity").User;
        message: string;
    };
    reject(id: string): {
        success: boolean;
        data: import("./entities/user.entity").User;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        data: null;
        message: string;
    };
}
