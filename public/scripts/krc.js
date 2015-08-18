var KeystoneClient = {
};

var KeystoneAPI = {
  query: function(cb, path, data, type) {
    $.ajax({
      url: '/v3' + path,
      crossDomain: true,
      type: typeof type !== 'undefined' ? type : 'GET',
      data: JSON.stringify(data),
      headers: KeystoneAPI.get_headers(),
    }).success(function(data, status, xhr) {
      cb(data, status, xhr);
      // console.log(data, status, xhr);
    }).error(function(data, status, xhr) {
      alert("ERROR");
      console.log("ERROR");
      console.log(data, status, xhr);
    });
  },
  auth_data: function(id, password) {
    return {
    "auth": {
        "identity": {
            "methods": [
                "password"
            ],
            "password": {
                "user": {
                    "id": id,
                    "password": password
                }
            }
        }
    }
};
  },
  get_headers: function() {
    headers = {
      'Content-type': 'application/json',
      'Accept': 'application/json',
    };
    token = localStorage.getItem('keystone_token');
    if (token !== '') {
      $.extend(headers, {'X-Auth-Token': token});
    }
    return headers;
  }
};

$(document).ready(function(){

  // login/create token and get service catalog
  KeystoneAPI.query(
    function(data, status, xhr){
      // localstorage is used temporary
      localStorage.setItem('keystone_token', xhr.getResponseHeader('X-Subject-Token'));
      // localStorage.setItem('keystone_catalog', JSON.stringify(data.token.catalog));
    },
    '/auth/tokens',
    KeystoneAPI.auth_data('USER_ID', 'PASSWORD'),
    'POST'
  );

  // list users
  KeystoneAPI.query(
    function(data){ console.log(data); },
    '/users'
  );

});
