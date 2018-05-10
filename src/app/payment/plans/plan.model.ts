export class Plan {
  constructor(public name: string, public price: number, public id: string) {};

  public static ofName(name: string): Plan {
    switch (name) {
      case 'Basic': {
        return {name: 'Basic', price: 30, id: '37cbb0aa-a1e9-4ad0-afe3-38f1dce31d5b'};
      }

      case 'Professional': {
        return {name: 'Professional', price: 150, id: '646c2262-95e8-433d-be99-e621f7f17c7b'}
      }

      case 'Premium': {
        return {name: 'Premium', price: 2000, id: 'd4dbbe5e-0413-44f1-98fc-a154db812541'};
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
}
