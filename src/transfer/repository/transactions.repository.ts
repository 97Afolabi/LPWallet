import { EntityRepository, Repository } from "typeorm";
import { Transactions } from "../entities/transactions.entity";

@EntityRepository(Transactions)
export class TransactionsRepository extends Repository<Transactions> {}
