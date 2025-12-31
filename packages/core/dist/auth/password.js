import bcrypt from 'bcryptjs';
export class PasswordService {
    static SALT_ROUNDS = 12;
    static async hash(password) {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }
    static async verify(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}
