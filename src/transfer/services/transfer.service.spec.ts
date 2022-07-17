import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { TransferService } from "./transfer.service";
import { UserRepository } from "../../users/repository/user.repository";
import { WalletRepository } from "../repository/wallet.repository";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TransactionDetailsRepository } from "../repository/transactionDetails.repository";
import { TransactionsRepository } from "../repository/transactions.repository";
import { MailService } from "../../mail/services/mail.service";

describe("TransferService", () => {
    let service: TransferService;

    const mockUserRepository = {
        save: (user) =>
            Promise.resolve({
                id: faker.datatype.uuid(),
                user,
            }),
        update: (user) =>
            Promise.resolve({
                id: faker.datatype.uuid(),
                user,
            }),
        findOne: (user: unknown) =>
            Promise.resolve({
                // id: faker.datatype.uuid(),
                // ...registrationDto,
            }),
        verifyPassword: () => {
            return true;
        },
    };

    const mockWalletRepository = {
        save: () => {},
    };

    const mockTransactionsRepository = {
        save: () => {},
    };

    const mockTransactionDetailsRepository = {
        save: () => {},
    };

    const mockEventEmitter: any = {
        emit: (activateAccount) => true,
    };

    const mockMailService = {
        confirmationMail: (
            email: string,
            fullName: string,
            token: string,
        ) => {},
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransferService,
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: WalletRepository,
                    useValue: mockWalletRepository,
                },
                {
                    provide: TransactionsRepository,
                    useValue: mockTransactionsRepository,
                },
                {
                    provide: TransactionDetailsRepository,
                    useValue: mockTransactionDetailsRepository,
                },
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter,
                },
                {
                    provide: MailService,
                    useValue: mockMailService,
                },
            ],
        }).compile();

        service = module.get<TransferService>(TransferService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
