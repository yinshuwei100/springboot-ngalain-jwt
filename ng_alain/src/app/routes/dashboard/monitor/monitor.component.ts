import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { zip } from 'rxjs';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-dashboard-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMonitorComponent implements OnInit, OnDestroy {
  data: any = {};
  tags = [];
  loading = true;
  q: any = {
    start: null,
    end: null,
  };

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    zip(this.http.get('/chart'), this.http.get('/chart/tags')).subscribe(
      ([res, tags]: [any, any]) => {
        console.log("tags length "+ (Math.floor(Math.random() * tags.list.length) + 1));
        this.data = res;
        tags.list[
          Math.floor(Math.random() * tags.list.length) + 1
        ].value = 1000;
        this.tags = tags.list;
        this.loading = false;
        this.cd.detectChanges();
      },
    );

    // active chart
    this.genActiveData();
    this.activeTime$ = setInterval(() => this.genActiveData(), 1000 * 2);
  }

  // region: active chart

  activeTime$: any;

  activeYAxis = {
    tickCount: 3,
    tickLine: false,
    labels: false,
    title: false,
    line: false,
  };

  activeData: any[] = [];

  activeStat = {
    max: 0,
    min: 0,
    t1: '',
    t2: '',
  };

  genActiveData() {
    const activeData = [];
    for (let i = 0; i < 24; i += 1) {
      activeData.push({
        x: `${i.toString().padStart(2, '0')}:00`,
        y: i * 50 + Math.floor(Math.random() * 200),
      });
    }
    this.activeData = activeData;
    // stat
    this.activeStat.max = [...activeData].sort()[activeData.length - 1].y + 200;
    this.activeStat.min = [...activeData].sort()[
      Math.floor(activeData.length / 2)
    ].y;
    this.activeStat.t1 = activeData[Math.floor(activeData.length / 2)].x;
    this.activeStat.t2 = activeData[activeData.length - 1].x;
    this.cd.detectChanges();
  }

  // endregion

  couponFormat(val: any) {
    switch (parseInt(val, 10)) {
      case 20:
        return '差';
      case 40:
        return '中';
      case 60:
        return '良';
      case 80:
        return '优';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    if (this.activeTime$) clearInterval(this.activeTime$);
  }
}
