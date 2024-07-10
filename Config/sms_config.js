const axios = require('axios');


exports.sendOTP = function (Mobile, OTP, callback) { 
   // console.log(Mobile);
   if (Mobile !== undefined && Mobile !== null && Mobile !== '' && OTP !== undefined && OTP !== null && OTP !== '' ) {

      const params = new URLSearchParams();
      params.append('key', '25ECE50D1A3BD6');
      params.append('msg', 'Your Aquila OTP '+ OTP +'. This can be used one time only and is valid for 30 mins, please do not share it with anyone.');
      params.append('senderid', 'TXTDMO');
      params.append('routeid', '3');      
      params.append('contacts', Mobile);

      axios.post('https://sms.textmysms.com/app/smsapi/index.php', params).then(function (response) {
         callback(null, response.data);
         // console.log(response);
       }).catch(function (error) {
         //  console.log(error);
         callback('Some Error for sending OTP SMS!, Error: ' + error, null);
       });
   } else {
      callback('OTP send failed, purpose of invalid data {Mobile: ' + Mobile + ', OTP: ' + OTP + ' }', null);
   }
};
