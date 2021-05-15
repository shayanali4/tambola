var axios = require ('axios');

exports.bm_adduser = function(req, res){
                const {client , user} = res.locals.oauth.token;
                let request_data = {
                      "ApiRequestInfo": {
                           "AuthToken": "COJJ7eiiPBGUfmIQPvh2PJWWDLX7OuKs",
                           "Operation": "AddUser",
                           "OperationData": {
                                "Name": "Luna",
                                "Signature": [],
                                "Priority": "User"
                           },
                           "OperationTime": "1554553162",
                           "UserId": "63",
                           "OperationReferenceId": "cams123123123"
                          },
                          "ServiceTagId": "ST-KY19123123"
                       }
                       // axios.post(/url).then(response =>
                       //     { writeLog({data :response ? response.data : {}});

      };
  exports.bm_adduserwithfingerprint = function(req, res){
                      const {client , user} = res.locals.oauth.token;
                        let request_data = {
                                         "ApiRequestInfo": {
                                              "AuthToken": "COJJ7eiiPBGUfmIQPvh2PJWWDLX7OuKs",
                                              "Operation": "AddUser",
                                              "OperationData": {
                                                   "Name": "Luna",
                                                   "Priority": "User",
                                                   "Signature": [
                                                        {
                                                             "AdditionalData1": "6",
                                                             "Template": "1F0iKMlP13GXmaJRKz+c8ASEK6Use3PMEl8zcDqehS9Yq77+AsAfLnZjIy3j3AT0y5vfuBU4KaiPJWok85YVgOtqedEnLoULAe8Y9LUmAKF78tnk1ym67P55lRIDm0sa4+RkITy3gMi64LkOpd0hL7/GJ+9E2TAhNuimRJ5r1lfsnZFWU/XZHcn0HADqzMbKtzsFiytbWk/DzTJm1vkVwrKfIjaNWrwp+uK/+jcclK9S7G8JM1zR4TT5UlJ9HSyP1Y3F05QXAXKnmuK53aBFMMKY8DlolO64yoIVhazViDvc/aekaoJ9TR3b3WeJmIMB2rUu0vCH/+E0DUmOR1/hqv7GgQyqk90HzLecTg9WkQr204z/Yr5X3jP2ROqM4SLREmSZbtNQu3dFbeZSmoL62eC/XnK3LWrxkEixlFte5oyycopX5G50DHzvmq5yKczXhqeDX6DABOMnF+F6ppMTKwYCpkyGk7Hv6BpuQDB8Xfm+gpcCOtsuGLbYCKuguXz5o4vasPFKkV7F6P5c9d1dviEH7bcOJEznZm0trx+Umv6sZsxKw2pSREnwCBa10mkefJyOZcMslrBRsRlKOKpTxZRm+lal0u4P7HMdVonnh4Hy//Dvm2orKa+7EyqIW8KZLlRSv3ARJw+ZJJRngb3QGizLcDNCJsY8Hcyg50/O7nCrHiIiatUBPo9Ncha99NU9/StCIJhGtt1NYLpQsfVdCIY+aWYRhH6LrW5PSqWNReNcNn543gIcEAU1am9wFAwkmiDJhTVyQY1S/ZI+ic3nMfZfyAKvNdjNKMlgM1EdfuoC+527ZDCmCio5FOnEVr8J3NzXh0N3vT00j2QxyTn0oE88RKtc9l/Ayt9Xqlv4Sl91Yndiop21/GsrX/iB84LXSQQmO1X2Ft5Gw8pAA4gGnoAid4loDywPtBw7Gu8FncjICm3JqgGEL/2zafKgSZiwJ9Hf6psua4znz32nH5IznTM9PiSqxwjRCJ5jmjI+BI19bHSQRNzuWcVl2BpEDYusdu32lA7WZ7SEJMq4tBVKf/Ec99FMBlTU4GjuLTemZvnd8/JdhgpOw9HNwCH6k5lpI2SYFskDmaJU31PQHOddKFVhnGsLHwPw0co1pFsLnVmtZ5Bptq2UW+wnbgGycAwdRsdwmwmt0QzL+tMTnyLlBqRgr88mIYi1zbExpyewidOVd9SttzAl1kVRqTkWA3u6I3Skcm0IvXHQIiCjZDTJ4fakcrDeOd/xR0pIFyjKhC/ZmZyU8k8iBJYDGXdmhtEH5byuTerENZNpD+Szphcl00S9kq3ji8eBQjPowOgvvvw6H3/ftjYCAZQkbOmk7E7MjLVUfzbDYfb3H2t1FrpjL899+NDdciMMtm/V70x8n+GgUdTQ9VqElAQAHQiGdm7Dk5wuZoM2/nto1BnIJwc6fRuzS8Armq8DH5NyZfvE1psz3S8if6pdsryhUXDiRv+AiV/0Jxtz3BZOCuqaytryCJb90xWwebqVmJvrGtL+pnSiL5375cPTWR+cuRDrMKDcWBsnQyUxKqLSkO1zT1rTnvxvdYSNQyPVXqyzCUWr8o/exlRFW2Tvd33Z/Ue/unXUtuTuwYMJJUAZzpoDNuKq9nZPSR+H2OrdIsAPJGGib1DOEy38hdoUzMIQ/Ood3XfOu2pBhnupkbTngAQrI0Eb0NwqjsTS/jzXaNMEa16Y4if72jnq5WIjYqOWi3eiMNfoL0om2ZPxPzvQ2yy5U9yN8TZSdQv57cO6AIvTlrm2CaNPIRkL0LgQVggOPYDvJnbeAWo0pvgAyu0Rpc16QY10/EAvkK3DrI/yN3msYCD4ox30dzjqSXyQSv1itl8Ylvq9bqvA0vk6u9yhceGvSgCJ4dFKpq9c80DGDzK9g9c5LvD97m9E5nsH929dhT4Vj+Ut3iOIWXR8C3hKeHDHuCjWOK/r1k3zqaNJEtnkNAZtf6/MzZzUcbU/H00o7mV+7sAh",
                                                             "Type": "Fingerprint"
                                                        }
                                                   ]
                                              },
                                              "OperationTime": "1554553164",
                                              "UserId": "63",
                                              "OperationReferenceId": "cams123123123"
                                         },
                                         "ServiceTagId": "ST-KY19123123"
                                    }
                             // axios.post(/url).then(response =>
                             //     { writeLog({data :response ? response.data : {}});

  };
