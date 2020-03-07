import { HTTP } from '../utils/http-p.js'

class registerModel extends HTTP {
    //用户注册
    clientReg(name, sex, phone, department, diabetes, drinking, height, hypertension, smoking, weight,pwd,age) {
        const data = `login_name=${phone}&passwd=${pwd}&classification=3&name=${name}&height=${height}
        &weight=${weight}&gender=${sex}&drinking=${drinking}&smoking=${smoking}
        &hypertension=${hypertension}&diabetes=${diabetes}&age=${age}&phone=${phone}&department=${department}`;
        return this.request({
            url: 'one/Home/person/client/iAddClient.template?' + data,
            method: 'POST',
        })
    }
    //医生注册
    doctorReg(name,phone,pwd,department){
        const data =`login_name=${phone}&passwd=${pwd}&classification=2&name=${name}&phone=${phone}&hospital=${department}`;
        return this.request({
            url: 'one/Home/person/doctor/iAddDoctor.template?' + data,
            method: 'POST',
        })
    }
    //获取医院的列表
    getHospitalList(){
        return this.request({
            url: 'one/Home/hostpitals/iGetHostpitalList.template',
            method: 'POST',
        })
    }
}

export { registerModel }