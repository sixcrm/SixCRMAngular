import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import { HttpResponse} from '@angular/common/http';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';
import {downloadJSON} from '../../utils/file.utils';
import {extractData, HttpWrapperService, generateHeaders} from '../http-wrapper.service';
import {MerchantReport} from '../../models/analytics/merchant-report.model';
import {merchantReportListQuery} from '../../utils/queries/reports.queries';

@Injectable()
export class MerchantReportService {

  merchants$: Subject<MerchantReport[]>;

  constructor(private authService: AuthenticationService, private http: HttpWrapperService) {
    this.merchants$ = new Subject();
  }

  getMerchants(start: string, end: string, filters: FilterTerm[], download?: boolean, limit?: number, offset?: number, order?: string) {
    this.queryRequest(merchantReportListQuery(start, end, filters, download, limit, offset, order), download).subscribe(
      (data) => {
        if (!download) {
          let merchants = extractData(data).analytics.records;

          if (merchants) {
            this.merchants$.next(merchants.map(merchant => new MerchantReport(merchant)))
          }
        } else {
          downloadJSON(data.body, 'merchants-report.json');
        }
      })
  }

  private queryRequest(query: string, download: boolean): Observable<HttpResponse<any>> {
    let endpoint = environment.endpoint;

    if (this.authService.getActingAsAccount()) {
      endpoint += this.authService.getActingAsAccount().id;
    } else if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
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
