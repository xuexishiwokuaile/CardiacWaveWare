//返回参数验证函数,验证相应的开发结果
function _loginResult(results) {
  var fig = results[0].substring(0, 6); 	//获取对应的返回头信息

  if (fig == 'failed') {
    alert('登录失败：' + results[0].substring(7)); //根据相应返回头信息进行相应的解释
  } else {
    const userId = results[0];
    const userToken = results[1];
    const loginName = results[2];
    const classification = results[3];
    const userName = results[4];
    const loginId = results[5];
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('userToken', userToken);
    sessionStorage.setItem('classification', classification);
    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('loginName', loginName);
    sessionStorage.setItem('loginId', loginId);

    _loginPage(classification)
  }
}

/**
 * 登录相应的后台具体页面
 * @param classification
 * @private
 */
function _loginPage(classification){
  //记录相应的登录信息
  $.log("login");

  if (classification == '1') {
    location.href = '/pages/home/admin/src/views/console.html';
    //记录相应的用户登录信息
  } else if (classification == '2') {
    location.href = 'pages/home/medicalRecord/medicalRecordsList.html';
  } else if (classification == '3') {
    location.href = '/pages/home/clientMedicalRecord/clientMedicalRecords.html';
  } else {
    alert('登录出错！请联系管理员。error 200-classification');
  }
}