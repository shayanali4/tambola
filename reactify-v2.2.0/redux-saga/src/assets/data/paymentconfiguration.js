export default [
  {
      name: 'Paytm',
      value: '1',
      parameters : {"mid" : "","secretkey" : "","website" :""},
      PaytmLables : [
        { "mid" : "Merchant ID"},
        { "secretkey" :"Secret Key" },
        {  "website" : "Website"}
        ]
  },
  {
      name: 'Paypal',
      value: '2',
      parameters : {"client_id" : "","secretkey" :""},
      PaytmLables : [
        { "client_id" :"Client Id" },
        { "secretkey" :"Secret Key" },
        ]
  },
  {
      name: 'Google Pay',
      value: '3',
      parameters : {"mid" : "", "mname" : ""},
      PaytmLables : [
        { "mid" : "Merchant ID"},
        { "mname" : "Merchant Name"}
        ]
  },
  // {
  //     name: 'Stripe',
  //     value: '4',
  //     parameters : {"publishablekey" : "","secretkey" : ""},
  //     PaytmLables : [
  //       { "publishablekey"   :   "Publishable key" },
  //       { "secretkey" :"Secret Key" },
  //       ]
  // }
];
