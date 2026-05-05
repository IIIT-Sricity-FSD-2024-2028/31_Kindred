import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private users;
    private counter;
    private generateId;
    findAll(): User[];
    findById(id: string): User;
    findByEmail(email: string): User | null;
    search(q: string): User[];
    getPending(): User[];
    getApproved(): User[];
    getRejected(): User[];
    create(dto: CreateUserDto): User;
    update(id: string, dto: UpdateUserDto): User;
    approve(id: string): User;
    reject(id: string): User;
    delete(id: string): boolean;
    signIn(email: string, password: string, role: string): User | null;
}
