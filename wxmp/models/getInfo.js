import { HTTP } from '../utils/http-p.js'

class getInfoModel extends HTTP{
    getPersonInfo(classification,id){
        return this.request({
            url:'one/Home/person/iGetPersonInfo.template?classification='+classification+'&id='+id,
            method:'GET',
        })
    }
}

export{getInfoModel}