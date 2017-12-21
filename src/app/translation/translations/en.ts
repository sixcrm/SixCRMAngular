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
      shippingreceipt: 'Shipping Receipts',
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
  notifications: {
    title: 'Notifications & Alerts',
    tab: {
      notifications: 'NOTIFICATIONS',
      alerts: 'ALERTS'
    },
    today: 'Earlier Today',
    yesterday: 'Yesterday',
    days3: 'Past 3 days',
    week: 'Past week',
    other: 'Other'
  },
  notificationsquick: {
    title: 'NOTIFICATIONS',
    settings: 'Settings',
    viewall: 'See All Notifications',
    alerts: 'Alerts',
    noresults: 'No Notifications Found',
    view: 'View',
    dismiss: 'Dismiss'
  },
  advancedfilter: {
    from: 'From',
    to: 'To',
    filters: 'Filters',
    groupby: 'Group By',
    show: 'Show Advanced Search',
    hide: 'Hide Advanced Search',
    apply: 'APPLY',
    reset: 'RESET',
    close: 'CLOSE',
    campaign: 'Campaign',
    affiliate: 'Affiliate',
    subid1: 'Sub ID 1',
    subid2: 'Sub ID 2',
    subid3: 'Sub ID 3',
    subid4: 'Sub ID 4',
    subid5: 'Sub ID 5',
    productschedule: 'Product Schedule',
    merchantprovider: 'Merchant Provider',
    transactiontype: 'Transaction Type',
    processorresponse: 'Processor Response',
    new: 'New',
    rebill: 'Rebill',
    success: 'Success',
    decline: 'Decline',
    error: 'Error'
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
  profile: {
    title: 'Profile',
    created: 'Created',
    tabs: {
      general: 'GENERAL',
      notifications: 'NOTIFICATIONS',
      accounts: 'ACCOUNTS',
      signingstrings: 'SIGNING STRINGS'
    },
    details: {
      title: 'Profile',
      subtitle: 'general information',
      firstname: 'First Name',
      lastname: 'Last Name',
      workphone: 'Work Phone',
      cellphone: 'Cell Phone',
      timezone: 'Timezone',
      email: 'Email',
      language: 'Language',
      update: 'Update'
    },
    notifications: {
      title: 'Notification toggle',
      subtitle: 'toggle on/of when to receive notifications',
      testalert: 'Send test alert',
      testnotification: 'Send test notification',
      devices: {
        title: 'Devices',
        subtitle: 'setup devices for notifications',
        sms: 'SMS',
        email: 'Email',
        skype: 'Skype',
        slack: 'Slack web hook'
      },
      settings : {
        title: 'Notification settings',
        subtitle: 'Select what notifications you want to receive'
      }
    },
    accounts: {
      title: 'Your Accounts',
      accountname: 'Name',
      rolename: 'Role',
      view: 'View Account'
    },
    signingstrings: {
      title: 'Your Signing Strings',
      name: 'Name',
      signingstring: 'Signing String',
      used: 'Last time Used',
      add: 'Add new Signing String',
      remove: 'Remove',
      edit: 'Edit',
      updatetext: 'Update Signing String',
      addtext: 'Add new Signing String',
      cancel: 'Cancel',
      save: 'Save'
    }
  },
  dashboard: {
    eventsfunnel: {
      title: 'Events Funnel',
      subtitle: 'Events by Event type',
      event: 'Event',
      count: 'Count',
      percentage: 'Percentage',
      relativepercentage: 'Relative Percentage'
    },
    eventsummary: {
      title: 'Events',
      subtitle: 'events summary',
      nodata: 'No Events Found'
    },
    eventsbyaffiliate: {
      title: 'Events by Affiliate',
      subtitle: 'Events from the top Affiliates',
      affiliate: 'Affiliate',
      count: 'Count',
      percentage: 'Percentage',
      nodata: 'No Events Found'
    },
    transactionbyaffiliate: {
      title: 'Transactions by Affiliate',
      subtitle: 'Transactions from the top Affiliates',
      affiliate: 'Affiliate',
      count: 'Count',
      countp: 'Count%',
      amount: 'Amount',
      amountp: 'Amount%',
      nodata: 'No Transactions Found'
    },
    transactionsummary: {
      title: 'Transactions',
      subtitle: 'transactions summary',
      nodata: 'No Transactions Found'
    },
    movers: {
      title: 'Campaigns Watch List',
      subtitle: 'campaigns on the move',
      nodata: 'No Campaigns Found'
    },
    topcampaigns: {
      title: 'Top Campaigns',
      subtitle: 'Clicks & Conversions',
      nodata: 'No Campaigns Found',
      campaign: 'Campaign',
      amount: 'Amount'
    },
    reports: {
      title: 'Reports',
      subtitle: 'Popular reports to monitor metrics',
      order: {
        title: 'Order Report',
        subtitle: 'Quick reports about orders'
      },
      summary: {
        title: 'Summary Report',
        subtitle: 'View summary information about transactions'
      },
      transactions: {
        title: 'Transaction Report',
        subtitle: 'View information about transactions'
      },
      fulfillment: {
        title: 'Fulfillment Report',
        subtitle: 'Fulfillment overview for campaigns'
      },
      affiliate: {
        title: 'Affiliate Report',
        subtitle: 'Performance metrics about affiliates'
      },
      retention: {
        title: 'Retention',
        subtitle: 'Learn how log customers stay'
      }
    }
  },
  chart: {
    viewmore: 'VIEW MORE',
    collapse: 'COLLAPSE',
    showtable: 'SHOW TABLE',
    downloadjson: 'Download JSON',
    downloadcsv: 'Download CSV',
    downloadexcel: 'Download Excel'
  },
  summaryreport: {
    title: 'Summary Report',
    tabletitle: 'Transaction Summary Details',
    sales: 'Sales',
    salesrevenue: 'Sales Revenue',
    rebill: 'Rebill',
    rebillrevenue: 'Rebill Revenue',
    refunds: 'Refunds',
    refundexpenses: 'Refund Expenses',
    declines: 'Declines',
    declinesrevenue: 'Declines Revenue',
    grossrevenue: 'Gross Revenue',
    chargebacks: 'Chargebacks',
    alerts: 'Alerts',
    activecustomers: 'Active Customers',
    date: 'Date'
  },
  transactionreport: {
    title: 'Transactions Report',
    tabletitle: 'Transaction Details',
    customer: 'Customer',
    campaign: 'Campaign',
    merchantprovider: 'Merchant Provider',
    affiliate: 'Affiliate',
    amount: 'Amount',
    processorresult: 'Processor Result',
    transactiontype: 'Transaction Type'
  },
  merchantreport: {
    title: 'Merchant Report',
    tabletitle: 'Transaction Details',
    merchantprovider: 'Merchant Provider',
    salescount: 'Sales Count',
    salesgrossrevenue: 'Sales Gross Revenue',
    refundexpenses: 'Refund Expenses',
    refundcount: 'Refund Count',
    netrevenue:'Net Revenue',
    mtdsalescount: 'MTD Sales Count',
    mtdgrosscount: 'MTD Gross Count',
    chart: {
      title: 'Merchant Processing',
      subtitle: 'Current loads and balance',
      nodata: 'No Merchants Found'
    }
  },
  affiliatereport: {
    title: 'Affiliate Report',
    tabletitle: 'Affiliate Summary Details',
    clickscount: 'Clicks Count',
    partialscount: 'Partials Count',
    affiliate: 'Affiliate',
    partialspercentage: 'Partials Percentage',
    declienscount: 'Declines Count',
    declinespercentage: 'Declines Percentage',
    salescount: 'Sales Count',
    salespercentage: 'Sales Percentage',
    upsellcount: 'Upsell Count',
    upsellpercentage: 'Upsell Percentage',
    upsellsum: 'Upsell Sum',
    amountsum: 'Amount Sum'
  },
  search: {
    tab: {
      customer: 'CUSTOMER',
      order: 'ORDER ENTRY'
    },
    advanced: {
      toggle: 'ADVANCED SEARCH',
      search: 'Search',
      firstname: 'First Name',
      lastname: 'Last Name',
      phone: 'Phone Number',
      email: 'Email Address',
      trackingnumber: 'Shipment Tracking Number',
      address1: 'Address 1',
      address2: 'Address 2',
      city: 'City',
      zip: 'ZIP Code',
      state: 'State',
      country: 'Country',
      alias: 'Transaction Alias',
      cctype: 'Credit Card Type',
      ccf6: 'Credit Card # first 6',
      ccl4: 'Credit Card # last 4',
      amount: 'Amount',
      created: 'Created at',
      sku: 'SKU',
      name: 'Name',
      response: 'Processor Response',
      status: 'Receipt Status',
      merchantprovider: 'Merchant Provider',
      fulfillmentprovider: 'Fulfillment Provider',
      ship: 'Ship',
      shipdelay: 'Shipping Delay',
      schedulesnum: 'Number of Schedules',
      bill: 'Billed at',
      parentsession: 'Parent Session',
      product: 'Product',
      start: 'Start',
      end: 'End',
      price: 'Price',
      id: 'ID'
    },
    category: 'Category',
    refined: 'REFINED RESULTS',
    reset: 'RESET SEARCH',
    date: {
      range: 'Date Range',
      toggle: 'Date',
      to: 'to'
    },
    results: 'Search Results',
    sort: {
      title: 'Sort By',
      createasc: 'created at asc',
      createdesc: 'created at desc',
      updateasc: 'updated at asc',
      updatedesc: 'updated at desc',
      def: 'default'
    },
    nodata: 'Sorry, there were no results.',
    entersearch: 'Please enter a search query.',
    perfect: {
      view: 'VIEW',
      customer: {
        shipaddress: 'Shipping Address',
        recenttransactions: 'Recent Transactions',
      },
      transaction: {
        title: 'Transaction Info',
        product: 'Products'
      },
      product: {
        title: 'Product Info'
      },
      campaign: {
        title: 'Campaign Info',
        schedules: 'Product Schedules'
      },
      rebill: {
        title: 'Rebill Info',
        transactions: 'Transactions'
      },
      schedule: {
        title: 'Product Schedule Info',
        schedules: 'Schedules'
      }
    }
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
    title: 'Product',
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
    },
    info: {
      title: 'Product Details',
      createtitle: 'Create new Product',
      name: 'Product Name',
      sku: 'SKU',
      defaultprice: 'Default Price',
      ship: 'Ship',
      shipdelay: 'Shipping Delay (minutes)',
      fulfillmentprovider: 'Fulfillment Provider',
      edit: 'Edit Product',
      del: 'Delete Product',
      cancel: 'CANCEL',
      update: 'UPDATE',
      create: 'CREATE'
    },
    schedules: {
      title: 'Product Schedules',
      name: 'Name',
      count: 'Number of Schedules',
      add: 'Add new Product Schedule',
      view: 'View Product Schedule',
      remove: 'Remove from Product Schedule',
      nodata: 'No Product Schedules found.'
    },
    campaign: {
      title: 'Campaigns',
      name: 'Name',
      created: 'Created at',
      productnum: 'Total Products',
      schedulednum: 'Total Scheduled',
      view: 'View Campaign',
      nodata: 'No Campaigns found.'
    }
  },
  productschedule: {
    title: 'Product Schedule',
    index: {
      title: 'Product Schedules',
      header: {
        name: 'Name',
        loadbalancer: 'Load Balancer',
        numofcycles: 'Number of Cycles'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      campaign: 'CAMPAIGNS'
    },
    info: {
      createtitle: 'Create new Product Schedule',
      title: 'Product Schedule Details',
      name: 'Product Schedule Name',
      loadbalancer: 'Load Balancer',
      cancel: 'CANCEL',
      save: 'SAVE',
      edit: 'Edit Product Schedule'
    },
    cycle: {
      addtitle: 'Add Cycle',
      edittitle: 'Edit Cycle',
      title: 'Cycles',
      add: 'ADD',
      clear: 'CLEAR',
      save: 'SAVE',
      cancel: 'CANCEL',
      name: 'Product Name',
      schedulename: 'Product Schedule Name',
      price: 'Price',
      pricetip: 'Price for period of time',
      start: 'Start',
      starttip: 'Start of period (0 is immediate)',
      end: 'End',
      endtip: 'Ends & switches to next product schedule',
      period: 'Period',
      periodtip: 'Recurring billing & shipping period',
      ship: 'Ship',
      nodata: 'No Cycles found.',
      view: 'View Product',
      edit: 'Edit Cycle',
      remove: 'Remove Cycle'
    },
    campaign: {
      title: 'Campaigns',
      name: 'Name',
      created: 'Created at',
      productnum: 'Total Products',
      schedulednum: 'Total Scheduled',
      view: 'View Campaign',
      nodata: 'No Campaigns found.'
    }
  },
  transaction: {
    title: 'Transaction',
    index: {
      title: 'Transactions',
      header: {
        alias: 'Alias',
        amount: 'Amount',
        created: 'Created at',
        response: 'Processor Response'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      refund: 'REFUND TRANSACTION'
    },
    info: {
      title: 'Transaction Details',
      rebillview: 'View Rebill',
      merchantproviderview: 'View Merchant Provider',
      alias: 'Alias',
      amount: 'Amount',
      merchantprovider: 'Merchant Provider'
    },
    processor: {
      title: 'Processor Response',
      code: 'Auth Code',
      message: 'Processor Message',
      text: 'Processor Text'
    },
    refund: {
      title: 'Refund Transaction',
      amount: 'Amount',
      amounttorefund: 'Amount to Refund',
      refundall: 'Refund All',
      cancel: 'CANCEL',
      confirm: 'REFUND'
    },
    product: {
      title: 'Associated Products',
      name: 'Name',
      sku: 'SKU',
      amount: 'Amount'
    }
  },
  rebill: {
    title: 'Rebill',
    index: {
      title: 'Rebills',
      header: {
        id: 'ID',
        bill: 'Bill at',
        created: 'Created at',
        amount: 'Amount'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      receipts: 'SHIPPING RECEIPTS'
    },
    info: {
      title: 'Rebill Information',
      billed: 'Billed at date',
      amount: 'Amount',
      parentsession: 'Parent Session',
      customer: 'Customer',
      customerview: 'View Customer',
      sessionview: 'View Session'
    },
    shippingreceipt: {
      title: 'Associated Shipping Receipts',
      nodata: 'No Shipping Receipts found',
      status: 'Status',
      trackingnumber: 'Tracking Number',
      created: 'Created At',
      updated: 'Updated At'
    }
  },
  shippingreceipt: {
    title: 'Shipping Receipt',
    index: {
      title: 'Shipping Receipts',
      header: {
        status: 'Status',
        number: 'Tracking Number',
        created: 'Created at',
        updated: 'Updated at'
      }
    },
    tab: {
      general: 'GENERAL DETAILS'
    },
    info: {
      title: 'Shipping Receipt Details',
      status: 'Status',
      number: 'Tracking Number'
    }
  }
};
