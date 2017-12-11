export const TRANSLATIONS = {
  topnav: {
    search: 'Search',
    greeting: 'Hello',
    settings: 'User Settings',
    signout: 'Sign Out',
    actingas: 'Acting as',
    mobile: {
      accounts: 'Accounts',
      actions: 'Actions',
      settings: 'User Settings',
      signout: 'Sign Out'
    }
  },
  sidenav: {
    dashboard: 'Dashboard',
    orderengine: 'State',
    reports: {
      title: 'Reports',
      order: 'Order Report',
      summary: 'Summary Report',
      transaction: 'Transactions Report',
      merchant: 'Merchants Report',
      affiliate: 'Affiliates Report',
      fulfillment: 'Fulfillment Report',
      retention: 'Retention',
      projection: 'Projections'
    },
    customer: 'Customers',
    crm: {
      title: 'CMR',
      product: 'Products',
      productschedule: 'Product Schedules',
      campaign: 'Campaigns',
      emailtemplate: 'Email Templates',
      affiliate: 'Affiliates',
      tracker: 'Trackers',
      session: 'Sessions',
      transaction: 'Transactions',
      rebill: 'Rebills',
      providers: {
        title: '3rd Party Providers',
        fulfillment: 'Fulfillment Providers',
        smtp: 'SMTP Providers'
      }
    },
    merchant: {
      title: 'Merchants',
      merchantprovider: 'Merchant Providers',
      loadbalancer: 'Load Balancers'
    },
    settings: {
      title: 'Settings',
      user: 'Users',
      account: 'Accounts',
      role: 'Roles',
      documentation: {
        title: 'Documentation',
        graphql: 'GraphQL',
        wiki: 'Wiki'
      }
    },
    search: 'Search'
  },
  orderengine: {
    schema: {
      title: 'State Machine Flow',
      subtitle: 'Below is rough flow of all data in SIX, click an element to load details below'
    },
    status: {
      failurerate: 'Failure Rate',
      avgtime: 'Avg. Time in Queue',
      view: 'View'
    },
    details: {
      title: 'Total Orders in',
      failurerate: 'Failure Rate',
      avgtime: 'Avg. Time in Queue',
      view: 'VIEW LIVE QUEUE',
      downstream: 'DOWNSTREAM QUEUE',
      nodata: 'Insufficient Data'
    },
    rebills: {
      snack: {
        main: "Queue Messages",
        sub: "Rebill ID"
      }
    },
    rebill: {
      history: {
        title: 'Messages',
        subtitle: 'History',
        enter: 'Entered'
      },
      properties: {
        title: 'Rebill Properties',
        subtitle: 'Details of client rebill',
        rebill: 'Rebill ID',
        parentsession: 'Parent Session ID',
        created: 'Created at',
        updated: 'Last Updated',
        amount: 'Total Billing Amount',
        campaign: 'Associated Campaign'
      }
    }
  },
  indexpage: {
    filter: 'Filter'
  },
  singlepage: {
    created: 'Created'
  },
  product: {
    index: {
      title: 'Products',
      header: {
        name: 'Product Name',
        sku: 'SKU',
        ship: 'Ship',
        delay: 'Shipping Delay'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      schedule: 'SCHEDULES',
      campaign: 'CAMPAIGNS'
    }
  }
};
