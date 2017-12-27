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
    filter: 'Filter',
    del: 'Delete',
    view: 'View',
    exp: 'Export',
    edit: 'Edit',
    copy: 'Copy'
  },
  singlepage: {
    created: 'Created',
    updated: 'Updated',
    createcanceltitle: 'Are you sure you want to close creation modal?',
    createcanceltext: 'You have unsaved changes, if you close this modal changes will be discarded.',
    createcancelclose: 'CLOSE',
    createcancelcancel: 'CANCEL',
    leavetitle: 'Are you sure you want to leave?',
    leavetext: 'You have unsaved changes, if you close this modal changes will be discarded.',
    leavecancel: 'CANCEL',
    leaveleave: 'LEAVE'
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
      used: 'Last time used',
      add: 'Add new Signing String',
      remove: 'Remove',
      edit: 'Edit',
      updatetext: 'Update Signing String',
      addtext: 'Add new Signing String',
      cancel: 'Cancel',
      save: 'Save',
      nodata: 'No Signing Strings found.'
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
      noresults: 'No Billings found.',
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
  user: {
    title: 'User',
    index: {
      title: 'Users',
      header: {
        name: 'Name',
        email: 'Email',
        active: 'Active',
        terms: 'Terms and Conditions'
      }
    },
    tab: {
      general: 'GENERAL DETALS'
    },
    details: {
      title: 'User Details',
      createtitle: 'Create new User',
      account: 'Account',
      newaccount: 'New Account',
      edit: 'Edit User Details',
      activated: 'Activated',
      role: 'Role',
      name: 'Name',
      email: 'Email',
      cancel: 'CANCEL',
      save: 'SAVE'
    },
    account: {
      title: 'Associated Accounts',
      add: 'Add Account to User',
      account: 'Account',
      role: 'Role',
      status: 'Status',
      edit: 'Edit Role',
      view: 'View Account',
      remove: 'Remove Account from the User',
      removetext: 'Are you sure you want to remove this Account from the User?'
    },
  },
  customer: {
    title: 'Customer',
    index: {
      title: 'Customers',
      header: {
        firstname: 'First Name',
        lastname: 'Last Name',
        state: 'State',
        city: 'City'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      transaction: 'TRANSACTIONS',
      session: 'SESSIONS',
      fulfillment: 'FULFILLMENT'
    },
    info: {
      createtitle: 'Create new Customer',
      shiptitle: 'Shipping Information',
      shipsubtitle: 'Address where fulfillment will ship packages',
      edit: 'EDIT CUSTOMER',
      shipedit: 'Edit Shipping Address',
      cancel: 'CANCEL',
      save: 'SAVE',
      update: 'UPDATE'
    },
    notes: {
      title: 'Notes',
      subtitle: 'Customer service notes',
      add: 'Add New Note',
      del: 'Delete Note',
      nodata: 'No Notes found.'
    },
    rebill: {
      title: 'Upcoming Rebills',
      subtitle: 'Future Rebills and Upcoming Transactions',
      billed: 'Bill at',
      amount: 'Amount',
      cancel: 'Cancel Transaction',
      edit: 'Edit Transaction',
      nodata: 'No Upcoming Transactions found.'
    },
    rebilledit: {
      title: 'Edit Transaction',
      subtitle: 'modify an upcoming transaction',
      date: 'Transaction Date',
      cancel: 'CANCEL',
      save: 'SAVE',
      price: 'Price'
    },
    events: {
      title: 'Customer Events',
      subtitle: 'Sessions, Transactions and Leads',
      nodata: 'No Events found.',
      today: 'Today',
      days7: 'Last 7 days',
      days30: 'Last 30 days',
      days90: 'Last 90 days',
      other: 'Other'
    },
    transaction: {
      title: 'Historical Transactions',
      subtitle: 'Completed Transactions',
      nodata: 'No Transactions Found.',
      alias: 'Alias',
      response: 'Processor Response',
      productnum: 'Number of Products',
      amount: 'Amount'
    },
    session: {
      title: 'Sessions',
      view: 'View Session',
      nodata: 'No Sessions found.',
      name: 'Name',
      campaign: 'Campaign',
      productschedulenum: 'Number of Product Schedules',
      rebillnum: 'Number of Rebills'
    },
    creditcard: {
      title: 'Billing Information',
      subtitle: 'Billing Address & Credit Card information',
      addoption: 'Add Credit Card',
      editoption: 'Edit Credit Card',
      removeoption: 'Remove Credit Card',
      edittitle: 'Edit Credit Card',
      createtitle: 'Create new Credit Card',
      createtext: 'Create new Credit Card with the associated user',
      expirationmonth: 'Expiration Date Month',
      expirationyear: 'Expiration Date Year',
      billingaddress: 'Billing Address',
      sameaddress: 'Same as Customer Address',
      cancel: 'Cancel',
      update: 'Update',
      save: 'Save',
      nodata: 'No Credit Cards found.'
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
  campaign: {
    title: 'Campaign',
    index: {
      title: 'Campaigns',
      header: {
        name: 'Name',
        created: 'Created at',
        productnum: 'Total Products',
        schedulednum: 'Total Scheduled',
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      productschedules: 'PRODUCT SCHEDULES',
      affiliates: 'AFFILIATES',
      trackingcode: 'TRACKING CODE'
    },
    info: {
      createtitle: 'Create new Campaign',
      title: 'Campaign Details',
      name: 'Name',
      allowprepaid: 'Allow Prepaid',
      showprepaid: 'Show Prepaid',
      cancel: 'CANCEL',
      save: 'SAVE',
      edit: 'Edit Campaign'
    },
    email: {
      title: 'Associated Email Templates',
      nodata: 'No Email Templates found.',
      name: 'Name',
      subject: 'Subject',
      type: 'Type',
      smtpprovider: 'SMTP Provider',
      add: 'Associate Email Template',
      addtext: 'Select Email Template',
      addbutton: 'ADD',
      view: 'View Email Template',
      remove: 'Disassociate Email Template',
      removetext: 'Are you sure you want to delete?'
    },
    productschedule: {
      title: 'Associated Product Schedules',
      nodata: 'No Product Schedules found.',
      name: 'Name',
      productnumber: 'Products in Schedule',
      add: 'Associate Product Schedule',
      addtext: 'Select Product Schedule',
      addbutton: 'ADD',
      view: 'View Product Schedule',
      remove: 'Disassociate Product Schedule',
      removetext: 'Are you sure you want to delete?'
    },
    affiliate: {
      name: 'Name'
    },
    affiliateallowed: {
      title: 'Allowed Affiliates',
      nodata: 'No Affiliates allowed.',
      name: 'Name',
      add: 'Add Affiliate to allowed list',
      addtext: 'Select Affiliate',
      addbutton: 'ADD',
      view: 'View Affiliate',
      remove: 'Remove Affiliate from allowed list',
      removetext: 'Are you sure you want to delete?'
    },
    affiliatedenied: {
      title: 'Denied Affiliates',
      nodata: 'No Affiliates denied.',
      name: 'Name',
      add: 'Add Affiliate to denied list',
      addtext: 'Select Affiliate',
      addbutton: 'ADD',
      view: 'View Affiliate',
      remove: 'Remove Affiliate from denied list',
      removetext: 'Are you sure you want to delete?'
    },
    tracking: {
      title: 'Tracking Code',
      subtitle: 'Copy this Code to your HTML page header',
      copy: 'Copy to clipboard'
    }
  },
  emailtemplate: {
    title: 'Email Template',
    index: {
      title: 'Email Templates',
      header: {
        name: 'Name',
        subject: 'Subject',
        type: 'Type',
        smtpprovider: 'SMTP Provider'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      preview: 'PREVIEW'
    },
    info: {
      createtitle: 'Create new Email Template',
      title: 'Email Template Details',
      subtitle: 'Edit HTML templates below or load defaults from right menu',
      edit: 'Edit Email Template',
      name: 'Name',
      type: 'Template Type',
      smtpprovider: 'SMTP Provider',
      subject: 'Subject',
      body: 'Email ',
      cancel: 'CANCEL',
      save: 'SAVE'
    },
    token: {
      title: 'Tokens',
      subtitle: 'Choose any of the following tokens to add into your email template',
      type: 'Even Type',
      search: 'Search'
    },
    preview: {
      title: 'Email Template Preview',
      subtitle: 'preview how the template will look in an email'
    }
  },
  affiliate: {
    title: 'Affiliate',
    index: {
      title: 'Affiliates',
      header: {
        name: 'Name',
        affiliateid: 'Affiliate ID',
        created: 'Created at',
        updated: 'Updated at'
      }
    },
    tab: {
      tracking: 'TRACKING',
      session: 'SESSIONS',
      campaign: 'CAMPAIGNS'
    },
    info: {
      createtitle: 'Create new Affiliate',
      name: 'Affiliate Name',
      id: 'Affiliate ID',
      edit: 'EDIT AFFILIATE',
      cancel: 'CANCEL',
      save: 'SAVE',
      update: 'UPDATE'
    },
    tracking: {
      title: 'Associated Trackers',
      name: 'Name',
      type: 'Type',
      event: 'Event',
      data: 'Tracking Data',
      nodata: 'No Trackers found.',
      associate: 'Associate Tracker',
      associatetext: 'Select Tracker',
      confirm: 'ASSOCIATE',
      cancel: 'CANCEL',
      view: 'View Tracker',
      disassociate: 'Disassociate Tracker',
      disassociatetext: 'Are you sure you want to delete?'
    },
    session: {
      title: 'Associated Sessions',
      customer: 'Customer',
      campaign: 'Campaign',
      rebilltotal: 'Total Rebills',
      scheduledtotal: 'Total Scheduled',
      nodata: 'No Sessions found.',
      view: 'View Session',
    }
  },
  tracker: {
    title: 'Tracker',
    index: {
      title: 'Trackers',
      header: {
        name: 'Name',
        type: 'Type',
        event: 'Event',
        data: 'Tracking Data'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      affiliate: 'AFFILAITES',
      campaign: 'CAMPAIGNS'
    },
    info: {
      createtitle: 'Create new Tracker',
      title: 'Tracker Details',
      name: 'Tracker Name',
      type: 'Tracking Type',
      eventtype: 'Event Type',
      eventtypeadd: 'Add Event Type',
      data: 'Tracking Data',
      link: 'Tracking Link',
      save: 'SAVE',
      cancel: 'CANCEL',
      edit: 'Edit Tracker'
    },
    affiliate: {
      title: 'Associated Affiliates',
      name: 'Name',
      id: 'Affiliate ID',
      created: 'Created at',
      updated: 'Updated at',
      nodata: 'No Affiliates found.',
      associate: 'Associate Affiliate',
      associatetext: 'Select Affiliate',
      confirm: 'ASSOCIATE',
      cancel: 'CANCEL',
      view: 'View Affiliate',
      disassociate: 'Disassociate Affiliate',
      disassociatetext: 'Are you sure you want to delete?'
    },
    campaign: {
      title: 'Associated Campaigns',
      name: 'Name',
      created: 'Created at',
      updated: 'Updated at',
      nodata: 'No Campaigns found.',
      associate: 'Associate Campaign',
      associatetext: 'Select Campaign',
      confirm: 'ASSOCIATE',
      cancel: 'CANCEL',
      view: 'View Campaign',
      disassociate: 'Disassociate Campaign',
      disassociatetext: 'Are you sure you want to delete?'
    },
  },
  session: {
    title: 'Session',
    index: {
      title: 'Sessions',
      header: {
        campaign: 'Campaign Name',
        customer: 'Customer Name',
        schedulesnum: 'Number of Product Schedules',
        rebillsnum: 'Number of Rebills'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      affiliate: 'AFFILAITES',
    },
    customer: {
      title: 'Customer Information',
      view: 'View Customer'
    },
    rebill: {
      title: 'Associated Rebills',
      billed: 'Bill at',
      amount: 'Amount',
      nodata: 'No Rebills found.',
      view: 'View Rebill',
    },
    campaign: {
      title: 'Associated Campaigns',
      name: 'Name',
      created: 'Created at',
      nodata: 'No Campaigns found.',
      view: 'View Campaign',
    },
    affiliate: {
      title: 'Associated Affiliates',
      name: 'Name',
      id: 'Affiliate ID',
      created: 'Created at',
      nodata: 'No Affiliates found.',
      view: 'View Affiliate',
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
  },
  fulfillment: {
    title: 'Fulfillment Provider',
    index: {
      title: 'Fulfillment Providers',
      header: {
        name: 'Name',
        provider: 'Provider',
        username: 'Username',
        password: 'Password'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      validate: 'VALIDATE'
    },
    info: {
      title: 'Fulfillment Details',
      createtitle: 'Create new Fulfillment Provider',
      edit: 'Edit Fulfillment Provider Details',
      provider: 'Provider',
      name: 'Name',
      username: 'Username',
      password: 'Password',
      threeplkey: 'ThreePL Key',
      customerid: 'Customer ID',
      facilityid: 'Facility ID',
      threeplid: 'ThreePL ID',
      cancel: 'CANCEL',
      save: 'SAVE'
    },
    validate: {
      title: 'Validate Fulfillment Provider',
      text: 'Check if Fulfillment Provider is enabled and provided credentials/parameters are valid',
      response: 'Validation Response',
      validate: 'VALIDATE'
    }
  },
  smtp: {
    title: 'SMTP Provider',
    index: {
      title: 'SMTP Providers',
      header: {
        name: 'Name',
        fromname: 'From Name',
        fromemail: 'From Email',
        hostname: 'Hostname',
        username: 'Username'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      emailtemplate: 'EMAIL TEMPLATES',
      validate: 'VALIDATE'
    },
    info: {
      title: 'SMTP Details',
      createtitle: 'Create new SMTP Provider',
      edit: 'Edit SMTP Provider Details',
      name: 'Name',
      fromname: 'From Name',
      fromemail: 'From Email',
      host: 'Host',
      username: 'Username',
      password: 'Password',
      port: 'Port',
      cancel: 'CANCEL',
      save: 'SAVE'
    },
    validate: {
      title: 'Validate SMTP Provider',
      text: 'Please provide an email address below and SIX will try to send you a test email using provided SMTP Provider. Email will be sent from ',
      textsecond: 'Results will be displayed in right column.',
      email: 'Receiver email address',
      emailtip: 'Please enter a valid email address',
      response: 'Validation Response',
      validate: 'VALIDATE'
    }
  },
  loadbalancer: {
    title: 'Load Balancer',
    index: {
      title: 'Load Balancers',
      header: {
        name: 'Name',
        merchantnum: 'Number of Merchant Providers'
      }
    },
    tab: {
      general: 'GENERAL DETAILS'
    },
    info: {
      createtitle: 'Create new Load Balancer',
      name: 'Name',
      edit: 'EDIT LOAD BALANCER',
      cancel: 'CANCEL',
      update: 'UPDATE',
      save: 'SAVE'
    },
    merchant: {
      addtitle: 'Add Merchant Provider',
      distribution: 'Distribution',
      merchant: 'Merchant Provider',
      add: 'ADD',
      update: 'UPDATE',
      clear: 'CLEAR',
      title: 'Associated Merchant Providers',
      view: 'View Merchant Provider',
      edit: 'Update Distribution',
      disassociate: 'Disassociate Merchant Provider',
      disassociatetext: 'Are you sure you want to delete?',
      nodata: 'No Merchant Providers found.'
    }
  },
  merchant: {
    title: 'Merchant Provider',
    index: {
      title: 'Merchant Providers',
      header: {
        name: 'Name',
        processor: 'Processor Name',
        type: 'Processor Type'
      }
    },
    tab: {
      general: 'GENERAL DETAILS',
      processing: 'PROCESSING',
      loadbalancer: 'LOAD BALANCING',
    },
    info: {
      edit: 'EDIT MERCHANT PROVIDER',
      cancel: 'CANCEL',
      update: 'UPDATE',
      save: 'SAVE',
      settings: {
        title: 'Settings',
        name: 'Name',
        enabled: 'Enabled',
        allowprepaid: 'Allow Prepaid cards',
        accepted: 'Accepted paypment methods',
      },
      processing: {
        title: 'Processing',
        monthlycapd: 'Monthly Cap ($)',
        monthlycapc: 'Monthly Cap (count)',
        weeklycap: 'Weekly Cap (count)',
        dailycap: 'Daily Cap (count)',
        transactionfee: 'Transaction Fee ($)',
        discountrate: 'Discount Rate (%)',
        chargeback: 'Max chargeback ratio (%)',
        reserve: 'Reserve rate (%)'
      },
      gateway: {
        title: 'Gateway information',
        name: 'Name',
        type: 'Type',
        processorid: 'Processor ID',
        productid: 'Product ID',
        username: 'Username',
        password: 'Password'
      },
      service: {
        title: 'Customer Service',
        uri: 'URI',
        email: 'Email',
        phone: 'Phone',
        description: 'Description'
      }
    },
    loadbalancer: {
      title: 'Associated Load Balancers',
      view: 'View Load Balancer',
      nodata: 'No Load Balancers found.',
      name: 'Name'
    },
  },
  deletedialog: {
    text: 'Are you sure you want to delete?',
    del: 'DELETE',
    cancel: 'CANCEL'
  },
  inviteuser: {
    title: 'Invite new User',
    email: 'User Email',
    role: 'Role',
    cancel: 'CANCEL',
    invite: 'INVITE'
  },
  terms: {
    title: 'Please accept our Terms and Conditions to get started.',
    accept: 'Accept',
    logout: 'Log Out'
  },
  register: {
    form: {
      title: 'Welcome!',
      subtitle: 'We\'re excited to have you join us',
      text: 'To get started with your 90 day trial simply enter your company name and verify your information.',
      company: 'Company Name',
      firstname: 'First Name',
      lastname: 'Last Name',
      cont: 'Continue'
    },
    thankyou: {
      title: 'Your account is now active and you may begin exploring at your leisure.',
      subtitle: 'HOWEVER, we still need some accounting details to complete your registration. Remember, you won\'t be able to take transactions until your account registration is complete. Click complete to go to your billing profile.',
      text: 'You\'re complimentary 90 days begins now!',
      complete: 'Complete'
    }
  }
};
