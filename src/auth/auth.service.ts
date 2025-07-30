import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/entities/user/user.service';
import { LoginInput } from './login.schema';
import { RegisterWithCompanyInput } from './register.schema';
import { CompanyService } from 'src/entities/company/company.service';
import { UserRole } from 'src/entities/user/user.entity';
import { validateUniqueField } from 'src/common/validators/uniqueName.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company/company.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private userService: UserService,
    private companyService: CompanyService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterWithCompanyInput) {
    await validateUniqueField(
      this.companyRepo,
      { name: data.companyName },
      'Company name',
    );
    const company = await this.companyService.create({
      name: data.companyName,
      location: data.companyLocation,
    });
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userService.createNewOwner({
      name: data.name,
      username: data.username,
      password: hashedPassword,
      role: UserRole.OWNER,
      companyId: company.id,
    });
    return this.signToken(user.id, user.username, user.role, user.companyId);
  }

  async login(data: LoginInput) {
    const user = await this.userService.getByUsername(data.username, true);
    const valid = user && (await bcrypt.compare(data.password, user.password));

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.username, user.role, user.companyId);
  }

  private async signToken(
    userId: string,
    username: string,
    role: string,
    companyId: string,
  ) {
    const payload = { sub: userId, username, role, companyId };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
