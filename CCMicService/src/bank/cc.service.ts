import { Injectable } from "@nestjs/common";
import { EventPublisher, ICommand } from "@nestjs/cqrs";
import { Service } from "common";
import { CreditCardAgg } from "./cc.account.aggregate";
import { Transaction } from "./models";

@Injectable()
export class CreditCardService {
    constructor(
        private readonly _service: Service<CreditCardAgg>
    ) { }

    public async activate(id: string, tenantId?: string) {
        const creditcard = await this._service.Get(CreditCardAgg, id, tenantId);
        const result = creditcard.activate();
        if (result.success) {
            await this._service.Save(creditcard);
        }
        return result;
    }

    public async deactivate(id: string, tenantId?: string) {
        const creditcard = await this._service.Get(CreditCardAgg, id, tenantId);
        const result = creditcard.disable();
        if (result.success) {
            await this._service.Save(creditcard);
        }
        return result;
    }

    public async transaction(id: string, transaction: Transaction) {
        const creditcard = await this._service.Get(CreditCardAgg, id);
        const result = creditcard.transaction(transaction);
        if (result.success) {
            await this._service.Save(creditcard);
        }
        return result;
    }
}