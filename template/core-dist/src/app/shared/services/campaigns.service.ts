import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Campaign} from '../models/campaign.model';
import {Http, Headers} from "@angular/http";
import {campaignsInfoListQuery, campaignQuery} from '../utils/query-builder';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';

@Injectable()
export class CampaignsService {

  campaigns$: Subject<Campaign[]>;
  campaign$: Subject<Campaign>;
  campaignsSuggestions$: Subject<string[]>;

  constructor(private http: Http, private authService: AuthenticationService) {
    this.campaigns$ = new Subject<Campaign[]>();
    this.campaign$ = new Subject<Campaign>();
    this.campaignsSuggestions$ = new Subject<string[]>();
  }

  getCampaigns(): void {
    this.http.post(environment.endpoint, campaignsInfoListQuery(), { headers: this.generateHeaders() })
      .subscribe(
        (data) => {
          let campaignData = data.json().data.campaignlist.campaigns;
          this.campaigns$.next(campaignData.map(campaign => new Campaign(campaign)));
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getCampaign(id: string): void {
    this.http.post(environment.endpoint, campaignQuery(id), { headers: this.generateHeaders() })
      .subscribe(
        (data) => {
          let campaignData = data.json().data.campaign;
          this.campaign$.next(new Campaign(campaignData));
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }
}
