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
      title: 'CRM',
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
      bill: 'Bills',
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
  forminputs: {
    fullname: 'Full Name',
    firstname: 'First Name',
    phone: 'Phone',
    email: 'Email',
    lastname: 'Last Name',
    address: 'Address',
    address2: 'Address2',
    city: 'City',
    state: 'State',
    zip: 'ZIP Code',
    country: 'Country',
    creditcard: {
      name: 'Name on Card',
      type: 'Type',
      number: 'Number',
      expiration: 'Expiration',
      ccv: 'CCV',
      monthshort: 'MM',
      yearshort: 'YYYY'
    }
  },
  indexpage: {
    filter: 'Filter'
  },
  singlepage: {
    created: 'Created'
  },
  account: {
    index: {
      title: 'Accounts',
      header: {
        name: 'Name',
        active: 'Active',
        created: 'Created',
        updated: 'Updated'
      }
    },
    tab: {
      general: 'GENERAL DETALS',
      users: 'USERS',
      keys: 'ACCESS KEYS',
      billing: 'BILLING'
    },
    details: {
      title: 'Account Details',
      edit: 'Edit Account Details',
      name: 'Name',
      activated: 'Activated',
      cancel: 'Cancel',
      save: 'Save'
    },
    users: {
      title: 'Associated Users',
      add: 'Add User to Account',
      invite: 'Invite User to Account',
      header: {
        name: 'Name',
        role: 'Role',
        status: 'Status',
      },
      edit: 'Edit User Role',
      view: 'View User',
      remove: 'Remove User from the Account',
      removemessage: 'Are you sure you want to remove this User from the account?'
    },
    keys: {
      title: 'Access Keys',
      header: {
        name: 'Name',
        access: 'Access Key',
        secret: 'Secret Key',
        created: 'Created',
        notes: 'Notes'
      },
      add: 'Add Access Keys',
      view: 'View Access Keys',
      edit: 'Edit Access Keys',
      remove: 'Remove Access Keys',
      cancel: 'CANCEL',
      close: 'CLOSE',
      update: 'UPDATE'
    },
    billing: {
      currenttitle: 'Current Invoices',
      currentsubtitle: 'Billings due',
      pasttitle: 'Past Invoices',
      pastsubtitle: 'Completed billings',
      overduewarning: 'Invoice Overdue',
      overduetext: 'You currently have an overdue invoice for',
      view: 'View Invoice',
      header: {
        issue: 'Issue Date',
        start: 'Period Start',
        end: 'Period Ending',
        balance: 'Balance',
        status: 'Status',
        due: 'Due Date'
      },
      pay: 'PAY NOW',
      summary: {
        title: 'Current Transaction Count',
        description: 'View Current Transaction cound and amount. Pay and view invoices. View transactions over time and predict the future.',
        nodata: 'No Transactions Found'
      }
    }
  },
  bill: {
    index: {
      title: 'Bills',
      header: {
        start: 'Period Start',
        end: 'Period End',
        overdue: 'Overdue',
        balance: 'Balance',
      }
    },
    tab: {
      general: 'GENERAL DETALS',
      users: 'USERS',
      keys: 'ACCESS KEYS',
      billing: 'BILLING'
    },
    details: {
      title: 'Invoice Summary',
      subtitle: 'Billing Information',
      start: 'Period Start',
      end: 'Period End',
      amount: 'Amount',
      due: 'Due Date',
      edit: 'Edit Invoice',
      back: 'BACK TO INVOICES',
      table: {
        title: 'Invoice Details',
        subtitle: 'Itemized Breakdown of Charges',
        description: 'Description',
        created: 'Created',
        amount: 'Amount',
        total: 'Total'
      },
      pay: 'PAY NOW',
      detailedit: 'Edit',
      detailremove: 'Remove',
      account: 'Account',
      createtitle: 'Create new Bill',
      cancel: 'CANCEL',
      save: 'SAVE',
      additem: {
        title: 'Add New Item',
        save: 'Save',
        cancel: 'Cancel'
      }
    },
    title: 'Bill'
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
