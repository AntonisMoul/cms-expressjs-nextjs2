export declare class PasswordService {
    private static readonly SALT_ROUNDS;
    static hash(password: string): Promise<string>;
    static verify(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=password.d.ts.map