exports.bm_deleteuser = function(req, res){
                            const {client , user} = res.locals.oauth.token;
                            let request_data =
                              {
                                         "ApiRequestInfo": {
                                              "AuthToken": "COJJ7eiiPBGUfmIQPvh2PJWWDLX7OuKs",
                                              "Operation": "DeleteUser",
                                              "OperationTime": "1554553162",
                                              "UserId": "63",
                                              "OperationReferenceId": "cams123123456"
                                         },
                                         "ServiceTagId": "ST-KY19123123"
                                }
                                   // axios.post(/url).then(response =>
                                   //     { writeLog({data :response ? response.data : {}});

  };
exports.bm_loadpunchload = function(req, res){
                                  const {client , user} = res.locals.oauth.token;
                                  let request_data =
                                    {
                                          "ServiceTagId": "ST-KY19123123",
                                          "ApiRequestInfo": {
                                            "AuthToken": "COJJ7eiiPBGUfmIQPvh2PJWWDLX7OuKs",
                                            "Operation": "LoadPunchLog",
                                            "OperationData": {
                                                 "StartTime": "1539605822",
                                                 "EndTime": "0",
                                                 "OffSet": "0"
                                            },
                                            "OperationReferenceId": "referid123123123"
                                          }
                                      }
                                         // axios.post(/url).then(response =>
                                         //     { writeLog({data :response ? response.data : {}});

                        };
    exports.bm_triggeruserdetail = function(req, res){
                              const {client , user} = res.locals.oauth.token;
                                    let request_data =
                                      {
                                        "ApiRequestInfo": {
                                               "AuthToken": "COJJ7eiiPBGUfmIQPvh2PJWWDLX7OuKs",
                                               "Operation": "TriggerUserDetail",
                                               "OperationReferenceId": "cams123123123"
                                          },
                                          "ServiceTagId": "ST-KY12312312"
                                      }
                 // axios.post(/url).then(response =>
                 //     { writeLog({data :response ? response.data : {}});
        };
