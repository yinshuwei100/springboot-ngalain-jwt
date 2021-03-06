import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {ProBasicListEditComponent} from './edit/edit.component';

@Component({
  selector: 'app-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: ['./basic-list.component.less'],
})
export class ProBasicListComponent implements OnInit {
  q: any = {
    status: 'all',
  };
  loading = false;
  data: any[] = [];
  pageIndex = 1;
  pageSize = 5;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modal: ModalHelper,
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    console.log("nzPageIndex is " + this.pageIndex);
    this.loading = true;
    this.http.get('/api/list?pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize, {count: 5}).subscribe((res: any) => {
      console.log('basic list res is '+JSON.stringify(res));
      this.data = res;
      this.loading = false;
    });
  }

  openEdit(record: any = {}) {
    console.log('open edit, record is ' + JSON.stringify(record));
    this.modal
      .create(ProBasicListEditComponent, {record}, {size: 'md'})
      .subscribe(res => {
        if (record.id) {
          record = Object.assign(record, {id: 'mock_id', percent: 0}, res);
        } else {
          this.data.splice(0, 0, res);
          this.data = [...this.data];
        }
      });
  }
}
