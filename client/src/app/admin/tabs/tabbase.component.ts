import Locales from '@locales/admin';
import { AppBaseDirective } from 'src/app/app.base.component';
import { Input, Directive } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ColumnType } from 'src/app/component/ft-table/ft-table.component';
import { User } from 'src/modules/models/user';

@Directive()
export abstract class TabBaseDirective extends AppBaseDirective {
    Locales = Locales;
    formGroup: FormGroup;
    controls: ColumnType[];

    @Input() user: User;

    constructor(private confirmationService: ConfirmationService) {
        super();
    }

    abstract doDelete(): void;

    onDelete() {
        this.confirmationService.confirm({
            key: 'deleteRecord',
            header: Locales.deleteHeader,
            message: Locales.deleteRecord,
            accept: () => {
                this.doDelete();
            }
        });
    }
}
