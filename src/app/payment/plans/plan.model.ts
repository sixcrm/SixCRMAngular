export class Plan {
  constructor(public name: string, public price: number, public id: string) {};

  public static ofName(name: string): Plan {
    switch (name) {
      case 'Basic': {
        return new Plan('Basic', 30, '37cbb0aa-a1e9-4ad0-afe3-38f1dce31d5b');
      }

      case 'Professional': {
        return new Plan('Professional', 150, '646c2262-95e8-433d-be99-e621f7f17c7b')
      }

      case 'Premium': {
        return new Plan('Premium', 2000, 'd4dbbe5e-0413-44f1-98fc-a154db812541');
      }
    }
  }

  public static ofServerName(serverName: string): Plan {
    switch (serverName) {
      case 'basic': {
        return Plan.ofName('Basic');
      }
      case 'pro': {
        return Plan.ofName('Professional');
      }
      case 'premium': {
        return Plan.ofName('Premium');
      }
    }
  }

  getPriceText() {
    return `$${this.price} per month`;
  }

  getTransactionsText() {
    switch (this.name) {
      case 'Basic': {
        return '$0.06 per transaction';
      }
      case 'Professional': {
        return '$0.06 per transaction';
      }
      case 'Premium': {
        return 'No transaction fee';
      }
    }
  }

  getCampaignText() {
    switch (this.name) {
      case 'Basic': {
        return '1 campaign';
      }
      case 'Professional': {
        return 'Unlimited Campaigns';
      }
      case 'Premium': {
        return 'Unlimited Campaigns';
      }
    }
  }
}
