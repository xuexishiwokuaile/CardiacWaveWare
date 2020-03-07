import { HTTP } from '../utils/http-p.js'

class analysisModel extends HTTP{
    getUserAnalysis(){
        return this.request({
            url:'one/Home/test.template',
            method:'GET',
        })
    }
}

export{analysisModel}