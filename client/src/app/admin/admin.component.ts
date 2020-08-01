import Locales from '@locales/admin';
import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColumnType, EventType } from '../component/ft-table.component';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.less']
})
export class AdminComponent extends AppBaseDirective {
  Locales = Locales;
  users: User[];
  frmGroup: FormGroup;

  colRef: any;
  cols: ColumnType[] = [
    { field: 'username', header: 'Username', width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'firstname', header: 'First', width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'lastname', header: 'Last', width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'email', header: 'Email', width: 200, validators: [Validators.required, Validators.email, Validators.maxLength(100)] },
    { field: 'phonenumber', header: 'Phone', width: 150, validators: [Validators.maxLength(100)] },
    { field: 'role', header: 'Role', width: 100 },
    { field: 'isActive', header: 'Active', width: 70 },
    { field: 'resetPassword', header: 'Reset Password', width: 90},
    { field: 'whoModified', header: 'Who Modified', width: 80 },
    { field: 'modifiedDate', header: 'Modified Date', width: 200, format: 'date' }
  ];

  constructor(changeDetector: ChangeDetectorRef, private userService: UserService, public appService: AuthService) {
    super(changeDetector);
    const fields = {};
    this.colRef = {};
    Object.values(this.cols).forEach(params => {
      fields[params.field] = new FormControl(null, params.validators);
      this.colRef[params.field] = params;
    });
    this.frmGroup = new FormGroup(fields);
  }

  eventTableHandler(event: any) {
    switch (event.message) {
      case EventType.Load:
        this.loading(true);
        this.userService.getUser(0, 20, 'username').subscribe(users => {
          this.loading(false);
          this.users = users;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}
