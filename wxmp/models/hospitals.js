import { HTTP } from '../utils/http-p.js'

class hospitalsModel extends HTTP{
    //获取附近的医院
    getNearbyHospitals(latitude,longitude,start,pagesize){
        return this.request({
            url:`one/Home/hostpitals/iList.template?latitude=${latitude}&longitude=${longitude}&start=${start}&pageSize=${pagesize}`,
            method:'GET',
        })
    }
}

export{hospitalsModel}

