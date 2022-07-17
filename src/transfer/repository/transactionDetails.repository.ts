import { EntityRepository, Repository } from "typeorm";
import { TransactionDetails } from "../entities/transactionDetails.entity";

@EntityRepository(TransactionDetails)
export class TransactionDetailsRepository extends Repository<TransactionDetails> {}
