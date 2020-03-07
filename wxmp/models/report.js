import { HTTP } from '../utils/http-p.js'

class reportModel extends HTTP{
    //获取病案列表
    getReportLists(classification,hospital,isChecked,keyword,clientid,page,number_per_page){
        return this.request({
            url:'one/Home/medicalRecord/iGetMedicalRecords.template?'+`classification=${classification}&hospital=${hospital}&isChecked=${isChecked}&keyword=${keyword}&clientid=${clientid}&page=${page}&number_per_page=${number_per_page}`,
            method:'GET',
        })
    }
    //获取病案的详细信息
    getAnalysisInfo(id,clientid){
        return this.request({
            url:'one/Home/medicalRecordAnalysis/iGetClientRecoredAnalysisInfo.template?'+`id=${id}&clientid=${clientid}`,
            method:'GET',
        })
    }
}

export{reportModel}


