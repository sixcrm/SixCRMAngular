import { Injectable } from '@angular/core';

@Injectable()
export class DefaultTranslationService {

  public static en() {
    return {
      "quotes":[
        {
          "quote":"Fall seven times and stand up eight",
          "attribution":{
            "author":"Japanese Proverb",
            "date_string":""
          }
        },
        {
          "quote":"People who succeed have momentum. The more they succeed, the more they want to succeed, and the more they find a way to succeed.",
          "attribution":{
            "author":"Tony Robbins",
            "date_string":""
          }
        },
        {
          "quote":"I can’t change the direction of the wind, but I can adjust my sails to always reach my destination.",
          "attribution":{
            "author":"Jimmy Dean",
            "date_string":""
          }
        },
        {
          "quote":"Whatever the mind of man can conceive and believe, it can achieve.",
          "attribution":{
            "author":"Napoleon Hill",
            "date_string":""
          }
        },
        {
          "quote":"Build your own dreams, or someone else will hire you to build theirs.",
          "attribution":{
            "author":"Farrah Gray",
            "date_string":""
          }
        },
        {
          "quote":"A person who never made a mistake never tried anything new.",
          "attribution":{
            "author":"Albert Einstein",
            "date_string":""
          }
        },
        {
          "quote":"Everything you’ve ever wanted is on the other side of fear.",
          "attribution":{
            "author":"George Addair",
            "date_string":""
          }
        },
        {
          "quote":"Innovation distinguishes from a leader and a follower.",
          "attribution":{
            "author":"Steve Jobs",
            "date_string":""
          }
        },
        {
          "quote":"It isn’t the mountains ahead to climb that wear you out; it’s the pebble in your shoe.",
          "attribution":{
            "author":"Muhammad Ali",
            "date_string":""
          }
        },
        {
          "quote":"The way to gain a good reputation is to endeavor to be what you desire to appear.",
          "attribution":{
            "author":"Socrates",
            "date_string":""
          }
        },
        {
          "quote":"The power of imagination makes us infinite.",
          "attribution":{
            "author":"John Muir",
            "date_string":""
          }
        },
        {
          "quote":"Luck is a matter of preparation meeting opportunity.",
          "attribution":{
            "author":"Seneca",
            "date_string":""
          }
        },
        {
          "quote":"If we can challenge convention, we can solve any problem.",
          "attribution":{
            "author":"Josh Valman",
            "date_string":""
          }
        },
        {
          "quote":"If you light a lamp for someone else, it will also brighten your path.",
          "attribution":{
            "author":"Buddha",
            "date_string":""
          }
        },
        {
          "quote":"The starting point of all achievement is desire.",
          "attribution":{
            "author":"Napoleon Hill",
            "date_string":""
          }
        },
        {
          "quote":"Action is the foundational key to all success.",
          "attribution":{
            "author":"Pablo Picasso",
            "date_string":""
          }
        },
        {
          "quote":"What we plant in the soil of contemplation, we shall reap in the harvest of action.",
          "attribution":{
            "author":"Meister Eckhart",
            "date_string":""
          }
        },
        {
          "quote":"Human behavior flows from three main sources: desire, emotion, and knowledge.",
          "attribution":{
            "author":"Plato",
            "date_string":""
          }
        },
        {
          "quote":"Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
          "attribution":{
            "author":"Alexander Graham Bell",
            "date_string":""
          }
        }
      ],
      "notifications": {
        "default": {
          "statemachine": {
            "shipping_confirmation": {
              "name":"Shipment Confirmation",
              "description":"",
              "title": "Shipment Confirmed",
              "body": "We've just received confirmation of shipment for your order {{rebill.alias}}"
            },
            "delivery_confirmation": {
              "name":"Delivery Confirmation",
              "description":"",
              "title": "Delivery Confirmed",
              "body": "We've just received confirmation of delivery for your order {{rebill.alias}}"
            },
            "recovery_success": {
              "name":"Billing Recovered",
              "description":"",
              "title": "Transaction {{transaction.alias}} on Order {{session.id}} was successfully recovered!",
              "body": "A transaction on {{campaign.name}} was successfully recovered on {{campaign.name}}!"
            },
            "recovery_fail": {
              "name":"Billing Recovery Failure",
              "description":"",
              "title": "Transaction {{transaction.alias}} on Order {{session.id}} was unsuccessfully recovered!",
              "body": "A transaction on {{campaign.name}} was unsuccessfully recovered on {{campaign.name}}!"
            },
            "recovery_error": {
              "name":"Billing Recovery Error",
              "description":"",
              "title": "There was an error recovering transaction {{transaction.alias}} on Order {{session.id}}!",
              "body": "There was an error recovering a transaction on {{campaign.name}}!"
            },
            "fulfillment_triggered_success": {
              "name":"Fulfillment Triggered",
              "description":"",
              "title": "{{rebill.id}} was successfully fulfilled!",
              "body": "An order was fulfilled on {{campaign.name}}!"
            },
            "fulfillment_triggered_fail": {
              "name":"Fulfillment Failure",
              "description":"",
              "title": "Fulfillment on {{rebill.id}} failed!",
              "body": "An order failed to be fulfilled on {{campaign.name}}!"
            },
            "fulfillment_triggered_error": {
              "name":"Fulfillment Error",
              "description":"",
              "title": "There was an error fulfilling {{rebill.id}}!",
              "body": "An error occurred while attempting to fulfill an order on {{campaign.name}}!"
            }
          },
          "default": {
            "default": {
              "name":"Default Notification",
              "description":"",
              "title": "This is the default notification",
              "body": "This is the default notification.  This notification was issued because a notification of type {{event_type}} was not found.  Please contact the system administrator for more details."
            }
          },
          "test": {
            "test": {
              "name":"Test Notification",
              "description":"",
              "title": "This is a test notification",
              "body": "Testing, testing.  Is this thing on? (taps microphone) Testing... hello? One, two, three. Testing."
            },
            "testalert": {
              "name":"Test Alert",
              "description":"",
              "title": "This is a test alert",
              "body": "Normally if you see this sort of thing, you'll need to take action immdiately-ish."
            }
          },
          "transaction": {
            "order": {
              "name":"New Order",
              "description":"",
              "title": "{{campaign.name}} has a new order ({{transactionsubtype}})!",
              "body": "Your campaign {{campaign.name}} has a new transaction ({{transactionsubtype}})!"
            },
            "lead": {
              "name":"New Lead",
              "description":"",
              "title": "{{campaign.name}} has a new lead!",
              "body": "Your campaign {{campaign.name}} has a new lead!"
            },
            "confirm": {
              "name":"Order Confirmation",
              "description":"",
              "title": "A customer has just confirmed their order on {{campaign.name}}!",
              "body": "A customer has just confirmed their order on {{campaign.name}}!"
            }
          },
          "account":{
            "user_invited":{
              "name":"User Invited",
              "description":"",
              "title":"User invited",
              "body":"User invited."
            },
            "user_invite_resent":{
              "name":"User Invite Resent",
              "description":"",
              "title":"User invited",
              "body":"User invited."
            },
            "user_invite_accepted":{
              "name":"User Invite Accepted",
              "description":"",
              "title":"User invited",
              "body":"User invited."
            }
          },
          "billing": {
            "billing_disabled": {
              "name": "Billing Disabled",
              "description": "",
              "title": "Billing Disabled",
              "body": "This account is past due and was disabled."
            },
            "billing_disable_today": {
              "name": "Billing Disabled",
              "description": "",
              "title": "Billing Disabled",
              "body": "This account is past due and will be disabled today."
            },
            "billing_disable_soon": {
              "name": "Account To Be Disabled Soon",
              "description": "",
              "title": "Billing Disabled",
              "body": "This account is past due and will be disabled in {{days}} days."
            }
          }
        }
      },
      "client": {
        "topnav": {
          "search": "Search",
          "greeting": "Hello",
          "settings": "User Settings",
          "signout": "Sign Out",
          "actingas": "Acting as",
          "mobile": {
            "accounts": "Accounts",
            "actions": "Actions",
            "settings": "User Settings",
            "signout": "Sign Out"
          }
        },
        "sidenav": {
          "dashboard": "Dashboard",
          "orderengine": "State",
          "reports": {
            "title": "Reports",
            "order": "Order Report",
            "summary": "Summary Report",
            "transaction": "Transactions Report",
            "cycle": {
              "title": "Cycle Reports",
              "daytoday": "Day-to-Day Report",
              "cycle": "Cycle Report"
            },
            "traffic": {
              "title": "Traffic Reports",
              "merchant": "Merchants Report",
              "affiliate": "Affiliates Report"
            },
            "fulfillment": "Fulfillment Report",
            "retention": "Retention",
            "projection": "Projections"
          },
          "order": {
            "title": "Orders",
            "customer": "Customers",
            "creditcard": "Credit Cards",
            "session": "Sessions",
            "rebill": "Rebills",
            "transaction": "Transactions",
            "shippingreceipt": "Shipping Receipts",
            "pendingrebill": "Pending Rebills"
          },
          "crm": {
            "title": "CRM Setup",
            "product": "Products",
            "productschedule": "Product Schedules",
            "campaign": "Campaigns",
            "emailtemplate": "Email Templates",
            "eventhook": "Event Hooks",
            "traffic": {
              "title": "Traffic Setup",
              "affiliate": "Affiliates",
              "tracker": "Tracking"
            },
            "merchant": {
              "title": "Merchants",
              "merchantprovider": "Merchant Accounts",
              "merchantprovidergroup": "Merchant Groups"
            },
            "providers": {
              "title": "3rd Party Providers",
              "fulfillment": "Fulfillment Providers",
              "smtp": "SMTP Providers"
            }
          },
          "settings": {
            "title": "Settings",
            "user": "Users",
            "account": "Accounts",
            "bill": "Billing",
            "role": "Roles",
            "key": {
              "title": "API Keys",
              "signingstring": "User Signing Strings",
              "accesskey": "Access Keys"
            }
          },
          "help": {
            "title": "Help",
            "graphql": "GraphQL",
            "support": "Support"
          },
          "search": "Search"
        },
        "orderengine": {
          "title": "State Machine",
          "queue": "Queue",
          "item": {
            "recover": "Recover",
            "bill": "Bill",
            "failed": "Failed",
            "hold": "Hold",
            "pending": "Pending",
            "shipped": "Shipped",
            "delivered": "Delivered"
          },
          "schema": {
            "title": "State Machine Flow",
            "subtitle": "Below is rough flow of all data in SIX, click an element to load details below"
          },
          "status": {
            "failurerate": "Failure Rate",
            "avgtime": "Avg. Time in Queue",
            "view": "View"
          },
          "details": {
            "title": "Total Orders in",
            "failurerate": "Failure Rate",
            "avgtime": "Avg. Time in Queue",
            "view": "VIEW LIVE QUEUE",
            "downstream": "DOWNSTREAM QUEUE",
            "nodata": "Insufficient Data",
            "livepolling": "Live Pooling"
          },
          "rebills": {
            "snack": {
              "main": "Queue Messages",
              "sub": "Rebill ID"
            },
            "view": "View Rebill",
            "id": "ID",
            "billed": "Bill at",
            "created": "Created at",
            "amount": "Amount",
            "nodata": "No Rebills found."
          },
          "rebill": {
            "history": {
              "title": "Messages",
              "subtitle": "History",
              "enter": "Entered"
            },
            "properties": {
              "title": "Rebill Properties",
              "subtitle": "Details of client rebill",
              "rebill": "Rebill ID",
              "parentsession": "Parent Session ID",
              "created": "Created at",
              "updated": "Last Updated",
              "amount": "Total Billing Amount",
              "campaign": "Associated Campaign"
            }
          }
        },
        "notifications": {
          "title": "Notifications & Alerts",
          "tab": {
            "all": "ALL",
            "notifications": "NOTIFICATIONS",
            "alerts": "ALERTS"
          },
          "today": "Earlier Today",
          "yesterday": "Yesterday",
          "days3": "Past 3 days",
          "week": "Past week",
          "other": "Other",
          "unread": "Unread",
          "markallasread": "MARK ALL AS READ"
        },
        "notificationsquick": {
          "title": "NOTIFICATIONS",
          "settings": "Settings",
          "viewall": "All Notifications",
          "alerts": "Alerts",
          "noresults": "No Notifications Found",
          "view": "View",
          "dismiss": "Dismiss",
          "markallasread": "Mark all as read",
          "markasunread": "Mark as unread",
          "gotolink": "Go to link",
          "copytoclipboard": "Copy to clipboard"
        },
        "notificationspersistent": {
          "pay": "PAY NOW"
        },
        "advancedfilter": {
          "day": "1D",
          "week": "1W",
          "month": "1M",
          "3month": "3M",
          "6month": "6M",
          "year": "1Y",
          "yeartodate": "YTD",
          "all": "ALL",
          "from": "From",
          "to": "To",
          "filters": "Filters",
          "groupby": "Group By",
          "show": "Show Advanced Search",
          "hide": "Hide Advanced Search",
          "apply": "APPLY",
          "reset": "RESET",
          "close": "CLOSE",
          "campaign": "Campaign",
          "affiliate": "Affiliate",
          "subid1": "Sub ID 1",
          "subid2": "Sub ID 2",
          "subid3": "Sub ID 3",
          "subid4": "Sub ID 4",
          "subid5": "Sub ID 5",
          "productschedule": "Product Schedule",
          "merchantprovider": "Merchant Provider",
          "transactiontype": "Transaction Type",
          "processorresponse": "Processor Response",
          "new": "New",
          "rebill": "Rebill",
          "success": "Success",
          "decline": "Decline",
          "error": "Error",
          "refreshdashboardtext": "Refresh Dashboard. Last updated:",
          "refreshreporttext": "Refresh Report"
        },
        "forminputs": {
          "fullname": "Full Name",
          "firstname": "First Name",
          "phone": "Phone",
          "email": "Email",
          "lastname": "Last Name",
          "address": "Address",
          "address2": "Address2",
          "city": "City",
          "state": "State",
          "zip": "ZIP Code",
          "country": "Country",
          "creditcard": {
            "name": "Name on Card",
            "type": "Type",
            "number": "Number",
            "expiration": "Expiration",
            "ccv": "CCV",
            "monthshort": "MM",
            "yearshort": "YYYY"
          }
        },
        "indexpage": {
          "filter": "Filter",
          "search": "Search",
          "del": "Delete",
          "view": "View",
          "exp": "Export",
          "edit": "Edit",
          "copy": "Copy",
          "selected": "items selected",
          "selectall": "Select all",
          "deselectall": "Deselect all",
          "deleteall": "Delete"
        },
        "singlepage": {
          "created": "Created",
          "updated": "Updated",
          "createcanceltitle": "Are you sure you want to close creation modal?",
          "createcanceltext": "You have unsaved changes, if you close this modal changes will be discarded.",
          "createcancelclose": "CLOSE",
          "createcancelcancel": "CANCEL",
          "leavetitle": "Are you sure you want to leave?",
          "leavetext": "You have unsaved changes, if you close this modal changes will be discarded.",
          "leavecancel": "CANCEL",
          "leaveleave": "LEAVE",
          "entityacl": {
            "title": "Entity ACL Setup",
            "basic": "BASIC",
            "advanced": "ADVANCED",
            "save": "SAVE",
            "cancel": "CANCEL",
            "visibility": "Visibility",
            "user": "User",
            "account": "Account",
            "action": "Action",
            "advancedtitle": "Advanced Entity ACL Permissions",
            "edit": "Edit",
            "remove": "Remove",
            "nodata": "No Permissions Found."
          },
          "tag": {
            "tabletitle": "Associated Tags",
            "key": "Key",
            "value": "Value",
            "nodata": "No Tags found.",
            "delete": "Delete Tag",
            "edit": "Edit Tag"
          }
        },
        "profile": {
          "title": "Profile",
          "created": "Created",
          "tabs": {
            "general": "GENERAL",
            "appsanddevices": "APPS AND DEVICES",
            "notificationpreferences": "NOTIFICATION PREFERENCES",
            "accounts": "ACCOUNTS",
            "signingstrings": "SIGNING STRINGS"
          },
          "details": {
            "title": "Profile",
            "subtitle": "general information",
            "firstname": "First Name",
            "lastname": "Last Name",
            "workphone": "Work Phone",
            "cellphone": "Cell Phone",
            "timezone": "Timezone",
            "email": "Email",
            "language": "Language",
            "update": "Update"
          },
          "notifications": {
            "title": "Notification toggle",
            "subtitle": "toggle on/of when to receive notifications",
            "testalert": "Send test alert",
            "testnotification": "Send test notification",
            "devices": {
              "title": "Devices",
              "subtitle": "setup devices for notifications",
              "sms": "SMS",
              "email": "Email",
              "skype": "Skype",
              "slack": "Slack web hook"
            },
            "settings": {
              "title": "Notification settings",
              "subtitle": "Select what notifications you want to receive"
            }
          },
          "accounts": {
            "title": "Your Accounts",
            "accountname": "Name",
            "rolename": "Role",
            "view": "View Account"
          },
          "signingstrings": {
            "title": "Your Signing Strings",
            "name": "Name",
            "signingstring": "Signing String",
            "used": "Last time used",
            "add": "Add new Signing String",
            "remove": "Remove",
            "edit": "Edit",
            "updatetext": "Update Signing String",
            "addtext": "Add new Signing String",
            "cancel": "Cancel",
            "save": "Save",
            "nodata": "No Signing Strings found."
          }
        },
        "dashboard": {
          "state": {
            "setup": {
              "hello": "Hello,",
              "getstarted": "Let’s get started",
              "account": {
                "title": "My Account Settings",
                "settings": {
                  "title": "My Account Settings",
                  "description": "Edit your account name or SIX subscription billing information, and create custom user roles or API access strings."
                },
                "inviteusers": {
                  "title": "Invite Users",
                  "description": "Invite users to your account with assigned roles. SIX will email them a link they can use to finish joining your account."
                },
                "subscriptions": {
                  "title": "Manage SIX Subscription",
                  "description": "Manage your SIX plan and the current cycle’s transactiom volume, and view your receipts."
                }
              },
              "providers": {
                "title": "Provider Settings",
                "merchant": {
                  "title": "Setup Merchant Providers",
                  "description": "Merchant providers allow online merchants to process credit card and debit card transactions. SIX currently supports NMI, Innovio, and Stripe gateways."
                },
                "fulfillment": {
                  "title": "Setup Fulfillment",
                  "description": "A fulfillment provider serves as key logistical partner for getting products out the door and into the hands of customers. We currently support Hashtag, 3PL, and Shipstation."
                },
                "smtp": {
                  "title": "Setup SMTP and E-Mails",
                  "description": "An SMTP provider is an email solution for sending automated, transactional emails to customers. SIX provides default email templates for the most often used email events that you can customize as needed."
                },
                "api": {
                  "title": "API Documentation",
                  "description": "Harness the power of the SIX transactional and graph QL APIs."
                }
              },
              "productsandcampaigns": {
                "title": "Products & Campaigns",
                "products": {
                  "title": "Add Products",
                  "description": "Products are the most important piece of puzzle when it comes to e-commerce."
                },
                "productschedules": {
                  "title": "Setup Product Schedules",
                  "description": "Create cycle-based subscriptions of your products for your customers"
                },
                "campaigns": {
                  "title": "Setup Campaigns",
                  "description": "Lastly, connect your provider accounts, email templates, products and schedules with tracking code and start selling."
                }
              }
            },
            "lowdata": {
              "greeting": "Welcome back,",
              "totalrevenue": "Lifetime Total Revenue",
              "transactions": {
                "title": "Latest Transactions",
                "status": "Status",
                "amount": "Amount",
                "date": "Date",
                "merchantprovider": "Merchant Provider",
                "more": "MORE"
              }
            }
          },
          "item": {
            "newsale": "New Sales",
            "main": "Main",
            "upsell": "Upsells",
            "rebill": "Rebills",
            "decline": "Declines",
            "error": "Errors"
          },
          "eventsfunnel": {
            "title": "Sales Funnel Events",
            "subtitle": "Events by Event type",
            "event": "Event",
            "count": "Count",
            "percentage": "Percentage",
            "relativepercentage": "Relative Percentage",
            "click": "Clicks",
            "lead": "Leads",
            "main": "Main Sales",
            "upsell": "Upsells",
            "confirm": "Confirmed"
          },
          "eventsummary": {
            "title": "Events",
            "subtitle": "events summary",
            "nodata": "No Events Found",
            "confirm": "Confirm",
            "upsell": "Upsell",
            "lead": "Lead",
            "order": "Order",
            "click": "Click",
            "events": "Events"
          },
          "eventsbyaffiliate": {
            "title": "Events by Affiliate",
            "subtitle": "Events from the top Affiliates",
            "affiliate": "Affiliate",
            "count": "Count",
            "percentage": "Percentage",
            "nodata": "No Events Found"
          },
          "transactionbyaffiliate": {
            "title": "Transactions by Affiliate",
            "subtitle": "Transactions from the top Affiliates",
            "affiliate": "Affiliate",
            "count": "Count",
            "countp": "Count%",
            "amount": "Amount",
            "amountp": "Amount%",
            "nodata": "No Transactions Found"
          },
          "transactionsummary": {
            "title": "Transactions",
            "subtitle": "transactions summary",
            "nodata": "No Transactions Found",
            "success": "success",
            "decline": "declines",
            "error": "errors"
          },
          "movers": {
            "title": "Campaigns Watch List",
            "subtitle": "campaigns on the move",
            "nodata": "No Campaigns Found"
          },
          "topcampaigns": {
            "title": "Top Campaigns",
            "subtitle": "Clicks & Conversions",
            "campaign": "Campaign",
            "amount": "Amount"
          },
          "reports": {
            "title": "Reports",
            "subtitle": "Popular reports to monitor metrics",
            "order": {
              "title": "Order Report",
              "subtitle": "Quick reports about orders"
            },
            "summary": {
              "title": "Summary Report",
              "subtitle": "View summary information about transactions"
            },
            "transactions": {
              "title": "Transaction Report",
              "subtitle": "View information about transactions"
            },
            "fulfillment": {
              "title": "Fulfillment Report",
              "subtitle": "Fulfillment overview for campaigns"
            },
            "affiliate": {
              "title": "Affiliate Report",
              "subtitle": "Performance metrics about affiliates"
            },
            "retention": {
              "title": "Retention",
              "subtitle": "Learn how long customers stay"
            }
          }
        },
        "chart": {
          "viewmore": "VIEW MORE",
          "collapse": "COLLAPSE",
          "showtable": "SHOW TABLE",
          "downloadjson": "Download JSON",
          "downloadcsv": "Download CSV",
          "downloadexcel": "Download Excel"
        },
        "summaryreport": {
          "title": "Summary Report",
          "tabletitle": "Transaction Summary Details",
          "sales": "Sales",
          "salesrevenue": "Sales Revenue",
          "rebill": "Rebill",
          "rebillrevenue": "Rebill Revenue",
          "refunds": "Refunds",
          "refundexpenses": "Refund Expenses",
          "declines": "Declines",
          "declinesrevenue": "Declines Revenue",
          "grossrevenue": "Gross Revenue",
          "chargebacks": "Chargebacks",
          "alerts": "Alerts",
          "activecustomers": "Active Customers",
          "date": "Date"
        },
        "transactionreport": {
          "title": "Transactions Report",
          "tabletitle": "Transaction Details",
          "customer": "Customer",
          "campaign": "Campaign",
          "merchantprovider": "Merchant Provider",
          "affiliate": "Affiliate",
          "amount": "Amount",
          "processorresult": "Processor Result",
          "transactiontype": "Transaction Type"
        },
        "merchantreport": {
          "title": "Merchant Report",
          "tabletitle": "Transaction Details",
          "merchantprovider": "Merchant Provider",
          "salescount": "Sales Count",
          "salesgrossrevenue": "Sales Gross Revenue",
          "refundexpenses": "Refund Expenses",
          "refundcount": "Refund Count",
          "netrevenue": "Net Revenue",
          "mtdsalescount": "MTD Sales Count",
          "mtdgrosscount": "MTD Gross Count",
          "chart": {
            "title": "Merchant Processing",
            "subtitle": "Current Groupings",
            "nodata": "No Merchants Found",
            "dollar": "Dollar",
            "revenue": "Sale Gross Revenue"
          }
        },
        "affiliatereport": {
          "title": "Affiliate Report",
          "tabletitle": "Affiliate Summary Details",
          "clickscount": "Clicks Count",
          "partialscount": "Partials Count",
          "affiliate": "Affiliate",
          "partialspercentage": "Partials Percentage",
          "declinescount": "Declines Count",
          "declinespercentage": "Declines Percentage",
          "salescount": "Sales Count",
          "salespercentage": "Sales Percentage",
          "upsellcount": "Upsell Count",
          "upsellpercentage": "Upsell Percentage",
          "upsellsum": "Upsell Sum",
          "amountsum": "Amount Sum"
        },
        "search": {
          "advanced": {
            "toggle": "ADVANCED SEARCH",
            "search": "Search",
            "firstname": "First Name",
            "lastname": "Last Name",
            "phone": "Phone Number",
            "email": "Email Address",
            "trackingnumber": "Shipment Tracking Number",
            "address1": "Address 1",
            "address2": "Address 2",
            "city": "City",
            "zip": "ZIP Code",
            "state": "State",
            "country": "Country",
            "alias": "Transaction Alias",
            "cctype": "Credit Card Type",
            "ccf6": "Credit Card # first 6",
            "ccl4": "Credit Card # last 4",
            "amount": "Amount",
            "created": "Created at",
            "sku": "SKU",
            "name": "Name",
            "response": "Processor Response",
            "status": "Receipt Status",
            "merchantprovider": "Merchant Provider",
            "fulfillmentprovider": "Fulfillment Provider",
            "ship": "Ship",
            "shipdelay": "Shipping Delay",
            "schedulesnum": "Number of Schedules",
            "bill": "Billed at",
            "parentsession": "Parent Session",
            "product": "Product",
            "start": "Start",
            "end": "End",
            "price": "Price",
            "id": "ID"
          },
          "filter": "Filter Results",
          "category": "Category",
          "refined": "Refined Results",
          "reset": "CLEAR FILTERS",
          "date": {
            "range": "Date Range",
            "toggle": "Date",
            "to": "to"
          },
          "results": "Search Results",
          "sort": {
            "title": "Sort By",
            "createasc": "created at asc",
            "createdesc": "created at desc",
            "updateasc": "updated at asc",
            "updatedesc": "updated at desc",
            "def": "default"
          },
          "nodata": "Sorry, there were no results.",
          "entersearch": "Please enter a search query.",
          "perfect": {
            "view": "VIEW",
            "preview": "Preview",
            "created": "Created",
            "customer": {
              "shipaddress": "Shipping Address",
              "recenttransactions": "Recent Transactions"
            },
            "transaction": {
              "title": "Transaction Info",
              "product": "Products"
            },
            "product": {
              "title": "Product Info"
            },
            "campaign": {
              "title": "Campaign Info",
              "schedules": "Product Schedules"
            },
            "rebill": {
              "title": "Rebill Info",
              "transactions": "Transactions"
            },
            "schedule": {
              "title": "Product Schedule Info",
              "schedules": "Schedules"
            },
            "merchantprovider": {
              "title": "Merchant Provider Info",
              "enabled": "Enabled",
              "allowprepaid": "Allow Prepaid",
              "gatewayname": "Gateway Name",
              "gatewaytype": "Gateway Type"
            },
            "creditcard": {
              "title": "Credit Card Info",
              "name": "Customer Name",
              "expiration": "Expiration",
              "number": "Number",
              "ccv": "CCV"
            },
            "affiliate": {
              "title": "Affiliate Info",
              "name": "Name",
              "affiliateid": "Affiliate ID"
            }
          }
        },
        "account": {
          "title": "Account",
          "actas": "Act as this Account",
          "index": {
            "title": "Accounts",
            "header": {
              "name": "Name",
              "active": "Active",
              "id": "ID",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "users": "USERS",
            "keys": "ACCESS KEYS",
            "billing": "BILLING",
            "agreements": "AGREEMENTS"
          },
          "details": {
            "title": "Account Details",
            "edit": "Edit Account Details",
            "name": "Name",
            "activated": "Activated",
            "cancel": "Cancel",
            "save": "Save"
          },
          "users": {
            "title": "Associated Users",
            "add": "Add User to Account",
            "invite": "Invite User to Account",
            "resend": "Resend Invitation",
            "header": {
              "name": "Name",
              "role": "Role",
              "status": "Status"
            },
            "edit": "Edit User Role",
            "view": "View User",
            "remove": "Remove User from the Account",
            "removemessage": "Are you sure you want to remove this User from the account?",
            "nodata": "No Users Found"
          },
          "keys": {
            "title": "Access Keys",
            "header": {
              "name": "Name",
              "access": "Access Key",
              "secret": "Secret Key",
              "created": "Created",
              "notes": "Notes"
            },
            "add": "Add Access Keys",
            "view": "View Access Keys",
            "edit": "Edit Access Keys",
            "remove": "Remove Access Keys",
            "cancel": "CANCEL",
            "close": "CLOSE",
            "update": "UPDATE"
          },
          "billing": {
            "currenttitle": "Current Invoices",
            "currentsubtitle": "Billings due",
            "pasttitle": "Past Invoices",
            "pastsubtitle": "Completed billings",
            "overduewarning": "Invoice Overdue",
            "overduetext": "You currently have an overdue invoice for",
            "view": "View Invoice",
            "noresults": "No Billings found.",
            "header": {
              "issue": "Issue Date",
              "start": "Period Start",
              "end": "Period Ending",
              "balance": "Balance",
              "status": "Status",
              "due": "Due Date"
            },
            "pay": "PAY NOW",
            "summary": {
              "title": "Current Transaction Count",
              "description": "View Current Transaction count and amount. Pay and view invoices. View transactions over time and predict the future."
            }
          }
        },
        "user": {
          "title": "User",
          "index": {
            "title": "Users",
            "header": {
              "name": "Name",
              "email": "Email",
              "active": "Active",
              "terms": "Terms and Conditions",
              "id": "ID",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS"
          },
          "details": {
            "title": "User Details",
            "createtitle": "Create new User",
            "account": "Account",
            "newaccount": "New Account",
            "edit": "Edit User Details",
            "activated": "Activated",
            "role": "Role",
            "name": "Name",
            "email": "Email",
            "cancel": "CANCEL",
            "save": "SAVE"
          },
          "account": {
            "title": "Associated Accounts",
            "add": "Add Account to User",
            "account": "Account",
            "role": "Role",
            "status": "Status",
            "edit": "Edit Role",
            "view": "View Account",
            "remove": "Remove Account from the User",
            "removetext": "Are you sure you want to remove this Account from the User?"
          }
        },
        "customer": {
          "title": "Customer",
          "index": {
            "title": "Customers",
            "header": {
              "firstname": "First Name",
              "lastname": "Last Name",
              "state": "State",
              "city": "City",
              "id": "ID",
              "created": "Created",
              "updated": "Updated",
              "line1": "Address",
              "email": "Email",
              "phone": "Phone",
              "zip": "ZIP Code",
              "country": "Country"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "transaction": "TRANSACTIONS",
            "session": "SESSIONS",
            "fulfillment": "FULFILLMENT"
          },
          "info": {
            "createtitle": "Create new Customer",
            "shiptitle": "Shipping Information",
            "shipsubtitle": "Address where fulfillment will ship packages",
            "edit": "EDIT CUSTOMER",
            "shipedit": "Edit Shipping Address",
            "cancel": "CANCEL",
            "save": "SAVE",
            "update": "UPDATE"
          },
          "notes": {
            "title": "Notes",
            "subtitle": "Customer service notes",
            "add": "Add New Note",
            "del": "Delete Note",
            "nodata": "No Notes found."
          },
          "rebill": {
            "title": "Upcoming Rebills",
            "subtitle": "Future Rebills and Upcoming Transactions",
            "billed": "Bill at",
            "amount": "Amount",
            "cancel": "Cancel Transaction",
            "edit": "Edit Transaction",
            "nodata": "No Upcoming Transactions found."
          },
          "rebilledit": {
            "title": "Edit Transaction",
            "subtitle": "modify an upcoming transaction",
            "date": "Transaction Date",
            "cancel": "CANCEL",
            "save": "SAVE",
            "price": "Price"
          },
          "events": {
            "title": "Customer Events",
            "subtitle": "Sessions, Transactions and Leads",
            "nodata": "No Events found.",
            "today": "Today",
            "days7": "Last 7 days",
            "days30": "Last 30 days",
            "days90": "Last 90 days",
            "other": "Other"
          },
          "transaction": {
            "title": "Historical Transactions",
            "subtitle": "Completed Transactions",
            "nodata": "No Transactions Found.",
            "alias": "Alias",
            "response": "Processor Response",
            "productnum": "Number of Products",
            "amount": "Amount",
            "view": "View Transaction"
          },
          "session": {
            "title": "Sessions",
            "view": "View Session",
            "nodata": "No Sessions found.",
            "name": "Name",
            "campaign": "Campaign",
            "productschedulenum": "Number of Product Schedules",
            "rebillnum": "Number of Rebills"
          },
          "creditcard": {
            "title": "Billing Information",
            "subtitle": "Billing Address & Credit Card information",
            "addoption": "Add Credit Card",
            "editoption": "Edit Credit Card",
            "removeoption": "Remove Credit Card",
            "edittitle": "Edit Credit Card",
            "createtitle": "Create new Credit Card",
            "createtext": "Create new Credit Card with the associated user",
            "expirationmonth": "Expiration Date Month",
            "expirationyear": "Expiration Date Year",
            "billingaddress": "Billing Address",
            "sameaddress": "Same as Customer Address",
            "cancel": "Cancel",
            "update": "Update",
            "save": "Save",
            "nodata": "No Credit Cards found.",
            "expiration": "Expiration"
          }
        },
        "creditcard": {
          "title": "Credit Card",
          "index": {
            "title": "Credit Cards",
            "name": "Name",
            "expiration": "Expiration",
            "country": "Country",
            "state": "State",
            "city": "City",
            "id": "ID",
            "created": "Created",
            "updated": "Updated",
            "line1": "Address",
            "zip": "ZIP Code"
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "customer": "CUSTOMERS"
          },
          "customer": {
            "title": "Associated Customers",
            "view": "View Customer",
            "nodata": "No Customers found.",
            "name": "Name",
            "city": "City",
            "state": "State",
            "zip": "Zip Code"
          }
        },
        "bill": {
          "index": {
            "title": "Bills",
            "header": {
              "start": "Period Start",
              "end": "Period End",
              "overdue": "Overdue",
              "balance": "Balance",
              "id": "ID",
              "account": "Account",
              "created": "Created",
              "updated": "Updated",
              "available": "Available",
              "paid": "Paid"
            }
          },
          "tab": {
            "general": "GENERAL DETALS"
          },
          "details": {
            "title": "Invoice Summary",
            "subtitle": "Billing Information",
            "start": "Period Start",
            "end": "Period End",
            "due": "Due Date",
            "edit": "Edit Invoice",
            "back": "BACK TO INVOICES",
            "table": {
              "title": "Invoice Details",
              "subtitle": "Itemized Breakdown of Charges",
              "description": "Description",
              "created": "Created",
              "amount": "Amount",
              "total": "Total"
            },
            "pay": "PAY NOW",
            "detailedit": "Edit",
            "detailremove": "Remove",
            "account": "Account",
            "createtitle": "Create new Bill",
            "cancel": "CANCEL",
            "save": "SAVE",
            "additem": {
              "title": "Add New Item",
              "save": "Save",
              "cancel": "Cancel"
            }
          },
          "title": "Bill"
        },
        "product": {
          "title": "Product",
          "nodelete": "You can not delete this product as long as it is associated with a product schedule.",
          "index": {
            "title": "Products",
            "header": {
              "name": "Product Name",
              "sku": "SKU",
              "ship": "Ship",
              "delay": "Shipping Delay",
              "id": "ID",
              "price": "Price",
              "provider": "Fulfillment Provider",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "images": "IMAGES",
            "schedule": "SCHEDULES",
            "campaign": "CAMPAIGNS",
            "merchantgroupassociation": "MERCHANT GROUP ASSOCIATIONS"
          },
          "info": {
            "title": "Product Details",
            "createtitle": "Create new Product",
            "name": "Product Name",
            "sku": "SKU",
            "defaultprice": "Default Price",
            "dynamicprice": "Allow Dynamic Pricing",
            "minprice": "Minimum Dynamic Price",
            "maxprice": "Maximum Dynamic Price",
            "ship": "Shippable Product",
            "shipdelay": "Shipping Delay (minutes)",
            "fulfillmentprovider": "Fulfillment Provider",
            "edit": "Edit Product",
            "del": "Delete Product",
            "cancel": "CANCEL",
            "update": "UPDATE",
            "create": "CREATE",
            "viewfulfillmentprovider": "View Fulfillment Provider",
            "description": "Description",
            "attributes": {
              "title": "Product Attributes",
              "dimension": "Dimensions",
              "unit": "Unit",
              "width": "Width",
              "height": "Height",
              "length": "Length",
              "weight": "Weight"
            }
          },
          "image": {
            "upload": {
              "title": "Upload New Image",
              "dragdrop": "Drag and Drop Image",
              "select": "Select Image",
              "upload": "UPLOAD"
            },
            "gallery": {
              "title": "Uploaded Images"
            },
            "view": {
              "name": "Name",
              "description": "Description",
              "save": "SAVE",
              "default": "Default Image",
              "cancel": "CANCEL",
              "nodata": "No Images Uploaded."
            }
          },
          "schedules": {
            "title": "Product Schedules",
            "name": "Name",
            "count": "Number of Schedules",
            "add": "Add new Product Schedule",
            "view": "View Product Schedule",
            "remove": "Remove from Product Schedule",
            "nodata": "No Product Schedules found."
          },
          "campaign": {
            "title": "Campaigns",
            "name": "Name",
            "created": "Created at",
            "productnum": "Total Products",
            "schedulednum": "Total Scheduled",
            "view": "View Campaign",
            "nodata": "No Campaigns found."
          },
          "merchantgroupassociation": {
            "title": "Merchant Group Associations",
            "id": "ID",
            "merchantgroup": "Merchant Group",
            "campaign": "Campaign",
            "add": "Add new Association",
            "remove": "Remove Association",
            "viewprovider": "View Merchant Provider Group",
            "viewcampaign": "View Campaign",
            "nodata": "No Merchant Provider Group Associations found.",
            "dialog": {
              "title": "Select Campaign and Merchant Provider Group",
              "group": "Merchant Provider Group",
              "campaign": "Campaign",
              "add": "Add",
              "cancel": "Cancel"
            }
          }
        },
        "productschedule": {
          "title": "Product Schedule",
          "index": {
            "title": "Product Schedules",
            "header": {
              "name": "Name",
              "merchantprovidergroup": "Merchant Provider Group",
              "numofcycles": "Number of Cycles",
              "id": "ID",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "cycle": "CYCLES",
            "list": "LIST",
            "campaign": "CAMPAIGNS"
          },
          "info": {
            "createtitle": "Create new Product Schedule",
            "title": "Product Schedule Details",
            "name": "Product Schedule Name",
            "merchantprovidergroup": "Merchant Provider Group",
            "cancel": "CANCEL",
            "save": "SAVE",
            "edit": "Edit Product Schedule",
            "viewmerchantprovidergroup": "View Merchant Provider Group"
          },
          "cycle": {
            "addtitle": "Add Cycle",
            "edittitle": "Edit Cycle",
            "title": "Cycles",
            "add": "ADD",
            "clear": "CLEAR",
            "save": "SAVE",
            "cancel": "CANCEL",
            "name": "Product Name",
            "image": "Image",
            "schedulename": "Product Schedule Name",
            "price": "Price",
            "pricetip": "Price for period of time",
            "start": "Start",
            "starttip": "Start of period (0 is immediate)",
            "end": "End",
            "endtip": "Ends & switches to next product schedule",
            "period": "Period",
            "periodtip": "Recurring billing & shipping period",
            "ship": "Ship",
            "nodata": "No Cycles found.",
            "view": "View Product",
            "edit": "Edit Cycle",
            "remove": "Remove Cycle"
          },
          "campaign": {
            "title": "Campaigns",
            "name": "Name",
            "created": "Created at",
            "productnum": "Total Products",
            "schedulednum": "Total Scheduled",
            "view": "View Campaign",
            "nodata": "No Campaigns found."
          }
        },
        "campaign": {
          "title": "Campaign",
          "index": {
            "title": "Campaigns",
            "header": {
              "name": "Name",
              "created": "Created",
              "updated": "Updated",
              "productnum": "Total Products",
              "schedulednum": "Total Scheduled",
              "id": "ID",
              "showprepaid": "Show Prepaid",
              "allowprepaid": "Allow Prepaid"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "productschedules": "PRODUCT SCHEDULES",
            "affiliates": "AFFILIATES",
            "trackingcode": "TRACKING CODE"
          },
          "info": {
            "createtitle": "Create new Campaign",
            "title": "Campaign Details",
            "name": "Name",
            "allowprepaid": "Allow Prepaid",
            "showprepaid": "Show Prepaid",
            "defaultgroup": "Default Merchant Provider Group",
            "cancel": "CANCEL",
            "save": "SAVE",
            "edit": "Edit Campaign"
          },
          "email": {
            "title": "Associated Email Templates",
            "nodata": "No Email Templates found.",
            "name": "Name",
            "subject": "Subject",
            "type": "Type",
            "smtpprovider": "SMTP Provider",
            "add": "Associate Email Template",
            "addtext": "Select Email Template",
            "addbutton": "ADD",
            "view": "View Email Template",
            "remove": "Disassociate Email Template",
            "removetext": "Are you sure you want to delete?"
          },
          "productschedule": {
            "title": "Associated Product Schedules",
            "nodata": "No Product Schedules found.",
            "name": "Name",
            "productnumber": "Products in Schedule",
            "add": "Associate Product Schedule",
            "addtext": "Select Product Schedule",
            "addbutton": "ADD",
            "view": "View Product Schedule",
            "remove": "Disassociate Product Schedule",
            "removetext": "Are you sure you want to delete?"
          },
          "affiliate": {
            "name": "Name"
          },
          "affiliateallowed": {
            "title": "Allowed Affiliates",
            "nodata": "No Affiliates allowed.",
            "add": "Add Affiliate to allowed list",
            "addtext": "Select Affiliate",
            "addbutton": "ADD",
            "view": "View Affiliate",
            "remove": "Remove Affiliate from allowed list",
            "removetext": "Are you sure you want to delete?"
          },
          "affiliatedenied": {
            "title": "Denied Affiliates",
            "nodata": "No Affiliates denied.",
            "add": "Add Affiliate to denied list",
            "addtext": "Select Affiliate",
            "addbutton": "ADD",
            "view": "View Affiliate",
            "remove": "Remove Affiliate from denied list",
            "removetext": "Are you sure you want to delete?"
          },
          "tracking": {
            "title": "Tracking Code",
            "subtitle": "Copy this Code to your HTML page header",
            "copy": "Copy to clipboard"
          }
        },
        "eventhook": {
          "index": {
            "title": "Event Hooks",
            "header": {
              "id": "ID",
              "name": "Name",
              "active": "Active",
              "type": "Event Type",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "custom": "EVENT HOOKS",
            "shared": "MANAGED EVENT HOOKS"
          },
          "shared": {
            "title": "Managed Event Hooks",
            "subtitle": "Copy code of managed event hook",
            "type": "Event Type",
            "search": "Search"
          },
          "info": {
            "title": "Event Hook Details",
            "createtitle": "Create new Event Hook",
            "name": "Name",
            "type": "Event Type",
            "active": "Event Hook Active",
            "edit": "Edit Event Hook",
            "save": "SAVE",
            "cancel": "CANCEL"
          },
          "code": {
            "title": "Event Hook Code",
            "save": "SAVE"
          }
        },
        "emailtemplate": {
          "title": "Email Template",
          "index": {
            "title": "Email Templates",
            "header": {
              "name": "Name",
              "subject": "Subject",
              "type": "Type",
              "smtpprovider": "SMTP Provider",
              "id": "ID",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "preview": "PREVIEW",
            "custom": "EMAIL TEMPLATES",
            "shared": "MANAGED EMAIL TEMPLATES"
          },
          "info": {
            "createtitle": "Create new Email Template",
            "title": "Email Template Details",
            "subtitle": "Edit HTML templates below or load defaults from right menu",
            "edit": "Edit Email Template",
            "name": "Name",
            "type": "Template Type",
            "smtpprovider": "SMTP Provider",
            "subject": "Subject",
            "body": "Email ",
            "cancel": "CANCEL",
            "save": "SAVE",
            "viewsmtpprovider": "View SMTP Provider"
          },
          "token": {
            "title": "Tokens",
            "subtitle": "Choose any of the following tokens to add into your email template",
            "type": "Event Type",
            "search": "Search"
          },
          "shared": {
            "title": "Managed Email Templates",
            "subtitle": "Copy body of managed email template"
          },
          "preview": {
            "title": "Email Template Preview",
            "subtitle": "preview how the template will look in an email"
          }
        },
        "affiliate": {
          "title": "Affiliate",
          "index": {
            "title": "Affiliates",
            "header": {
              "name": "Name",
              "affiliateid": "Affiliate ID",
              "created": "Created at",
              "updated": "Updated at",
              "id": "ID"
            }
          },
          "tab": {
            "tracking": "TRACKING",
            "session": "SESSIONS",
            "campaign": "CAMPAIGNS"
          },
          "info": {
            "createtitle": "Create new Affiliate",
            "name": "Affiliate Name",
            "id": "Affiliate ID",
            "edit": "EDIT AFFILIATE",
            "cancel": "CANCEL",
            "save": "SAVE",
            "update": "UPDATE"
          },
          "tracking": {
            "title": "Associated Trackers",
            "name": "Name",
            "type": "Type",
            "event": "Event",
            "data": "Tracking Data",
            "nodata": "No Trackers found.",
            "associate": "Associate Tracker",
            "associatetext": "Select Tracker",
            "view": "View Tracker",
            "disassociate": "Disassociate Tracker",
            "disassociatetext": "Are you sure you want to delete?"
          },
          "session": {
            "title": "Associated Sessions",
            "customer": "Customer",
            "campaign": "Campaign",
            "rebilltotal": "Total Rebills",
            "scheduledtotal": "Total Scheduled",
            "nodata": "No Sessions found.",
            "view": "View Session"
          },
          "campaign": {
            "title": "Associated Campaigns",
            "name": "Name",
            "created": "Created at",
            "updated": "Updated at",
            "totalscheduled": "Total Scheduled",
            "view": "View Campaign",
            "nodata": "No Campaigns found"
          }
        },
        "tracker": {
          "title": "Tracker",
          "index": {
            "title": "Trackers",
            "header": {
              "name": "Name",
              "type": "Type",
              "event": "Event",
              "data": "Tracking Data",
              "id": "ID",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "affiliate": "AFFILIATES",
            "campaign": "CAMPAIGNS"
          },
          "info": {
            "createtitle": "Create new Tracker",
            "title": "Tracker Details",
            "name": "Tracker Name",
            "type": "Tracking Type",
            "eventtype": "Event Type",
            "eventtypeadd": "Add Event Type",
            "data": "Tracking Data",
            "link": "Tracking Link",
            "save": "SAVE",
            "cancel": "CANCEL",
            "edit": "Edit Tracker"
          },
          "affiliate": {
            "title": "Associated Affiliates",
            "name": "Name",
            "id": "Affiliate ID",
            "created": "Created at",
            "updated": "Updated at",
            "nodata": "No Affiliates found.",
            "associate": "Associate Affiliate",
            "associatetext": "Select Affiliate",
            "confirm": "ASSOCIATE",
            "view": "View Affiliate",
            "disassociate": "Disassociate Affiliate",
            "disassociatetext": "Are you sure you want to delete?"
          },
          "campaign": {
            "title": "Associated Campaigns",
            "name": "Name",
            "created": "Created at",
            "updated": "Updated at",
            "nodata": "No Campaigns found.",
            "associate": "Associate Campaign",
            "associatetext": "Select Campaign",
            "confirm": "ASSOCIATE",
            "view": "View Campaign",
            "disassociate": "Disassociate Campaign",
            "disassociatetext": "Are you sure you want to delete?"
          }
        },
        "session": {
          "title": "Session",
          "index": {
            "title": "Sessions",
            "header": {
              "campaign": "Campaign Name",
              "customer": "Customer Name",
              "schedulesnum": "Number of Product Schedules",
              "rebillsnum": "Number of Rebills",
              "id": "ID",
              "alias": "Alias",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "affiliate": "AFFILIATES",
            "watermark": "WATERMARK"
          },
          "customer": {
            "title": "Customer Information",
            "view": "View Customer"
          },
          "rebill": {
            "title": "Associated Rebills",
            "billed": "Bill at",
            "amount": "Amount",
            "nodata": "No Rebills found.",
            "view": "View Rebill"
          },
          "campaign": {
            "title": "Associated Campaigns",
            "name": "Name",
            "created": "Created at",
            "nodata": "No Campaigns found.",
            "view": "View Campaign"
          },
          "affiliate": {
            "title": "Associated Affiliates",
            "name": "Name",
            "id": "Affiliate ID",
            "created": "Created at",
            "nodata": "No Affiliates found.",
            "view": "View Affiliate"
          }
        },
        "transaction": {
          "title": "Transaction",
          "index": {
            "title": "Transactions",
            "header": {
              "alias": "Alias",
              "amount": "Amount",
              "created": "Created at",
              "response": "Processor Response",
              "id": "ID",
              "updated": "Updated",
              "processor": "Merchant Provider"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "refund": "REFUND TRANSACTION"
          },
          "info": {
            "title": "Transaction Details",
            "rebillview": "View Rebill",
            "merchantproviderview": "View Merchant Provider",
            "alias": "Alias",
            "amount": "Amount",
            "merchantprovider": "Merchant Provider"
          },
          "processor": {
            "title": "Processor Response",
            "code": "Auth Code",
            "message": "Processor Message",
            "text": "Processor Text"
          },
          "refund": {
            "title": "Refund Transaction",
            "amount": "Amount",
            "amounttorefund": "Amount to Refund",
            "refundall": "Refund All",
            "cancel": "CANCEL",
            "confirm": "REFUND"
          },
          "product": {
            "title": "Associated Products",
            "name": "Name",
            "sku": "SKU",
            "amount": "Amount",
            "view": "View Product",
            "nodata": "No Products found."
          }
        },
        "rebill": {
          "title": "Rebill",
          "index": {
            "title": "Rebills",
            "header": {
              "id": "ID",
              "bill": "Bill at",
              "created": "Created at",
              "amount": "Amount",
              "updated": "Updated",
              "customer": "Customer",
              "state": "State"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "transactions": "TRANSACTIONS",
            "receipts": "SHIPPING RECEIPTS"
          },
          "info": {
            "title": "Rebill Information",
            "billed": "Billed at date",
            "amount": "Amount",
            "parentsession": "Parent Session",
            "customer": "Customer",
            "customerview": "View Customer",
            "sessionview": "View Session"
          },
          "shippingreceipt": {
            "title": "Associated Shipping Receipts",
            "nodata": "No Shipping Receipts found",
            "status": "Status",
            "trackingnumber": "Tracking Number",
            "created": "Created At",
            "updated": "Updated At"
          },
          "productschedule": {
            "title": "Associated Product Schedules",
            "nodata": "No Product Schedules found.",
            "name": "Name",
            "merchantprovidergroup": "Merchant Provider Group",
            "count": "Number of cycles"
          },
          "transaction": {
            "title": "Associated Transactions",
            "nodata": "No Transactions found.",
            "alias": "Alias",
            "amount": "Amount",
            "response": "Response",
            "created": "Created",
            "updated": "Updated"
          }
        },
        "role": {
          "title": "Role",
          "index": {
            "title": "Roles",
            "header": {
              "id": "ID",
              "active": "Active",
              "name": "Name",
              "usernum": "Assigned Users",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "permissions": "PERMISSIONS",
            "shared": "MANAGED ROLES",
            "custom": "ROLES",
            "acls": "USER ACLS"
          },
          "allowed": {
            "title": "Permissions",
            "nodata": "No Permissions found.",
            "edit": "Edit Permission",
            "delete": "Delete Permission"
          },
          "info": {
            "createtitle": "Create New Role",
            "name": "Name",
            "cancel": "CANCEL",
            "save": "SAVE",
            "option": "Option",
            "permission": "Permission"
          },
          "acl": {
            "title": "Assigned Users",
            "nodata": "No Users Assigned",
            "delete": "Delete User ACL",
            "id": "ID",
            "image": "Image",
            "user": "User",
            "created": "Created",
            "updated": "Updated"
          }
        },
        "shippingreceipt": {
          "title": "Shipping Receipt",
          "index": {
            "title": "Shipping Receipts",
            "header": {
              "status": "Status",
              "number": "Tracking ID",
              "created": "Created at",
              "updated": "Updated at",
              "id": "ID",
              "carrier": "Tracking Carrier",
              "provider": "Fulfillment Provider"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS"
          },
          "info": {
            "title": "Shipping Receipt Details",
            "number": "Tracking ID",
            "carrier": "Tracking Carrier",
            "fulfillmentprovider": "Fulfillment Provider",
            "fulfillmentproviderview": "Fulfillment Provider"
          },
          "history": {
            "title": "Shipping Receipt State History"
          },
          "status": {
            "pending": "Pending",
            "unknown": "Unknown",
            "intransit": "In Transit",
            "delivered": "Delivered",
            "returned": "Returned"
          }
        },
        "fulfillment": {
          "title": "Fulfillment Provider",
          "index": {
            "title": "Fulfillment Providers",
            "header": {
              "name": "Name",
              "provider": "Provider",
              "id": "ID",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "validate": "VALIDATE"
          },
          "info": {
            "title": "Fulfillment Details",
            "createtitle": "Create new Fulfillment Provider",
            "edit": "Edit Fulfillment Provider Details",
            "provider": "Provider",
            "name": "Name",
            "username": "Username",
            "password": "Password",
            "threeplkey": "ThreePL Key",
            "customerid": "Customer ID",
            "facilityid": "Facility ID",
            "threeplid": "ThreePL ID",
            "apikey": "API Key",
            "apisecret": "API Secret Key",
            "cancel": "CANCEL",
            "save": "SAVE"
          },
          "validate": {
            "title": "Validate Fulfillment Provider",
            "text": "Check if Fulfillment Provider is enabled and provided credentials/parameters are valid",
            "response": "Validation Response",
            "validate": "VALIDATE"
          }
        },
        "smtp": {
          "title": "SMTP Provider",
          "index": {
            "title": "SMTP Providers",
            "header": {
              "name": "Name",
              "fromname": "From Name",
              "fromemail": "From Email",
              "hostname": "Hostname",
              "username": "Username",
              "id": "ID",
              "port": "Port",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "emailtemplate": "EMAIL TEMPLATES",
            "validate": "VALIDATE"
          },
          "info": {
            "title": "SMTP Details",
            "createtitle": "Create new SMTP Provider",
            "edit": "Edit SMTP Provider Details",
            "name": "Name",
            "fromname": "From Name",
            "fromemail": "From Email",
            "host": "Host",
            "username": "Username",
            "password": "Password",
            "port": "Port",
            "cancel": "CANCEL",
            "save": "SAVE"
          },
          "emailtemplate": {
            "title": "Associated Email Templates",
            "name": "Name",
            "subject": "Subject",
            "type": "Type",
            "view": "View Email Template",
            "nodata": "No Email Templates found"
          },
          "validate": {
            "title": "Validate SMTP Provider",
            "text": "Please provide an email address below and SIX will try to send you a test email using provided SMTP Provider. Email will be sent from ",
            "textsecond": "Results will be displayed in right column.",
            "email": "Receiver email address",
            "emailtip": "Please enter a valid email address",
            "response": "Validation Response",
            "validate": "VALIDATE"
          }
        },
        "merchantprovidergroup": {
          "title": "Merchant Provider Group",
          "index": {
            "title": "Merchant Provider Groups",
            "header": {
              "name": "Name",
              "merchantnum": "Number of Merchant Providers",
              "id": "ID",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS"
          },
          "info": {
            "createtitle": "Create new Merchant Provider Group",
            "name": "Name",
            "edit": "EDIT MERCHANT PROVIDER GROUP",
            "cancel": "CANCEL",
            "update": "UPDATE",
            "save": "SAVE"
          },
          "merchant": {
            "addtitle": "Add Merchant Provider",
            "distribution": "Distribution",
            "merchant": "Merchant Provider",
            "add": "ADD",
            "clear": "CLEAR",
            "title": "Associated Merchant Providers",
            "view": "View Merchant Provider",
            "edit": "Update Distribution",
            "disassociate": "Disassociate Merchant Provider",
            "disassociatetext": "Are you sure you want to delete?",
            "nodata": "No Merchant Providers found."
          }
        },
        "merchantprovider": {
          "title": "Merchant Provider",
          "index": {
            "title": "Merchant Providers",
            "header": {
              "name": "Name",
              "processor": "Processor Name",
              "type": "Processor Type",
              "id": "ID",
              "enabled": "Enabled",
              "created": "Created",
              "updated": "Updated"
            }
          },
          "tab": {
            "general": "GENERAL DETAILS",
            "processing": "PROCESSING",
            "merchantprovidergroup": "MERCHANT PROVIDER GROUPING"
          },
          "info": {
            "edit": "EDIT MERCHANT PROVIDER",
            "cancel": "CANCEL",
            "update": "UPDATE",
            "save": "SAVE",
            "settings": {
              "title": "Settings",
              "name": "Name",
              "enabled": "Enabled",
              "allowprepaid": "Allow Prepaid cards",
              "accepted": "Accepted paypment methods"
            },
            "processing": {
              "title": "Processing",
              "monthlycapd": "Monthly Cap ($)",
              "monthlycapc": "Monthly Cap (count)",
              "weeklycap": "Weekly Cap (count)",
              "dailycap": "Daily Cap (count)",
              "transactionfee": "Transaction Fee ($)",
              "discountrate": "Discount Rate (%)",
              "chargeback": "Max chargeback ratio (%)",
              "reserve": "Reserve rate (%)"
            },
            "gateway": {
              "title": "Gateway information",
              "name": "Name",
              "type": "Type",
              "processorid": "Processor ID",
              "productid": "Product ID",
              "username": "Username",
              "password": "Password",
              "apikey": "API Key"
            },
            "service": {
              "title": "Customer Service",
              "uri": "URI",
              "email": "Email",
              "phone": "Phone",
              "description": "Description"
            }
          },
          "merchantprovidergroup": {
            "title": "Associated Merchant Provider Groups",
            "view": "View Merchant Provider Group",
            "nodata": "No Merchant Provider Groups found.",
            "name": "Name"
          }
        },
        "deletedialog": {
          "text": "Are you sure you want to delete?",
          "del": "DELETE",
          "cancel": "CANCEL"
        },
        "associatedialog": {
          "text": "Select entity to associate",
          "associate": "ASSOCIATE",
          "cancel": "CANCEL",
          "entity": "Entity"
        },
        "messagedialog": {
          "title": "Are you sure?",
          "button": "OK"
        },
        "inviteuser": {
          "title": "Invite new User",
          "email": "User Email",
          "role": "Role",
          "cancel": "CANCEL",
          "invite": "INVITE"
        },
        "terms": {
          "title": "Please accept our Terms and Conditions to get started.",
          "accept": "Accept",
          "logout": "Log Out",
          "end": "End",
          "done": "Done",
          "download": "Download"
        },
        "register": {
          "progress": {
            "account": "Account",
            "plan": "Plan",
            "payment": "Payment"
          },
          "userterms": "By accepting this invitation and creating a SIX account, you agree to the",
          "licenseagreement": "End User License Agreement",
          "form": {
            "title": "Welcome!",
            "subtitle": "We're excited to have you join us",
            "text": "To get started with your 90 day trial simply enter your company name and verify your information.",
            "company": "Company Name",
            "companyhint": "Must be unique to SIX",
            "firstname": "First Name",
            "lastname": "Last Name",
            "cont": "Continue"
          },
          "thankyou": {
            "title": "Your account is now active and you may begin exploring at your leisure.",
            "subtitle": "HOWEVER, we still need some accounting details to complete your registration. Remember, you won't be able to take transactions until your account registration is complete. Click complete to go to your billing profile.",
            "text": "You're complimentary 90 days begins now!",
            "complete": "Complete"
          },
          "welcome": "Welcome!",
          "signout": "Sign out"
        },
        "payment": {
          "ownerterms": "By accepting this invitation and creating a SIX account, you agree to the",
          "licenseagreement": "End User License Agreement",
          "title": "Payment",
          "errortitle": "Payment Declined",
          "errormessage": "Please check your card information and try again or use a different card",
          "balancedue": "Total due",
          "declinetitle": "Your last SIX",
          "declineinfo": "Tier payment was declined",
          "completepurchasereactivateaccount": "Complete Purchase & Reactivate Account",
          "recurringtitle": "Make Payment",
          "existingcard": "Choose Card",
          "savedcard": "Saved Card",
          "newcard": "Or Use a New Card",
          "retry": "Retry Payment",
          "cancel": "CANCEL",
          "form": {
            "number": "Card Number",
            "code": "Security Code",
            "name": "Name on Card",
            "month": "Month",
            "year": "Year"
          },
          "info": {
            "title": "You have chosen the SIX",
            "tier": "Tier",
            "change": "Change Plan",
            "total": "Total billed today",
            "finish": "Finish and Pay"
          },
          "processing": "Processing Payment ...",
          "plans": {
            "basic": "Basic",
            "professional": "Professional",
            "premium": "Premium",
            "pertransaction": "per transaction",
            "permonth": "per month",
            "transactionfee":"transaction fee",
            "minimum": "minimum per month",
            "campaign": "campaign",
            "choose": "choose",
            "unlimited": "Unlimited"
          },
          "alert": {
            "owner": "In order to start using SIX please finalize your payment.",
            "proceed": "PROCEED TO PAYMENT",
            "user": "Account payment issues, please contact account owner.",
            "signout": "SIGN OUT"
          }
        },
        "acceptinvite": {
          "badlogin": "To accept this invite, you must be registered and logged in as",
          "login": "Log In",
          "text1": "Would you like to accept",
          "text2": "invite to account",
          "text3": "with role",
          "explanation": "Press \"Accept\" below to continue",
          "accept": "Accept",
          "logout": "Log Out",
          "form": {
            "title": "Welcome!",
            "subtitle": "We're excited to have you join us",
            "text": "To accept your invite to Six CRM Please fill out the following information and you are all setup",
            "firstname": "First Name",
            "lastname": "Last Name",
            "cont": "Continue"
          },
          "thankyou": {
            "title": "Great! We've added you to the account.",
            "switchtext": "Switching between this and your other SIX accounts is easy. Just click the account button in the upper right hand side of the SIX and select the account you wish to access.",
            "signupinstructions": "To proceed, please Sign Up and Log In via Auth0.",
            "cont": "Continue"
          }
        },
        "infoscreen": {
          "noaccounts": {
            "title": "No Available Accounts",
            "text": "You do not have permission to view any active accounts. Contact an administrator for access, or create your own account."
          },
          "nobilling": {
            "title": "Select Payment Plan",
            "text": "Your account must have payment plan selected in order to continue"
          },
          "inactive": {
            "title": "Account Inactive",
            "text": "You cannot currently sign in to this account. Please contact your administrator for more information."
          },
          "nepermissions": {
            "title": "No Permissions",
            "text": "You do not have permissions to view content for this account. Contact an administrator for access."
          },
          "other": {
            "title": "Account Issues",
            "text": "There are some issues with this account. Please contact Account Owner."
          },
          "pay": "SETUP PAYMENT PLAN",
          "create": "CREATE ACCOUNT"
        },
        "share": {
          "title": "Share",
          "copy": "Copy to clipboard"
        },
        "pagination": {
          "rowsperpage": "Rows per page"
        },
        "snack": {
          "error": "Error occured, please try again",
          "updated": "Updated Successfully!",
          "created": "Created Successfully!",
          "deleted": "Deleted Successfully!"
        },
        "datepicker": {
          "apply": "Apply",
          "cancel": "Cancel",
          "jan": "Jan",
          "feb": "Feb",
          "mar": "Mar",
          "apr": "Apr",
          "may": "May",
          "jun": "June",
          "jul": "July",
          "aug": "Aug",
          "sep": "Sept",
          "oct": "Oct",
          "nov": "Nov",
          "dec": "Dec",
          "mon": "Mo",
          "tue": "Tu",
          "wed": "We",
          "thu": "Th",
          "fri": "Fr",
          "sat": "Sa",
          "sun": "Su",
          "today": "Today",
          "yesterday": "Yesterday",
          "day7": "Last 7 days",
          "day30": "Last 30 days",
          "custom": "Custom"
        },
        "errorpage": {
          "title": "Strong Effort.",
          "subtitle1": "It looks like something broke on our end,",
          "subtitle2": "or the page you are looking for doesn't exist.",
          "support": "If you think you found this page in error please contact"
        },
        "comingsoon": {
          "title1": "FEATURE",
          "title2": "IN DEVELOPMENT"
        }
      }
    }

  }
}
