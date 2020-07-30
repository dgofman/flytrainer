import Locales from '@locales/dashboard';
import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { AuthService } from '../authentication/auth.service';
import { environment } from '@client/environments/environment';
import { AppBaseComponent } from '../app.base.component';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.less']
})
export class DashboardComponent extends AppBaseComponent {
  Locales = Locales;
  postRequestResponse: string;
  expandedRows = {};
  loggedUser: User = new User();
  users: User[];
  toggleArroMenu: boolean;

  company: string;
  phone: string;

  frmGroup: FormGroup;

  cols = [
    { field: 'id', header: 'ID', width: 50 },
    { field: 'username', header: 'Username', width: 150, edit: 'input', validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'firstname', header: 'First', width: 150, edit: 'input', validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'lastname', header: 'Last', width: 150, edit: 'input', validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'email', header: 'Email', width: 200, edit: 'input', validators: [Validators.required, Validators.email, Validators.maxLength(100)] },
    { field: 'phonenumber', header: 'Phone', width: 150, edit: 'input', validators: [Validators.maxLength(100)] },
    { field: 'role', header: 'Role', width: 100, edit: 'dropdown' },
    { field: 'isActive', header: 'Active', width: 70, edit: 'check' },
    { field: 'resetPassword', header: 'Reset Password', width: 90, edit: 'check' },
    { field: 'whoModified', header: 'Who Modified', width: 80 },
    { field: 'modifiedDate', header: 'Modified Date', width: 200, format: 'date' }
  ];

  public itemsPerPageList: SelectItem[] = [
    { label: '15', value: 15 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: 'All', value: -1 }];
  itemsPerPage = 25;
  firstRow = 0;
  sortDirection = 'asc';
  sortField = 'username';
  filterQuery: string;
  filterFieldName: string;

  constructor(changeDetector: ChangeDetectorRef, private userService: UserService, public appService: AuthService) {
    super(changeDetector);
    this.company = environment.company;
    this.phone = environment.phone;
    const auth = JSON.parse(sessionStorage.getItem('auth_data'));
    this.loggedUser = new User(auth);

    const fields = {};
    Object.values(this.cols).forEach(params => {
      fields[params.field] = new FormControl(null, params.validators);
    });
    this.frmGroup = new FormGroup(fields);
  }

  lazyLoad(event: any) {
    this.loading(true);
    this.sortField = event.sortField;
    this.sortDirection = event.sortField == null || event.sortOrder > 0 ? 'asc' : 'desc';
    this.expandedRows = {};
    this.userService.getUser(0, 20, 'username').subscribe(users => {
      this.loading(false);
      this.users = users;
    }, (ex) => this.errorHandler(ex));
  }

  get editableFields(): any {
    return this.cols.filter(item => item.edit);
  }

  formatData(col: any, rowData: any) {
    const data = rowData[col.field];
    switch (col.format) {
      case 'date':
        return new DatePipe('en-US').transform(data * 1000, 'medium');
      default:
        return data;
    }
  }
}
