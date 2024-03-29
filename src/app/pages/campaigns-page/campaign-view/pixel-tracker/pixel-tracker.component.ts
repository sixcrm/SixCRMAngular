import {Component, OnInit, Input, ViewChild, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {environment} from '../../../../../environments/environment';
import 'codemirror/mode/javascript/javascript';


@Component({
  selector: 'pixel-tracker',
  templateUrl: './pixel-tracker.component.html',
  styleUrls: ['./pixel-tracker.component.scss']
})
export class PixelTrackerComponent implements OnInit, OnDestroy {

  @ViewChild('codemirror') codemirror;

  @Input() campaignId: string;

  accountId: string;
  endpoint: string = environment.bareEndpoint;

  scriptContent: string;

  config = {
    mode: {
      name: "javascript"
    },
    readOnly: true
  };

  showScript: boolean;

  constructor(private authService: AuthenticationService) { }

  displayCodemirror() {
    this.accountId = `${this.authService.getActiveAcl().account.id}`;
    this.scriptContent = `<script>\nfunction getAffiliateId(){var e=new RegExp("[\\?&]affiliate_id=([^&#]*)").exec(location.href),t=document.head.querySelector("meta[name='affiliate_id']"),i=("; "+document.cookie).split("; affiliate_id="),a=2===i.length?i.pop().split(";").shift():"",n=e?e[1]:t?t.content:affiliateId||a,o=new Date;return o.setTime(o.getTime()+864e5),document.cookie="affiliate_id="+n+"; expires="+o.toUTCString()+"; path=/",n}function getTrackers(e){var t=new XMLHttpRequest;t.open("POST","${this.endpoint}tracking/${this.accountId}",!0),t.setRequestHeader("Authorization",e),t.onreadystatechange=function(){if(4===t.readyState&&200===t.status){var e=JSON.parse(t.responseText).response.trackers;if(e&&e.length>0)for(var i,a=0;a<e.length;a++)(i=document.createElement("div")).innerHTML=e[a].body,document.body.appendChild(i)}},t.send('{"campaign":"${this.campaignId}","affiliate_id":"'+getAffiliateId()+'"}')}\n</script>`;
    this.showScript = true;
  }

  ngOnInit() { }

  ngOnDestroy() { }

  copyScriptToClipboard(script): void {
    script.select();
    document.execCommand('copy');
  }

}
