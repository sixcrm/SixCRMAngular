import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {affiliateReportListQuery, affiliteReportSummaryQuery} from '../../utils/queries/reports.queries';
import { Response} from '@angular/http';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';
import {downloadJSON} from '../../utils/file.utils';
import {extractData, HttpWrapperService, generateHeaders} from '../http-wrapper.service';
import {AffiliateReport} from '../../models/analytics/affiliate-report.model';

@Injectable()
export class AffiliateReportService {

  affiliates$: Subject<AffiliateReport[]>;
  affiliateSummary$: Subject<AffiliateReport>;

  constructor(private authService: AuthenticationService, private http: HttpWrapperService) {
    this.affiliates$ = new Subject();
    this.affiliateSummary$ = new Subject();
  }

  getAffiliatesReport(start: string, end: string, filters: FilterTerm[], download?: boolean, limit?: number, offset?: number, order?: string) {
    this.queryRequest(affiliateReportListQuery(start, end, filters, download, limit, offset, order), download).subscribe(
      (data) => {
        if (!download) {
          let affiliates = extractData(data).affiliatereport.affiliates;

          if (affiliates) {
            this.affiliates$.next(affiliates.map(affiliate => new AffiliateReport(affiliate)))
          }
        } else {
          downloadJSON(data.json(), 'affiliate-details-report.json');
        }
      })
  }

  getAffiliatesSummary(start: string, end: string, filters: FilterTerm[], download?: boolean) {
    this.queryRequest(affiliteReportSummaryQuery(start, end, filters), download).subscribe(
      (data) => {
        if (!download) {
          let affiliateSummary = extractData(data).affiliatereportsummary;

          if (affiliateSummary) {
            this.affiliateSummary$.next(new AffiliateReport(affiliateSummary));
          }
        } else {
          downloadJSON(data.json().response, 'transaction-summary-total-report.json');
        }
      })
  }

  private queryRequest(query: string, download: boolean): Observable<Response> {
    let endpoint = environment.endpoint;

    if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    if (download) {
      endpoint += '?download=json';
    }

    return this.http.post(endpoint, query, { headers: generateHeaders(this.authService.getToken())});
  }
}
