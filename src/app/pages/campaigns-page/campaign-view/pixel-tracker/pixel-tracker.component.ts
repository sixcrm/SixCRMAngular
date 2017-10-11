import {Component, OnInit, Input} from '@angular/core';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'pixel-tracker',
  templateUrl: './pixel-tracker.component.html',
  styleUrls: ['./pixel-tracker.component.scss']
})
export class PixelTrackerComponent implements OnInit {

  @Input() campaignId: string;
  accountId: string;
  endpoint: string = `"${environment.bareEndpoint}"`;
  parsedCampaignId: string;
  key: string = '"1ud98uhc9h989811ud01yd81u2d1289duu1du1a0d9uula"';
  secretKey: string = '"c3VwZXIudXNlckB0ZXN0LmNvbQ=="';

  scriptContent: string;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.accountId = `"${this.authService.getActiveAcl().account.id}"`;
    this.parsedCampaignId = `"${this.campaignId}"`;
    this.scriptContent = `<script>\naffiliateId="";\ndocument.addEventListener("DOMContentLoaded",function(){var e=new RegExp("[\\?&]sixcrm-affiliate_id=([^&#]*)").exec(location.href),t=document.head.querySelector("meta[name='sixcrm-affiliate_id']"),a=("; "+document.cookie).split("; sixcrm-affiliate_id="),i=2===a.length?a.pop().split(";").shift():"",n=e?e[1]:t?t.content:affiliateId||i,o=new Date;o.setTime(o.getTime()+864e5),document.cookie="sixcrm-affiliate_id="+n+"; expires="+o.toUTCString()+"; path=/",function(e){var t=Date.now(),a=${this.key}+":"+t+":"+sha1(${this.secretKey}+t),i=new XMLHttpRequest;i.open("POST",${this.endpoint}+"token/acquire/"+${this.accountId},!0),i.setRequestHeader("Authorization",a),i.onreadystatechange=function(){if(4===i.readyState&&200===i.status){var t=JSON.parse(i.responseText).response;e(t)}},i.send('{"campaign":"'+${this.parsedCampaignId}+'","affiliates":{"affiliate":"'+n+'"}}')}(function(e){var t=new XMLHttpRequest;t.open("POST",${this.endpoint}+"tracking/"+${this.accountId},!0),t.setRequestHeader("Authorization",e),t.onreadystatechange=function(){if(4===t.readyState&&200===t.status){var e=JSON.parse(t.responseText).response.trackers;if(e&&e.length>0)for(var a,i=0;i<e.length;i++)(a=document.createElement("div")).innerHTML=e[i].body,document.body.appendChild(a)}},t.send('{"campaign":"'+${this.parsedCampaignId}+'","affiliate_id":"'+n+'"}')})},!1);\n</script>`
  }

  copyScriptToClipboard(script): void {
    script.select();
    document.execCommand('copy');
  }

}
