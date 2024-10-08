import { DataSet, DataSource } from '@adapt/types';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UserService } from '../../../auth/services/user/user.service';
import { AdaptDataService } from '../../../services/adapt-data.service';
import { RecentActivityService } from '../../../services/recent-activity.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'adapt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public dataSources = this.data.getDataSources();
  public dataViews = this.data.getDataViews();
  public reports = this.data.getReports();
  private $reports: any[] = [];
  private $dataViews: any[] = [];

  loadingReports = true;
  loadingDataViews = true;

  private reportSubscription: Subscription;
  private dataViewSubscription: Subscription;

  public recentActivity = this.recent.history;

  constructor(
    public user: UserService,
    public route: ActivatedRoute,
    private router: Router,
    public data: AdaptDataService,
    public recent: RecentActivityService,
    private metaService: Meta
  ) {
    this.reportSubscription = this.reports.subscribe((reports) => {
      this.loadingReports = false;
      // sort by updated field, latest at top
      this.$reports = reports.sort((a, b) => {
        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
      });
    });
    this.dataViewSubscription = this.dataViews.subscribe((views) => {
      this.loadingDataViews = false;
      // sort by created field, latest at top
      this.$dataViews = views.sort((a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });
    });

    this.route.params.subscribe(params => {
      if('slug' in params){
        this.data.loadSharedReport(params['slug'] as string)
        .subscribe(result => {

          this.router.navigate(['admin', 'reports', result.reportID], {queryParams: {...result.filters, version: 'draft'}})

        })
      }
    })

  }

  public getImpactAnalysisForView(view: DataSet) {
    return this.$reports.filter((report) => report.dataSetID === view.dataSetID).length;
  }

  public getImpactAnalysisForSource(source: DataSource) {
    const dataViews = this.$dataViews.filter((item: DataSet) =>
      item?.dataSources?.some((dataSourceItem) => dataSourceItem.dataSource === source.dataSourceID)
    );
    return {
      dataViewCount: dataViews.length,
      reportCount: this.$reports.filter((report) => dataViews.some((dataset) => dataset.dataSetID === report.dataSetID))
        .length,
    };
    //

    // return this.$dataViews.pipe(
    //   switchMap(
    //     (views) =>{

    //       return zip(dataViews.map(vt => this.getImpactAnalysisForView(vt)))
    //       .pipe(map(val => ({dataViewCount: dataViews.length, reportCount: val.reduce((accum, count) => accum + count, 0)})))

    //     }

    // ))
  }

  ngOnInit() {
    // Can update these variables with dynamical content pulled from the database if needed

    const description = 'A free tool for reporting IDEA data, fully accessible to individuals with disabilities.';

    this.metaService.updateTag({ name: 'description', content: description });
  }
}
